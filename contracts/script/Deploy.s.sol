// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {IdentityRegistry}   from "../src/IdentityRegistry.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";
import {ValidationRegistry} from "../src/ValidationRegistry.sol";

/**
 * @notice Deploys the three ERC-8004 registries in order:
 *   1. IdentityRegistry   (no deps)
 *   2. ReputationRegistry (needs IdentityRegistry address)
 *   3. ValidationRegistry (needs IdentityRegistry address)
 *
 * Usage:
 *   forge script script/Deploy.s.sol \
 *     --rpc-url fuji \
 *     --account <keystore-account> \
 *     --broadcast \
 *     --verify \
 *     --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan \
 *     --etherscan-api-key verifyContract
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

        vm.stopBroadcast();
    }
}
