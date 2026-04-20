// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {JobRelay} from "../src/JobRelay.sol";

/**
 * @notice Deploy JobRelay on C-Chain (receiver instance).
 *
 *   forge script script/DeployJobRelay.s.sol --tc DeployJobRelayCChain \
 *     --rpc-url fuji --account deployer --broadcast
 *
 * After deploy, call setAllowedSource(<sourceL1ChainID>, true) to whitelist
 * any L1s that will dispatch jobs to this relay.
 */
contract DeployJobRelayCChain is Script {
    function run() external {
        vm.startBroadcast();

        // C-Chain receiver: no outbound destination needed
        JobRelay relay = new JobRelay(
            address(0),  // agentEscrow — wire up later via setAgentEscrow()
            bytes32(0),  // destinationChainID — C-Chain doesn't send outbound
            address(0)   // destinationRelay   — not needed on C-Chain
        );

        console.log("JobRelay (C-Chain receiver):", address(relay));

        vm.stopBroadcast();
    }
}

/**
 * @notice Deploy JobRelay on a source L1 (sender instance).
 *
 *   DEST_RELAY=<c-chain-relay-address> \
 *   forge script script/DeployJobRelay.s.sol --tc DeployJobRelayL1 \
 *     --rpc-url <l1-rpc> --account deployer --broadcast
 *
 * Fuji C-Chain blockchain ID:
 *   0x7fc93d85c6d62be589232424924ce2b9d5e236eaa34fca6b7c4db0d6eb7e5c0
 */
contract DeployJobRelayL1 is Script {
    bytes32 constant FUJI_CCHAIN_ID =
        bytes32(uint256(0x7fc93d85c6d62be589232424924ce2b9d5e236eaa34fca6b7c4db0d6eb7e5c0));

    function run() external {
        address destRelay = vm.envAddress("DEST_RELAY");

        vm.startBroadcast();

        JobRelay relay = new JobRelay(
            address(0),    // no escrow on source L1
            FUJI_CCHAIN_ID,
            destRelay
        );

        console.log("JobRelay (source L1 sender):", address(relay));
        console.log("  -> C-Chain relay:", destRelay);

        vm.stopBroadcast();
    }
}
