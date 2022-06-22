package com.adou.stafi.service;

public interface IFaucetService {

    Boolean executeRedeemStake(String faucetAddr);

    void scheduleRedeemStake(String faucetAddr);

    void zeroIncomePunish(String faucetAddr);

    void sendReward(String faucetAddr);

    void recordRewardInfo(String faucetAddr);
}
