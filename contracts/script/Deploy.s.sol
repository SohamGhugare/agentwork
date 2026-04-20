// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IdentityRegistry}   from "../src/IdentityRegistry.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";
import {ValidationRegistry} from "../src/ValidationRegistry.sol";
import {JobRelay}           from "../src/JobRelay.sol";

/**
 * @notice Deploys the AgentWork contract suite.
 *
 * Run once on C-Chain (where agentEscrow will eventually live):
 *
 *   forge script script/Deploy.s.sol \
 *     --rpc-url fuji \
 *     --account <keystore-account> \
 *     --broadcast \
 *     --verify \
 *     --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan \
 *     --etherscan-api-key verifyContract
 *
 * Run separately on source L1 for JobRelay (set DEST_CHAIN_ID and DEST_RELAY env vars):
 *
 *   DEST_CHAIN_ID=<bytes32 C-Chain ID> DEST_RELAY=<C-Chain JobRelay addr> \
 *   forge script script/Deploy.s.sol:DeployRelay \
 *     --rpc-url <l1-rpc> \
 *     --account <keystore-account> \
 *     --broadcast
 *
 * Fuji C-Chain blockchain ID (bytes32):
 *   0x7fc93d85c6d62be589232424924ce2b9d5e236eaa34fca6b7c4db0d6eb7e5c0
 */
contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // 1. Identity Registry
        IdentityRegistry identity = new IdentityRegistry();
        console.log("IdentityRegistry  :", address(identity));

        // 2. Reputation Registry (depends on IdentityRegistry)
        ReputationRegistry reputation = new ReputationRegistry(address(identity));
        console.log("ReputationRegistry:", address(reputation));

        // 3. Validation Registry (depends on IdentityRegistry)
        ValidationRegistry validation = new ValidationRegistry(address(identity));
        console.log("ValidationRegistry:", address(validation));

        // 4. JobRelay on C-Chain (receiver side)
        //    agentEscrow = address(0) for now — set via setAgentEscrow() once escrow is deployed
        //    destinationChainID = bytes32(0) — C-Chain is the destination, not the source
        //    destinationRelay   = address(0) — not sending messages out from C-Chain relay
        JobRelay relay = new JobRelay(address(0), bytes32(0), address(0));
        console.log("JobRelay (C-Chain):", address(relay));

        vm.stopBroadcast();
    }
}

/**
 * @notice Deploy only the source-L1 JobRelay.
 *         Run on the secondary L1 after the C-Chain JobRelay is deployed.
 *
 *   Required env vars:
 *     DEST_CHAIN_ID  — bytes32 blockchain ID of C-Chain (as uint256 for env compatibility)
 *     DEST_RELAY     — address of JobRelay on C-Chain
 */
contract DeployRelay is Script {
    function run() external {
        bytes32 destChainID = bytes32(vm.envUint("DEST_CHAIN_ID"));
        address destRelay   = vm.envAddress("DEST_RELAY");

        vm.startBroadcast();

        // Source L1 relay — no escrow here, sends messages to C-Chain
        JobRelay relay = new JobRelay(address(0), destChainID, destRelay);
        console.log("JobRelay (source L1):", address(relay));
        console.log("  -> destination chain:", vm.toString(destChainID));
        console.log("  -> destination relay:", destRelay);

        vm.stopBroadcast();
    }
}
