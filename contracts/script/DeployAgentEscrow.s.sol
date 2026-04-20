// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {AgentEscrow} from "../src/AgentEscrow.sol";

/**
 * @notice Deploy AgentEscrow on Fuji C-Chain.
 *
 * Requires the three registries to already be deployed.
 * Addresses are taken from environment variables (or hardcoded below).
 *
 * Usage:
 *   forge script script/DeployAgentEscrow.s.sol --tc DeployAgentEscrow \
 *     --rpc-url fuji --account deployer --broadcast \
 *     --verify \
 *     --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan \
 *     --etherscan-api-key verifyContract
 *
 * After deploy, wire up JobRelay:
 *   cast send <ESCROW_ADDR> "setTrustedRelay(address)" <JOB_RELAY_ADDR> \
 *     --rpc-url fuji --account deployer
 */
contract DeployAgentEscrow is Script {
    // Fuji testnet USDC (Circle-issued)
    address constant FUJI_USDC = 0x5425890298aed601595a70AB815c96711a31Bc65;

    // Deployed registry addresses (from deployments.json)
    address constant IDENTITY_REGISTRY   = 0xec51c978D504916FC004C5e6DfB4603796caa5cA;
    address constant REPUTATION_REGISTRY = 0x59E85fF9B7EBECDD8b181b515b57705aa21DF3e7;
    address constant VALIDATION_REGISTRY = 0xF2d7E7169a3f9a274643f11648b6e3DFa994945F;

    function run() external {
        vm.startBroadcast();

        AgentEscrow escrow = new AgentEscrow(
            FUJI_USDC,
            IDENTITY_REGISTRY,
            REPUTATION_REGISTRY,
            VALIDATION_REGISTRY
        );

        console.log("AgentEscrow:", address(escrow));
        console.log("  USDC:               ", FUJI_USDC);
        console.log("  IdentityRegistry:   ", IDENTITY_REGISTRY);
        console.log("  ReputationRegistry: ", REPUTATION_REGISTRY);
        console.log("  ValidationRegistry: ", VALIDATION_REGISTRY);
        console.log("");
        console.log("Next: wire up JobRelay:");
        console.log("  cast send <ESCROW> \"setTrustedRelay(address)\" <JOB_RELAY>");

        vm.stopBroadcast();
    }
}
