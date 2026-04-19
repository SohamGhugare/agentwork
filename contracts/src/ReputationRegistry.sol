// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IIdentityRegistry {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getApproved(uint256 tokenId) external view returns (bool);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

/**
 * @title ReputationRegistry
 * @notice ERC-8004 compliant reputation layer for registered agents.
 *
 * After a job completes, the employer (or any third party) calls giveFeedback()
 * with a score (1–5) and optional tags. Scores are aggregated on-chain so
 * AgentEscrow.sol (and anyone else) can gate job acceptance by reputation.
 *
 * MVP scope:
 *   - Integer scores 1–5 (no decimal precision needed yet)
 *   - Tag field for grouping feedback by job type (e.g. "summarization", "audit")
 *   - Self-feedback blocked: agent owner/operators cannot rate themselves
 *   - Revocation: a reviewer can retract their own feedback
 *   - getSummary: returns (count, averageScore * 100) for easy comparison
 */
contract ReputationRegistry is Ownable {
    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    struct Feedback {
        uint8  score;       // 1–5
        string tag;         // job category, e.g. "summarization"
        string comment;     // freeform, kept short (off-chain content can use feedbackURI)
        bool   isRevoked;
        uint256 timestamp;
    }

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    IIdentityRegistry public immutable identityRegistry;

    // agentId => reviewer => feedbackIndex (1-indexed) => Feedback
    mapping(uint256 => mapping(address => mapping(uint64 => Feedback))) private _feedback;

    // agentId => reviewer => count of feedback entries
    mapping(uint256 => mapping(address => uint64)) private _lastIndex;

    // agentId => all reviewers (for iteration)
    mapping(uint256 => address[]) private _reviewers;
    mapping(uint256 => mapping(address => bool)) private _reviewerExists;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event FeedbackGiven(
        uint256 indexed agentId,
        address indexed reviewer,
        uint64 indexed feedbackIndex,
        uint8 score,
        string tag
    );

    event FeedbackRevoked(
        uint256 indexed agentId,
        address indexed reviewer,
        uint64 indexed feedbackIndex
    );

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(address identityRegistry_) Ownable(msg.sender) {
        require(identityRegistry_ != address(0), "ReputationRegistry: zero address");
        identityRegistry = IIdentityRegistry(identityRegistry_);
    }

    // -------------------------------------------------------------------------
    // Write
    // -------------------------------------------------------------------------

    /**
     * @notice Leave feedback for a registered agent after a job.
     * @param agentId   ERC-8004 agent token id (must exist in IdentityRegistry).
     * @param score     1 (poor) to 5 (excellent).
     * @param tag       Short job category string, e.g. "summarization".
     * @param comment   Optional freeform comment (keep short; rich content goes off-chain).
     */
    function giveFeedback(
        uint256 agentId,
        uint8 score,
        string calldata tag,
        string calldata comment
    ) external {
        require(score >= 1 && score <= 5, "ReputationRegistry: score must be 1-5");

        // Block self-feedback: agent owner and operators cannot rate themselves
        address agentOwner = identityRegistry.ownerOf(agentId);
        require(
            msg.sender != agentOwner &&
            !identityRegistry.isApprovedForAll(agentOwner, msg.sender),
            "ReputationRegistry: no self-feedback"
        );

        uint64 idx = ++_lastIndex[agentId][msg.sender];
        _feedback[agentId][msg.sender][idx] = Feedback({
            score:     score,
            tag:       tag,
            comment:   comment,
            isRevoked: false,
            timestamp: block.timestamp
        });

        if (!_reviewerExists[agentId][msg.sender]) {
            _reviewers[agentId].push(msg.sender);
            _reviewerExists[agentId][msg.sender] = true;
        }

        emit FeedbackGiven(agentId, msg.sender, idx, score, tag);
    }

    /**
     * @notice Retract your own feedback entry.
     */
    function revokeFeedback(uint256 agentId, uint64 feedbackIndex) external {
        require(feedbackIndex > 0 && feedbackIndex <= _lastIndex[agentId][msg.sender],
            "ReputationRegistry: invalid index");
        require(!_feedback[agentId][msg.sender][feedbackIndex].isRevoked,
            "ReputationRegistry: already revoked");

        _feedback[agentId][msg.sender][feedbackIndex].isRevoked = true;
        emit FeedbackRevoked(agentId, msg.sender, feedbackIndex);
    }

    // -------------------------------------------------------------------------
    // Read
    // -------------------------------------------------------------------------

    /**
     * @notice Read a single feedback entry.
     */
    function readFeedback(uint256 agentId, address reviewer, uint64 feedbackIndex)
        external
        view
        returns (uint8 score, string memory tag, string memory comment, bool isRevoked, uint256 timestamp)
    {
        require(feedbackIndex > 0 && feedbackIndex <= _lastIndex[agentId][reviewer],
            "ReputationRegistry: invalid index");
        Feedback storage f = _feedback[agentId][reviewer][feedbackIndex];
        return (f.score, f.tag, f.comment, f.isRevoked, f.timestamp);
    }

    /**
     * @notice Aggregate reputation for an agent across all reviewers.
     * @param agentId   Agent to query.
     * @param tag       Filter by job category. Pass "" to include all tags.
     * @return count         Number of non-revoked feedback entries matched.
     * @return averageScore  Average score scaled by 100 (e.g. 450 = 4.50 / 5.00).
     */
    function getSummary(uint256 agentId, string calldata tag)
        external
        view
        returns (uint64 count, uint256 averageScore)
    {
        address[] storage reviewerList = _reviewers[agentId];
        bytes32 tagFilter = keccak256(bytes(tag));
        bool filterByTag = bytes(tag).length > 0;

        uint256 total;
        for (uint256 i; i < reviewerList.length; i++) {
            uint64 last = _lastIndex[agentId][reviewerList[i]];
            for (uint64 j = 1; j <= last; j++) {
                Feedback storage f = _feedback[agentId][reviewerList[i]][j];
                if (f.isRevoked) continue;
                if (filterByTag && keccak256(bytes(f.tag)) != tagFilter) continue;
                total += f.score;
                count++;
            }
        }

        averageScore = count > 0 ? (total * 100) / count : 0;
    }

    /**
     * @notice How many feedback entries has a specific reviewer left for this agent.
     */
    function getLastIndex(uint256 agentId, address reviewer) external view returns (uint64) {
        return _lastIndex[agentId][reviewer];
    }

    /**
     * @notice All addresses that have ever given feedback for this agent.
     */
    function getReviewers(uint256 agentId) external view returns (address[] memory) {
        return _reviewers[agentId];
    }
}
