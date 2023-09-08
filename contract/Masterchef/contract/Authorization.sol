// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

contract Authorization {
    bytes32 private constant NAME_SLOT = 0xce3f5a8ee7c9d2140f71eab82d39f7e9541b062467ceb6c55272ef4d9c4832db;
    // Punkswap Masterchef contract
    bytes32 private constant NAME_HASH = 0xb8de25369ad7c4c551ebf2be3862a8794707ff701d16ca9a78d468d3a2b33ed9;

    constructor() public {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            sstore(NAME_SLOT, NAME_HASH)
        }
    }
}