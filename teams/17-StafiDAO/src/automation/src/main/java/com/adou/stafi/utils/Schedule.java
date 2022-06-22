package com.adou.stafi.utils;

import com.adou.stafi.contract.Search;
import com.adou.stafi.service.IAirdropService;
import com.adou.stafi.service.IFaucetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.web3j.protocol.Web3j;
import org.web3j.tx.ReadonlyTransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;

import java.util.List;

@Component
public class Schedule {

    private static final Logger logger = LoggerFactory.getLogger(Schedule.class);

    @Autowired
    IAirdropService airdropService;
    @Autowired
    IFaucetService faucetService;
    @Autowired
    Web3j web3j;

    /**
     * 空投
     */
    @Scheduled(cron = "0 0 0/1 * * ?")
    private void startDrop() {
        try {
            Search search = Search.load(IConfig.get("searchAddr"), web3j,
                    new ReadonlyTransactionManager(web3j, null), new DefaultGasProvider());
            if (search.startDrop().sendAsync().get())
                airdropService.startDrop();
        } catch (Exception e) {
            logger.error("空投定时器报错！" + e.getMessage(), e);
        }
    }

    /**
     * 水龙头
     */
    @Scheduled(cron = "0 0 0/1 * * ? ")
    private void faucet() {
        try {
            Search search = Search.load(IConfig.get("searchAddr"), web3j,
                    new ReadonlyTransactionManager(web3j, null), new DefaultGasProvider());
            List list = search.getAllCollators().sendAsync().get();
            List list2 = search.getAllDelegators().sendAsync().get();
            list.addAll(list2);
            if (!list.isEmpty()) {
                for (Object obj : list) {
                    String faucetAddr = String.valueOf(obj);
                    if (search.isExecuteRedeemStake(faucetAddr).sendAsync().get()) {
                        Boolean result = faucetService.executeRedeemStake(faucetAddr);
                        if (result) {
                            if (search.isScheduleRedeemStake(faucetAddr).sendAsync().get())
                                faucetService.scheduleRedeemStake(faucetAddr);
                            if (search.isZeroIncomePunish(faucetAddr).sendAsync().get())
                                faucetService.zeroIncomePunish(faucetAddr);
                            if (search.isSendReward(faucetAddr).sendAsync().get())
                                faucetService.sendReward(faucetAddr);
                            if (search.isRecordRewardInfo(faucetAddr).sendAsync().get())
                                faucetService.recordRewardInfo(faucetAddr);
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("水龙头定时器报错！" + e.getMessage(), e);
        }
    }
}
