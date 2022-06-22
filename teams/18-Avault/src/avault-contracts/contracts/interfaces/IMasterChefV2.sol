// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMasterChefV2 {
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of AVATs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accAVATPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accAVATPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
        uint256 boostMultiplier;
    }

    function deposit(uint256 _pid, uint256 _amount) external;

    function withdraw(uint256 _pid, uint256 _amount) external;

    function pendingAVAT(uint256 _pid, address _user) external view returns (uint256);

    function emergencyWithdraw(uint256 _pid) external;

    function getUserInfo(uint _pid, address _user) external view returns (UserInfo memory);
}