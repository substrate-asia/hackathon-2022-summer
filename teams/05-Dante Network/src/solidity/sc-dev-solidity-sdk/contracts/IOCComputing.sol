// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IOCComputing {
    /**
     * Callback of outsourcing computing
     * @param _result - accumulating result
     */
    function receiveComputeTaskCallback(uint _result) external;
}