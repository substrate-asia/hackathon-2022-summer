package com.adou.stafi.service.impl;

import com.adou.stafi.contract.Airdrop;
import com.adou.stafi.service.IAirdropService;
import com.adou.stafi.utils.IConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.DefaultGasProvider;

@Service
public class AirdropServiceImpl implements IAirdropService {

    @Autowired
    Web3j web3j;

    private static final Logger logger = LoggerFactory.getLogger(AirdropServiceImpl.class);

    @Override
    public void startDrop() {
        try {
            Airdrop airdrop = Airdrop.load(IConfig.get("airdropAddr"), web3j,
                    Credentials.create(IConfig.get("privateKey")), new DefaultGasProvider());
            TransactionReceipt receipt = airdrop.startDrop().sendAsync().get();
            if ("0x1".equals(receipt.getStatus())) {
                logger.info("空投奖励成功！"+ receipt.toString(), receipt);
            } else {
                logger.warn("空投奖励失败！"+ receipt.toString(), receipt);
            }
        } catch (Exception e) {
            logger.error("空投奖励报错！" + e.getMessage(), e);
        }
    }
}
