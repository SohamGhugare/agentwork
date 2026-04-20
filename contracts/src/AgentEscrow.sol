// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ----------------------------------------------------------------------------
// Registry interfaces (matches deployed contracts)
// ----------------------------------------------------------------------------

interface IIdentityRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getAgentWallet(uint256 agentId) external view returns (address);
}

interface IReputationRegistry {
    /// @dev averageScore is score * 100 (e.g. 4.50 => 450)
    function getSummary(uint256 agentId, string calldata tag)
        external view returns (uint64 count, uint256 averageScore);

    function giveFeedback(
        uint256 agentId,
        uint8   score,
        string calldata tag,
        string calldata comment
    ) external;
}

interface IValidationRegistry {
    /// @return True iff state == Validated AND score > 0
    function isValidated(bytes32 jobId) external view returns (bool);

    function getValidation(bytes32 jobId)
        external view
        returns (
            uint256 agentId,
            address validator,
            bytes32 resultHash,
            uint8   score,
            string memory tag,
            string memory resultURI,
            uint8   state,
            uint256 timestamp
        );
}

/**
 * @title AgentEscrow
 * @notice The central settlement contract for AgentWork.
 *
 * Lifecycle:
 *   Open → Accepted → Claimed
 *   Open → Cancelled           (employer cancels before acceptance)
 *   Accepted → Expired         (employer reclaims if deadline passes without validation)
 *
 * Integration:
 *   - IdentityRegistry  — verify worker agent exists, resolve hot wallet
 *   - ReputationRegistry — gate acceptance by minReputation, record feedback on completion
 *   - ValidationRegistry — release payment only when isValidated(jobId) == true
 *   - JobRelay           — can call postJob() on behalf of a cross-chain employer (ICM path)
 *
 * Payment token:
 *   USDC (ERC-20, 6 decimals). Employer must approve this contract before calling postJob().
 *   Fuji testnet USDC: 0x5425890298aed601595a70AB815c96711a31Bc65
 */
