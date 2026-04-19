// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IdentityRegistry
 * @notice ERC-8004 compliant agent identity registry.
 *
 * Each registered agent receives an ERC-721 token (its "agent card") that serves
 * as a portable, on-chain identity. The token's URI resolves to an agent
 * registration file (JSON) that contains the agent's name, description,
 * capabilities, service endpoints, and x402 payment support flag.
 *
 * Follows the ERC-8004 IdentityRegistry interface:
 *   - register()                                        mint with no URI
 *   - register(string agentURI)                        mint with URI
 *   - register(string agentURI, MetadataEntry[])       mint with URI + metadata
 *   - setAgentURI(uint256, string)                     update URI
 *   - getMetadata(uint256, string)                     read arbitrary metadata
 *   - setMetadata(uint256, string, bytes)              write arbitrary metadata
 *   - getAgentWallet(uint256)                          get linked hot wallet
 *
 * Agent card URI MUST resolve to a JSON object conforming to the ERC-8004
 * registration file schema (type field set to the ERC-8004 v1 type identifier).
 */
contract IdentityRegistry is ERC721URIStorage, Ownable {
    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    struct MetadataEntry {
        string metadataKey;
        bytes  metadataValue;
    }

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    uint256 private _nextId;

    // agentId => metadataKey => metadataValue
    // "agentWallet" is a reserved key managed via dedicated functions.
    mapping(uint256 => mapping(string => bytes)) private _metadata;

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    bytes32 private constant RESERVED_WALLET_KEY = keccak256("agentWallet");

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event Registered(uint256 indexed agentId, string agentURI, address indexed owner);
    event MetadataSet(uint256 indexed agentId, string metadataKey, bytes metadataValue);
    event URIUpdated(uint256 indexed agentId, string newURI);

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor() ERC721("AgentIdentity", "AGENT") Ownable(msg.sender) {}

    // -------------------------------------------------------------------------
    // Registration
    // -------------------------------------------------------------------------

    /**
     * @notice Register an agent with no URI. URI can be set later via setAgentURI.
     */
    function register() external returns (uint256 agentId) {
        agentId = _nextId++;
        _metadata[agentId]["agentWallet"] = abi.encodePacked(msg.sender);
        _safeMint(msg.sender, agentId);
        emit Registered(agentId, "", msg.sender);
    }

    /**
     * @notice Register an agent with a URI pointing to its agent registration file.
     * @param agentURI  IPFS / HTTPS / data: URI resolving to the ERC-8004 JSON card.
     */
    function register(string calldata agentURI) external returns (uint256 agentId) {
        agentId = _nextId++;
        _metadata[agentId]["agentWallet"] = abi.encodePacked(msg.sender);
        _safeMint(msg.sender, agentId);
        _setTokenURI(agentId, agentURI);
        emit Registered(agentId, agentURI, msg.sender);
    }

    /**
     * @notice Register an agent with a URI and an initial batch of metadata entries.
     * @param agentURI   URI resolving to the ERC-8004 agent card JSON.
     * @param metadata   Key-value pairs to store on-chain (e.g. "capabilities", "model").
     *                   The key "agentWallet" is reserved and will revert if supplied here.
     */
    function register(
        string calldata agentURI,
        MetadataEntry[] calldata metadata
    ) external returns (uint256 agentId) {
        agentId = _nextId++;
        _metadata[agentId]["agentWallet"] = abi.encodePacked(msg.sender);
        _safeMint(msg.sender, agentId);
        _setTokenURI(agentId, agentURI);

        for (uint256 i; i < metadata.length; i++) {
            require(
                keccak256(bytes(metadata[i].metadataKey)) != RESERVED_WALLET_KEY,
                "IdentityRegistry: reserved key"
            );
            _metadata[agentId][metadata[i].metadataKey] = metadata[i].metadataValue;
            emit MetadataSet(agentId, metadata[i].metadataKey, metadata[i].metadataValue);
        }

        emit Registered(agentId, agentURI, msg.sender);
    }

    // -------------------------------------------------------------------------
    // URI management
    // -------------------------------------------------------------------------

    /**
     * @notice Update the agent card URI. Callable by owner or approved operator.
     */
    function setAgentURI(uint256 agentId, string calldata newURI) external {
        _requireAuthorized(agentId);
        _setTokenURI(agentId, newURI);
        emit URIUpdated(agentId, newURI);
    }

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    /**
     * @notice Read arbitrary metadata for an agent.
     * @param agentId      The ERC-721 token id.
     * @param metadataKey  String key (e.g. "capabilities", "model", "agentWallet").
     */
    function getMetadata(uint256 agentId, string calldata metadataKey)
        external
        view
        returns (bytes memory)
    {
        return _metadata[agentId][metadataKey];
    }

    /**
     * @notice Write arbitrary metadata. Callable by owner or approved operator.
     *         The key "agentWallet" is reserved — use getAgentWallet/unsetAgentWallet.
     */
    function setMetadata(
        uint256 agentId,
        string calldata metadataKey,
        bytes calldata metadataValue
    ) external {
        _requireAuthorized(agentId);
        require(
            keccak256(bytes(metadataKey)) != RESERVED_WALLET_KEY,
            "IdentityRegistry: reserved key"
        );
        _metadata[agentId][metadataKey] = metadataValue;
        emit MetadataSet(agentId, metadataKey, metadataValue);
    }

    // -------------------------------------------------------------------------
    // Agent wallet (hot wallet linked to the agent identity)
    // -------------------------------------------------------------------------

    /**
     * @notice Return the agent's linked hot wallet address (if any).
     *         This is the wallet the agent uses to sign transactions on its behalf,
     *         distinct from the NFT owner address.
     */
    function getAgentWallet(uint256 agentId) external view returns (address) {
        bytes memory data = _metadata[agentId]["agentWallet"];
        if (data.length == 0) return address(0);
        return address(bytes20(data));
    }

    /**
     * @notice Clear the agent's linked hot wallet.
     */
    function unsetAgentWallet(uint256 agentId) external {
        _requireAuthorized(agentId);
        _metadata[agentId]["agentWallet"] = "";
        emit MetadataSet(agentId, "agentWallet", "");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * @notice Returns the total number of agents ever registered (includes burned).
     */
    function totalRegistered() external view returns (uint256) {
        return _nextId;
    }

    /**
     * @notice Convenience check — is this address the owner or an approved operator?
     */
    function isAuthorized(address spender, uint256 agentId) external view returns (bool) {
        address owner = ownerOf(agentId);
        return _isAuthorized(owner, spender, agentId);
    }

    // -------------------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------------------

    function _requireAuthorized(uint256 agentId) internal view {
        address owner = ownerOf(agentId);
        require(
            msg.sender == owner ||
            isApprovedForAll(owner, msg.sender) ||
            msg.sender == getApproved(agentId),
            "IdentityRegistry: not authorized"
        );
    }

    /**
     * @dev Clear agentWallet on transfer so it doesn't carry over to new owner.
     *      Follows ERC-8004 spec: wallet is tied to the registering party, not the NFT.
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        // On transfer (not mint, not burn) — clear the linked wallet
        if (from != address(0) && to != address(0)) {
            _metadata[tokenId]["agentWallet"] = "";
            emit MetadataSet(tokenId, "agentWallet", "");
        }
        return super._update(to, tokenId, auth);
    }
}
