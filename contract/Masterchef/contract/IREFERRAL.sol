// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IREFERRAL {
    function getReferrer(address _user) external view returns (address);
    function recordReferral(address _user, address _referrer) external;
    function recordReferralCommission(address _referrer, uint256 _commission) external;
}