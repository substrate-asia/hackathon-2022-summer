package com.adou.stafi.service.impl;

import com.adou.stafi.contract.Faucet;
import com.adou.stafi.service.IFaucetService;
import com.adou.stafi.utils.IConfig;
import okhttp3.OkHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.Web3jService;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.protocol.websocket.WebSocketService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;

@Service
public class FaucetServiceImpl implements IFaucetService {

    @Autowired
    Web3j web3j;
    private static final Logger logger = LoggerFactory.getLogger(FaucetServiceImpl.class);

    @Override
    public Boolean executeRedeemStake(String faucetAddr) {
        Boolean result = false;
        try {
            Faucet faucet = Faucet.load(faucetAddr, web3j,
                    Credentials.create(IConfig.get("privateKey")), new DefaultGasProvider());
            TransactionReceipt receipt = faucet.executeRedeemStake().sendAsync().get();
            if ("0x1".equals(receipt.getStatus())) {
                result = true;
                logger.info("确认已计划回收的选票，并返还到质押池Pool成功！" + receipt.toString(), receipt);
            } else {
                logger.warn("确认已计划回收的选票，并返还到质押池Pool失败！" + receipt.toString(), receipt);
            }
        } catch (Exception e) {
            logger.error("确认已计划回收的选票，并返还到质押池Pool报错！" + e.getMessage(), e);
        }
        return result;
    }

    @Override
    public void scheduleRedeemStake(String faucetAddr) {
        try {
            Faucet faucet = Faucet.load(faucetAddr, web3j,
                    Credentials.create(IConfig.get("privateKey")), new DefaultGasProvider());
            TransactionReceipt receipt = faucet.scheduleRedeemStake().sendAsync().get();
            if ("0x1".equals(receipt.getStatus())) {
                logger.info("按选票信息正常计划回收选票成功！" + receipt.toString(), receipt);
            } else {
                logger.warn("按选票信息正常计划回收选票失败！" + receipt.toString(), receipt);
            }
        } catch (Exception e) {
            logger.error("按选票信息正常计划回收选票报错！" + e.getMessage(), e);
        }
    }

    @Override
    public void zeroIncomePunish(String faucetAddr) {
        try {
            Faucet faucet = Faucet.load(faucetAddr, web3j,
                    Credentials.create(IConfig.get("privateKey")), new DefaultGasProvider());
            TransactionReceipt receipt = faucet.zeroIncomePunish().sendAsync().get();
            if ("0x1".equals(receipt.getStatus())) {
                logger.info("零收益处罚，并强制计划回收选票成功！" + receipt.toString(), receipt);
            } else {
                logger.warn("零收益处罚，并强制计划回收选票失败！" + receipt.toString(), receipt);
            }
        } catch (Exception e) {
            logger.error("零收益处罚，并强制计划回收选票报错！" + e.getMessage(), e);
        }
    }

    @Override
    public void sendReward(String faucetAddr) {
        try {
            Faucet faucet = Faucet.load(faucetAddr, web3j,
                    Credentials.create(IConfig.get("privateKey")), new DefaultGasProvider());
            TransactionReceipt receipt = faucet.sendReward().sendAsync().get();
            if ("0x1".equals(receipt.getStatus())) {
                logger.info("抵押收益，发送到奖励池成功！" + receipt.toString(), receipt);
            } else {
                logger.warn("抵押收益，发送到奖励池失败！" + receipt.toString(), receipt);
            }
        } catch (Exception e) {
            logger.error("抵押收益，发送到奖励池报错！" + e.getMessage(), e);
        }
    }

    @Override
    public void recordRewardInfo(String faucetAddr) {
        try {
            Faucet faucet = Faucet.load(faucetAddr, web3j,
                    Credentials.create(IConfig.get("privateKey")), new DefaultGasProvider());
            TransactionReceipt receipt = faucet.recordRewardInfo().sendAsync().get();
            if ("0x1".equals(receipt.getStatus())) {
                logger.info("每日记录一次奖励信息成功！" + receipt.toString(), receipt);
            } else {
                logger.warn("每日记录一次奖励信息失败！" + receipt.toString(), receipt);
            }
        } catch (Exception e) {
            logger.error("每日记录一次奖励信息报错！" + e.getMessage(), e);
        }
    }

    public static void main(String[] args) {
        Web3jService web3jService = new HttpService("https://mainnet.infura.io/v3/2c8d38df81524619a85de207f383bb90");
//        Web3jService web3jService = new HttpService("https://moonbeam-alpha.api.onfinality.io/rpc?apikey=7f93a82e-a334-4335-9763-58da8f144f8f");
        Web3j web3j = Web3j.build(web3jService, 1500L, org.web3j.utils.Async.defaultExecutorService());
        web3j.pendingTransactionFlowable().subscribe(tx -> {
            System.out.println("\n Matched:  New tx: id={" + tx.getHash() + "}, block={" + tx.getBlockHash() + "}, from={" + tx.getFrom() + "}, to={" + tx.getTo() + "}, value={" + tx.getValue().intValue() + "}"
                    + "input={" + tx.getInput() + "}\n ");
        }, Throwable::printStackTrace);
//        Faucet faucet = Faucet.load("0x18273551A82e7FbA3A2671827eAbbd30E17AB3D5", web3j,
//                Credentials.create(IConfig.get("privateKey")), new DefaultGasProvider());
//        faucet.recordRewardInfoEventFlowable(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST)
//                .subscribe(txa -> {
//                    System.out.println("tx:" + txa.toString());
//                }, Throwable::printStackTrace);
    }
}
