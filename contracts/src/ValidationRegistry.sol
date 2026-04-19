// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IIdentityRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function getApproved(uint256 tokenId) external view returns (address);
}

/**
 * @title ValidationRegistry
 * @notice ERC-8004 compliant on-chain proof layer for agent job completion.
 *
 * This is the key contract in AgentWork. When a worker agent finishes a job,
 * a validator calls recordValidation() with the job id, the result hash, and a
 * score (0–100). AgentEscrow.sol reads isValidated() before releasing USDC.
 *
 * Flow:
 *   1. Employer agent creates job (off-chain or in AgentEscrow.sol)
 *   2. Worker agent completes job, submits result hash off-chain to validator
 *   3. Validator calls recordValidation() — proof written on-chain
 *   4. AgentEscrow.sol calls isValidated(jobId) — if true, releases escrow
 *
 * MVP scope:
 *   - Any address can be a validator (no staking / slashing yet)
 *   - One validation record per jobId (first write wins)
 *   - Validator can dispute their own record within the dispute window (1 hour)
 *   - AgentEscrow can be set as the trusted escrow to allow job-level permission checks
 *   - Score: 0 = fail, 1–100 = pass (AgentEscrow only releases on score > 0)
 */
contract ValidationRegistry is Ownable {
    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    enum ValidationState { Pending, Validated, Disputed }

    struct ValidationRecord {
        uint256 agentId;         // ERC-8004 id of the worker agent
        address validator;       // address that recorded the proof
        bytes32 resultHash;      // keccak256 of the job output (agreed off-chain)
        uint8   score;           // 0 = fail, 1–100 = pass
        string  tag;             // job category (e.g. "summarization")
        string  resultURI;       // off-chain pointer to full result (IPFS / HTTPS)
        ValidationState state;
        uint256 timestamp;
    }

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    IIdentityRegistry public immutable identityRegistry;

    // jobId => ValidationRecord
    mapping(bytes32 => ValidationRecord) private _records;

    // agentId => list of jobIds validated (for querying agent history)
    mapping(uint256 => bytes32[]) private _agentJobs;

    // validator => list of jobIds they validated
    mapping(address => bytes32[]) private _validatorJobs;

    // How long a validator can dispute their own record
    uint256 public constant DISPUTE_WINDOW = 1 hours;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event ValidationRecorded(
        bytes32 indexed jobId,
        uint256 indexed agentId,
        address indexed validator,
        bytes32 resultHash,
        uint8   score,
        string  tag
    );

    event ValidationDisputed(
        bytes32 indexed jobId,
        address indexed validator
    );

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(address identityRegistry_) Ownable(msg.sender) {
        require(identityRegistry_ != address(0), "ValidationRegistry: zero address");
        identityRegistry = IIdentityRegistry(identityRegistry_);
    }

    // -------------------------------------------------------------------------
    // Write
    // -------------------------------------------------------------------------

    /**
     * @notice Record on-chain proof that a job was completed by a registered agent.
     *
     * @param jobId       Unique job identifier (e.g. keccak256 of escrow address + nonce).
     * @param agentId     ERC-8004 token id of the worker agent (must exist).
     * @param resultHash  keccak256 of the job output. Agreed between worker and validator
     *                    off-chain before this call.
     * @param score       0 = job failed/rejected. 1–100 = success quality score.
     *                    AgentEscrow only releases funds when score > 0.
     * @param tag         Short category string (e.g. "summarization", "code-review").
     * @param resultURI   Off-chain pointer to the full result artifact (IPFS CID, HTTPS URL).
     *
     * Only callable once per jobId. Reverts if a record already exists.
     */
    function recordValidation(
        bytes32 jobId,
        uint256 agentId,
        bytes32 resultHash,
        uint8   score,
        string calldata tag,
        string calldata resultURI
    ) external {
        require(_records[jobId].validator == address(0), "ValidationRegistry: already recorded");
        require(score <= 100, "ValidationRegistry: score > 100");

        // Confirm the agent actually exists in the identity registry
        identityRegistry.ownerOf(agentId); // reverts with ERC721NonexistentToken if not

        _records[jobId] = ValidationRecord({
            agentId:   agentId,
            validator: msg.sender,
            resultHash: resultHash,
            score:     score,
            tag:       tag,
            resultURI: resultURI,
            state:     score > 0 ? ValidationState.Validated : ValidationState.Pending,
            timestamp: block.timestamp
        });

        _agentJobs[agentId].push(jobId);
        _validatorJobs[msg.sender].push(jobId);

        emit ValidationRecorded(jobId, agentId, msg.sender, resultHash, score, tag);
    }

    /**
     * @notice Validator can dispute (retract) their own record within the dispute window.
     *         Useful if an error was made. After DISPUTE_WINDOW the record is permanent.
     *         Escrow should check state == Validated, not just score > 0, when disputing.
     */
    function disputeValidation(bytes32 jobId) external {
        ValidationRecord storage r = _records[jobId];
        require(r.validator == msg.sender, "ValidationRegistry: not your record");
        require(r.state != ValidationState.Disputed, "ValidationRegistry: already disputed");
        require(block.timestamp <= r.timestamp + DISPUTE_WINDOW, "ValidationRegistry: window closed");

        r.state = ValidationState.Disputed;
        emit ValidationDisputed(jobId, msg.sender);
    }

    // -------------------------------------------------------------------------
    // Read — used by AgentEscrow.sol
    // -------------------------------------------------------------------------

    /**
     * @notice Primary check used by AgentEscrow: is this job validated with a passing score?
     * @return True iff state == Validated AND score > 0.
     */
    function isValidated(bytes32 jobId) external view returns (bool) {
        ValidationRecord storage r = _records[jobId];
        return r.state == ValidationState.Validated && r.score > 0;
    }

    /**
     * @notice Full validation record for a job.
     */
    function getValidation(bytes32 jobId)
        external
        view
        returns (
            uint256 agentId,
            address validator,
            bytes32 resultHash,
            uint8   score,
            string memory tag,
            string memory resultURI,
            ValidationState state,
            uint256 timestamp
        )
    {
        ValidationRecord storage r = _records[jobId];
        require(r.validator != address(0), "ValidationRegistry: unknown job");
        return (r.agentId, r.validator, r.resultHash, r.score, r.tag, r.resultURI, r.state, r.timestamp);
    }

    /**
     * @notice All jobIds validated for a given agent (for reputation / history queries).
     */
    function getAgentJobs(uint256 agentId) external view returns (bytes32[] memory) {
        return _agentJobs[agentId];
    }

    /**
     * @notice All jobIds a specific validator has recorded.
     */
    function getValidatorJobs(address validator) external view returns (bytes32[] memory) {
        return _validatorJobs[validator];
    }

    /**
     * @notice Aggregate pass rate for an agent across all their validated jobs.
     * @return total   Number of validation records.
     * @return passed  Number with state == Validated and score > 0.
     */
    function getAgentPassRate(uint256 agentId)
        external
        view
        returns (uint256 total, uint256 passed)
    {
        bytes32[] storage jobs = _agentJobs[agentId];
        total = jobs.length;
        for (uint256 i; i < jobs.length; i++) {
            ValidationRecord storage r = _records[jobs[i]];
            if (r.state == ValidationState.Validated && r.score > 0) passed++;
        }
    }
}