contract AgentEscrow is Ownable {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    enum JobStatus { Open, Accepted, Claimed, Cancelled, Expired }

    struct Job {
        string     capability;
        string     description;
        uint256    paymentAmount;   // USDC amount locked (6 decimals)
        uint256    deadline;        // unix timestamp — job must be validated by this
        uint256    minReputation;   // averageScore * 100 threshold (e.g. 350 = 3.50/5.00)
        address    employer;        // funded and posted by this address
        address    worker;          // hot wallet of accepting agent (set on acceptJob)
        uint256    workerAgentId;   // ERC-8004 token id of the worker (set on acceptJob)
        JobStatus  status;
        uint256    postedAt;
    }

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    IERC20 public immutable usdc;
    IIdentityRegistry   public immutable identityRegistry;
    IReputationRegistry public immutable reputationRegistry;
    IValidationRegistry public immutable validationRegistry;

    /// @dev Trusted relay contract — allowed to call postJob without transferring USDC directly.
    ///      The relay is responsible for ensuring funds are bridged separately.
    ///      Set to address(0) to disable the relay path.
    address public trustedRelay;

    mapping(bytes32 => Job) private _jobs;

    // Employer's open job count (to prevent spam)
    mapping(address => uint256) public openJobCount;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event JobPosted(
        bytes32 indexed jobId,
        address indexed employer,
        string  capability,
        uint256 paymentAmount,
        uint256 deadline
    );

    event JobAccepted(
        bytes32 indexed jobId,
        uint256 indexed workerAgentId,
        address         workerWallet
    );

    event PaymentReleased(
        bytes32 indexed jobId,
        uint256 indexed workerAgentId,
        address         workerWallet,
        uint256         amount
    );

    event JobCancelled(bytes32 indexed jobId, address indexed employer);
    event JobExpired(bytes32 indexed jobId, address indexed employer);
    event TrustedRelaySet(address indexed relay);

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error JobNotFound(bytes32 jobId);
    error JobNotOpen(bytes32 jobId, JobStatus status);
    error JobNotAccepted(bytes32 jobId, JobStatus status);
    error NotEmployer(bytes32 jobId);
    error NotWorker(bytes32 jobId);
    error DeadlinePassed(bytes32 jobId);
    error DeadlineNotPassed(bytes32 jobId);
    error ReputationTooLow(uint256 agentId, uint256 required, uint256 actual);
    error NotValidated(bytes32 jobId);
    error JobAlreadyExists(bytes32 jobId);
    error InvalidDeadline();
    error ZeroPayment();
    error Unauthorized();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /**
     * @param usdc_               ERC-20 payment token (USDC).
     * @param identityRegistry_   Deployed IdentityRegistry address.
     * @param reputationRegistry_ Deployed ReputationRegistry address.
     * @param validationRegistry_ Deployed ValidationRegistry address.
     */
    constructor(
        address usdc_,
        address identityRegistry_,
        address reputationRegistry_,
        address validationRegistry_
    ) Ownable(msg.sender) {
        require(usdc_               != address(0), "AgentEscrow: zero usdc");
        require(identityRegistry_   != address(0), "AgentEscrow: zero identity");
        require(reputationRegistry_ != address(0), "AgentEscrow: zero reputation");
        require(validationRegistry_ != address(0), "AgentEscrow: zero validation");

        usdc               = IERC20(usdc_);
        identityRegistry   = IIdentityRegistry(identityRegistry_);
        reputationRegistry = IReputationRegistry(reputationRegistry_);
        validationRegistry = IValidationRegistry(validationRegistry_);
    }

    // -------------------------------------------------------------------------
    // Job posting
    // -------------------------------------------------------------------------

    /**
     * @notice Post a job and lock USDC in escrow.
     *         Caller must have approved this contract for `paymentAmount` USDC.
     *
     *         Also callable by the trusted JobRelay (ICM path). In that case,
     *         `employer` is the originating agent's address on their home L1 and
     *         USDC must have been pre-deposited or bridged separately.
     *
     * @param jobId          Unique job id. Reverts if already exists.
     * @param capability     Required worker capability (e.g. "summarization").
     * @param description    Task description.
     * @param paymentAmount  USDC amount (6 decimals) to lock. Must be > 0.
     * @param deadline       Unix timestamp by which the job must be completed.
     * @param minReputation  Minimum worker reputation as averageScore * 100 (0 = no gating).
     * @param employer       Address that funded the job. Must == msg.sender unless caller is relay.
     */
    function postJob(
        bytes32 jobId,
        string calldata capability,
        string calldata description,
        uint256 paymentAmount,
        uint256 deadline,
        uint256 minReputation,
        address employer
    ) external {
        if (_jobs[jobId].postedAt != 0) revert JobAlreadyExists(jobId);
        if (paymentAmount == 0) revert ZeroPayment();
        if (deadline <= block.timestamp) revert InvalidDeadline();

        // Only the employer themselves or the trusted relay can post on their behalf
        if (msg.sender != employer && msg.sender != trustedRelay) revert Unauthorized();

        // Transfer USDC from employer into escrow.
        // For the ICM relay path, funds must arrive via a separate bridge transfer
        // before or after this call — the relay is trusted to ensure this.
        usdc.safeTransferFrom(employer, address(this), paymentAmount);

        _jobs[jobId] = Job({
            capability:    capability,
            description:   description,
            paymentAmount: paymentAmount,
            deadline:      deadline,
            minReputation: minReputation,
            employer:      employer,
            worker:        address(0),
            workerAgentId: 0,
            status:        JobStatus.Open,
            postedAt:      block.timestamp
        });

        openJobCount[employer]++;

        emit JobPosted(jobId, employer, capability, paymentAmount, deadline);
    }

    // -------------------------------------------------------------------------
    // Job acceptance
    // -------------------------------------------------------------------------

    /**
     * @notice Accept an open job as a registered worker agent.
     *         Caller must be the owner or registered hot wallet of `agentId`.
     *
     * @param jobId    Job to accept.
     * @param agentId  ERC-8004 token id of the accepting worker agent.
     */
    function acceptJob(bytes32 jobId, uint256 agentId) external {
        Job storage job = _getJob(jobId);

        if (job.status != JobStatus.Open) revert JobNotOpen(jobId, job.status);
        if (block.timestamp > job.deadline) revert DeadlinePassed(jobId);

        // Verify caller controls this agent (owner or registered hot wallet)
        address agentOwner  = identityRegistry.ownerOf(agentId);
        address agentWallet = identityRegistry.getAgentWallet(agentId);
        require(
            msg.sender == agentOwner || (agentWallet != address(0) && msg.sender == agentWallet),
            "AgentEscrow: not agent controller"
        );

        // Gate by reputation if set
        if (job.minReputation > 0) {
            (, uint256 avgScore) = reputationRegistry.getSummary(agentId, job.capability);
            if (avgScore < job.minReputation) {
                revert ReputationTooLow(agentId, job.minReputation, avgScore);
            }
        }

        job.status        = JobStatus.Accepted;
        job.workerAgentId = agentId;
        job.worker        = msg.sender;

        emit JobAccepted(jobId, agentId, msg.sender);
    }

    // -------------------------------------------------------------------------
    // Payment release
    // -------------------------------------------------------------------------

    /**
     * @notice Claim payment for a completed and validated job.
     *         Callable by the worker (or anyone — but funds go to the worker wallet).
     *         Reads ValidationRegistry.isValidated(jobId) — reverts if not yet validated.
     *         On success: releases USDC to worker, records reputation feedback (score 5).
     *
     * @param jobId  The job to claim payment for.
     */
    function claimPayment(bytes32 jobId) external {
        Job storage job = _getJob(jobId);

        if (job.status != JobStatus.Accepted) revert JobNotAccepted(jobId, job.status);

        // Must be the recorded worker or the agent owner
        address agentOwner = identityRegistry.ownerOf(job.workerAgentId);
        require(
            msg.sender == job.worker || msg.sender == agentOwner,
            "AgentEscrow: not worker"
        );

        // Core check: validation must be recorded in ERC-8004 Validation Registry
        if (!validationRegistry.isValidated(jobId)) revert NotValidated(jobId);

        // Mark claimed before external calls (CEI pattern)
        job.status = JobStatus.Claimed;
        openJobCount[job.employer] = openJobCount[job.employer] > 0
            ? openJobCount[job.employer] - 1
            : 0;

        uint256 amount  = job.paymentAmount;
        address worker  = job.worker;
        uint256 agentId = job.workerAgentId;
        string memory cap = job.capability;

        // Release USDC to worker
        usdc.safeTransfer(worker, amount);
        emit PaymentReleased(jobId, agentId, worker, amount);

        // Record positive reputation feedback on-chain.
        // Score = 5 (max) for a validated, paid job. Escrow is the reviewer.
        // Anti-self-feedback check in ReputationRegistry will pass since
        // the escrow contract is not the agent's owner.
        try reputationRegistry.giveFeedback(agentId, 5, cap, "Validated job - auto-feedback from AgentEscrow") {
            // best-effort: do not revert the payment if feedback fails
        } catch {}
    }

    // -------------------------------------------------------------------------
    // Cancellation & expiry
    // -------------------------------------------------------------------------

    /**
     * @notice Employer cancels an Open job and reclaims their USDC.
     *         Not callable once a worker has accepted.
     */
    function cancelJob(bytes32 jobId) external {
        Job storage job = _getJob(jobId);

        if (job.status != JobStatus.Open) revert JobNotOpen(jobId, job.status);
        if (msg.sender != job.employer) revert NotEmployer(jobId);

        job.status = JobStatus.Cancelled;
        openJobCount[job.employer] = openJobCount[job.employer] > 0
            ? openJobCount[job.employer] - 1
            : 0;

        usdc.safeTransfer(job.employer, job.paymentAmount);
        emit JobCancelled(jobId, job.employer);
    }

    /**
     * @notice Reclaim USDC from an Accepted job that has passed its deadline
     *         without a validated result being recorded.
     *         Callable by the employer only.
     */
    function reclaimExpired(bytes32 jobId) external {
        Job storage job = _getJob(jobId);

        if (job.status != JobStatus.Accepted) revert JobNotAccepted(jobId, job.status);
        if (msg.sender != job.employer) revert NotEmployer(jobId);
        if (block.timestamp <= job.deadline) revert DeadlineNotPassed(jobId);

        // Confirmed expired — validation did not arrive in time
        job.status = JobStatus.Expired;
        openJobCount[job.employer] = openJobCount[job.employer] > 0
            ? openJobCount[job.employer] - 1
            : 0;

        usdc.safeTransfer(job.employer, job.paymentAmount);
        emit JobExpired(jobId, job.employer);
    }

    // -------------------------------------------------------------------------
    // Views
    // -------------------------------------------------------------------------

    function getJob(bytes32 jobId)
        external
        view
        returns (
            string memory capability,
            string memory description,
            uint256 paymentAmount,
            uint256 deadline,
            uint256 minReputation,
            address employer,
            address worker,
            uint256 workerAgentId,
            JobStatus status,
            uint256 postedAt
        )
    {
        Job storage j = _getJob(jobId);
        return (
            j.capability, j.description, j.paymentAmount, j.deadline,
            j.minReputation, j.employer, j.worker, j.workerAgentId,
            j.status, j.postedAt
        );
    }

    function jobExists(bytes32 jobId) external view returns (bool) {
        return _jobs[jobId].postedAt != 0;
    }

    function isReadyToClaim(bytes32 jobId) external view returns (bool) {
        Job storage j = _jobs[jobId];
        return j.status == JobStatus.Accepted && validationRegistry.isValidated(jobId);
    }

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------

    /**
     * @notice Set the trusted relay (JobRelay contract) that can call postJob
     *         on behalf of a cross-chain employer.
     */
    function setTrustedRelay(address relay_) external onlyOwner {
        trustedRelay = relay_;
        emit TrustedRelaySet(relay_);
    }

    // -------------------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------------------

    function _getJob(bytes32 jobId) internal view returns (Job storage) {
        Job storage j = _jobs[jobId];
        if (j.postedAt == 0) revert JobNotFound(jobId);
        return j;
    }
}
