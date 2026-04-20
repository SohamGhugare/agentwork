// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ----------------------------------------------------------------------------
// Minimal Teleporter interfaces (vendored from ava-labs/icm-contracts v1.0.9)
// Full source: https://github.com/ava-labs/icm-contracts
// TeleporterMessenger is deployed at 0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf
// on every chain (Fuji C-Chain, any L1, mainnet — same address everywhere).
// ----------------------------------------------------------------------------

struct TeleporterFeeInfo {
    address feeTokenAddress;
    uint256 amount;
}

struct TeleporterMessageInput {
    bytes32 destinationBlockchainID;
    address destinationAddress;
    TeleporterFeeInfo feeInfo;
    uint256 requiredGasLimit;
    address[] allowedRelayerAddresses;
    bytes message;
}

interface ITeleporterMessenger {
    function sendCrossChainMessage(
        TeleporterMessageInput calldata messageInput
    ) external returns (bytes32 messageID);
}

interface ITeleporterReceiver {
    function receiveTeleporterMessage(
        bytes32 sourceBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external;
}

// ----------------------------------------------------------------------------
// Minimal AgentEscrow interface — implemented by the C-Chain escrow contract.
// JobRelay calls postJob() after decoding an inbound ICM message.
// ----------------------------------------------------------------------------

interface IAgentEscrow {
    function postJob(
        bytes32 jobId,
        string calldata capability,
        string calldata description,
        uint256 paymentAmount,
        uint256 deadline,
        uint256 minReputation,
        address employer
    ) external;
}

/**
 * @title JobRelay
 * @notice Avalanche ICM bridge that lets agents on any L1 post jobs to the
 *         AgentWork escrow on C-Chain without bridging assets.
 *
 * Deploy on TWO chains:
 *   - Source L1  : agents call dispatchJob() to send a cross-chain job intent
 *   - C-Chain    : receives the ICM message, decodes it, calls AgentEscrow.postJob()
 *
 * Flow:
 *   1. Employer agent on L1 calls dispatchJob()
 *   2. TeleporterMessenger emits the message; a relayer picks it up
 *   3. TeleporterMessenger on C-Chain calls receiveTeleporterMessage() on this contract
 *   4. This contract calls AgentEscrow.postJob() — job is live
 *
 * MVP scope:
 *   - No relay fees (open relayer, amount = 0)
 *   - No ERC-20 payment bridging — payment accounting is handled off-chain or
 *     by a separate USDC bridge; this contract only relays the job intent
 *   - Only the Teleporter messenger can call receiveTeleporterMessage()
 *   - Owner can update the escrow address and the trusted remote relay address
 */
contract JobRelay is ITeleporterReceiver {
    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    /// @dev Universal TeleporterMessenger address (same on every EVM chain).
    ///      Source: ava-labs/icm-contracts v1.x.x
    address public constant TELEPORTER_MESSENGER =
        0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf;

    /// @dev Gas budget for executing receiveTeleporterMessage on the destination.
    ///      Enough for decoding + one external call. Tune upward if escrow logic grows.
    uint256 public constant RECEIVE_GAS_LIMIT = 150_000;

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    address public owner;

    /// @dev C-Chain: address of AgentEscrow.sol. Only used on the C-Chain instance.
    address public agentEscrow;

    /// @dev The blockchain ID of the destination chain (C-Chain on Fuji =
    ///      0x7fc93d85c6d62be589232424924ce2b9d5e236eaa34fca6b7c4db0d6eb7e5c0).
    ///      Set on the SOURCE L1 instance.
    bytes32 public destinationChainID;

    /// @dev Address of the JobRelay deployed on the destination chain.
    ///      Set on the SOURCE L1 instance.
    address public destinationRelay;

    /// @dev Source blockchain IDs allowed to send messages to this contract.
    ///      Prevents spoofed relays from unknown chains. Key: chainID => allowed.
    mapping(bytes32 => bool) public allowedSources;

    /// @dev Tracks dispatched job IDs to prevent replays on the source side.
    mapping(bytes32 => bool) public dispatched;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event JobDispatched(
        bytes32 indexed jobId,
        bytes32 indexed destinationChainID,
        address indexed employer,
        string  capability,
        uint256 paymentAmount
    );

    event JobReceived(
        bytes32 indexed jobId,
        bytes32 indexed sourceChainID,
        address indexed employer,
        string  capability
    );

    event EscrowUpdated(address indexed newEscrow);
    event DestinationUpdated(bytes32 indexed chainID, address indexed relay);
    event AllowedSourceSet(bytes32 indexed chainID, bool allowed);

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error OnlyOwner();
    error OnlyTeleporter();
    error UnknownSource(bytes32 chainID);
    error JobAlreadyDispatched(bytes32 jobId);
    error ZeroAddress();

    // -------------------------------------------------------------------------
    // Modifiers
    // -------------------------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier onlyTeleporter() {
        if (msg.sender != TELEPORTER_MESSENGER) revert OnlyTeleporter();
        _;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /**
     * @param agentEscrow_        Address of AgentEscrow on this chain.
     *                            Pass address(0) on the source L1 (not needed there).
     * @param destinationChainID_ bytes32 blockchain ID of C-Chain.
     *                            Pass bytes32(0) on C-Chain (it IS the destination).
     * @param destinationRelay_   Address of JobRelay deployed on C-Chain.
     *                            Pass address(0) on C-Chain.
     */
    constructor(
        address agentEscrow_,
        bytes32 destinationChainID_,
        address destinationRelay_
    ) {
        owner = msg.sender;
        agentEscrow = agentEscrow_;
        destinationChainID = destinationChainID_;
        destinationRelay = destinationRelay_;
    }

    // -------------------------------------------------------------------------
    // Source L1: send a job intent cross-chain
    // -------------------------------------------------------------------------

    /**
     * @notice Pack a job intent and send it via ICM to the C-Chain JobRelay.
     *         Called by an employer agent on the source L1.
     *
     * @param jobId          Unique job identifier. Caller is responsible for
     *                       uniqueness — recommend keccak256(abi.encode(msg.sender, nonce)).
     * @param capability     Required worker capability (e.g. "summarization").
     * @param description    Human-readable task description.
     * @param paymentAmount  Payment in USDC micro-units (6 decimals). Escrow handles
     *                       the actual token lock; this is the agreed amount.
     * @param deadline       Unix timestamp by which the job must be completed.
     * @param minReputation  Minimum ERC-8004 reputation score (0–500, representing 0.0–5.0).
     *
     * @return messageID     Teleporter message ID returned by sendCrossChainMessage.
     */
    function dispatchJob(
        bytes32 jobId,
        string calldata capability,
        string calldata description,
        uint256 paymentAmount,
        uint256 deadline,
        uint256 minReputation
    ) external returns (bytes32 messageID) {
        if (dispatched[jobId]) revert JobAlreadyDispatched(jobId);
        if (destinationRelay == address(0)) revert ZeroAddress();

        dispatched[jobId] = true;

        // Encode the full job payload
        bytes memory payload = abi.encode(
            jobId,
            capability,
            description,
            paymentAmount,
            deadline,
            minReputation,
            msg.sender // employer address — preserved across chains
        );

        messageID = ITeleporterMessenger(TELEPORTER_MESSENGER).sendCrossChainMessage(
            TeleporterMessageInput({
                destinationBlockchainID: destinationChainID,
                destinationAddress: destinationRelay,
                feeInfo: TeleporterFeeInfo({
                    feeTokenAddress: address(0),
                    amount: 0
                }),
                requiredGasLimit: RECEIVE_GAS_LIMIT,
                allowedRelayerAddresses: new address[](0), // any relayer
                message: payload
            })
        );

        emit JobDispatched(jobId, destinationChainID, msg.sender, capability, paymentAmount);
    }

    // -------------------------------------------------------------------------
    // C-Chain: receive ICM message and forward to AgentEscrow
    // -------------------------------------------------------------------------

    /**
     * @notice Called by TeleporterMessenger on C-Chain when a job intent arrives.
     *         Decodes the payload and calls AgentEscrow.postJob().
     *
     * @param sourceBlockchainID  The bytes32 ID of the originating chain.
     * @param message             ABI-encoded job payload from dispatchJob().
     */
    function receiveTeleporterMessage(
        bytes32 sourceBlockchainID,
        address, /* originSenderAddress — MVP: gating by chainID; production: check == known relay */
        bytes calldata message
    ) external override onlyTeleporter {
        // Only accept messages from whitelisted source chains.
        // Production hardening: also validate originSenderAddress == known relay address.
        if (!allowedSources[sourceBlockchainID]) {
            revert UnknownSource(sourceBlockchainID);
        }

        // Decode the job payload
        (
            bytes32 jobId,
            string memory capability,
            string memory description,
            uint256 paymentAmount,
            uint256 deadline,
            uint256 minReputation,
            address employer
        ) = abi.decode(message, (bytes32, string, string, uint256, uint256, uint256, address));

        emit JobReceived(jobId, sourceBlockchainID, employer, capability);

        // Forward to AgentEscrow if set — allows testing relay without escrow
        if (agentEscrow != address(0)) {
            IAgentEscrow(agentEscrow).postJob(
                jobId,
                capability,
                description,
                paymentAmount,
                deadline,
                minReputation,
                employer
            );
        }
    }

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------

    function setAgentEscrow(address escrow_) external onlyOwner {
        if (escrow_ == address(0)) revert ZeroAddress();
        agentEscrow = escrow_;
        emit EscrowUpdated(escrow_);
    }

    function setDestination(bytes32 chainID_, address relay_) external onlyOwner {
        if (relay_ == address(0)) revert ZeroAddress();
        destinationChainID = chainID_;
        destinationRelay = relay_;
        emit DestinationUpdated(chainID_, relay_);
    }

    /**
     * @notice Whitelist a source blockchain ID so its messages are accepted.
     *         Call on the C-Chain instance with the L1's blockchain ID.
     */
    function setAllowedSource(bytes32 chainID_, bool allowed_) external onlyOwner {
        allowedSources[chainID_] = allowed_;
        emit AllowedSourceSet(chainID_, allowed_);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        owner = newOwner;
    }
}
