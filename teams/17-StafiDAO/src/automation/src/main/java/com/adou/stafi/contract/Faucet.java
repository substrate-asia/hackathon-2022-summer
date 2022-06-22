package com.adou.stafi.contract;

import com.adou.stafi.web3j.ContractR;
import io.reactivex.Flowable;
import io.reactivex.functions.Function;

import java.io.FileNotFoundException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.util.ResourceUtils;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.filters.PendingTransactionFilter;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;


/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 3.3.1.
 */
@SuppressWarnings("rawtypes")
public class Faucet extends ContractR {

    private static String BINARY ;

    static {
        try {
            BINARY = ResourceUtils.getFile(
                    "classpath:contract/Faucet.txt").getAbsolutePath();
        } catch (FileNotFoundException e) {
        }
    }

    public static final String FUNC_IAIRDROP = "Iairdrop";

    public static final String FUNC_IGOVERN = "Igovern";

    public static final String FUNC_ADDASSOCIATION = "addAssociation";

    public static final String FUNC_AUTHORMAPPING = "authorMapping";

    public static final String FUNC_BALANCE = "balance";

    public static final String FUNC_BSTATE = "bstate";

    public static final String FUNC_COLLATORADDR = "collatorAddr";

    public static final String FUNC_DAYREWARDINFO = "dayRewardInfo";

    public static final String FUNC_EXECUTEREDEEMSTAKE = "executeRedeemStake";

    public static final String FUNC_FAUCETTYPE = "faucetType";

    public static final String FUNC_GETRECORDREWARDDATE = "getRecordRewardDate";

    public static final String FUNC_GETREDEEMDATE = "getRedeemDate";

    public static final String FUNC_INITIALIZE = "initialize";

    public static final String FUNC_LEASEDATES = "leaseDates";

    public static final String FUNC_LEASEINFOS = "leaseInfos";

    public static final String FUNC_LEASETOTAL = "leaseTotal";

    public static final String FUNC_LEAVENUMBER = "leaveNumber";

    public static final String FUNC_NIMBUSID = "nimbusId";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_PUNISHCOUNT = "punishCount";

    public static final String FUNC_RECORDREWARDINFO = "recordRewardInfo";

    public static final String FUNC_SCHEDULEREDEEMSTAKE = "scheduleRedeemStake";

    public static final String FUNC_SENDREWARD = "sendReward";

    public static final String FUNC_SETLEASEINFO = "setLeaseInfo";

    public static final String FUNC_STAKING = "staking";

    public static final String FUNC_TECHADDR = "techAddr";

    public static final String FUNC_UPDATEASSOCIATION = "updateAssociation";

    public static final String FUNC_ZEROINCOMEPUNISH = "zeroIncomePunish";

    public static final Event ASSOCIATION_EVENT = new Event("Association",
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
    ;

    public static final Event LEAVEREDEEM_EVENT = new Event("LeaveRedeem",
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
    ;

    public static final Event RECORDREWARDINFO_EVENT = new Event("RecordRewardInfo",
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event REDEEMSTATE_EVENT = new Event("RedeemState",
            Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
    ;

    public static final Event SENDREWARD_EVENT = new Event("SendReward",
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
    ;

    @Deprecated
    protected Faucet(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected Faucet(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected Faucet(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected Faucet(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public List<AssociationEventResponse> getAssociationEvents(TransactionReceipt transactionReceipt) {
        List<EventValuesWithLog> valueList = extractEventParametersWithLog(ASSOCIATION_EVENT, transactionReceipt);
        ArrayList<AssociationEventResponse> responses = new ArrayList<AssociationEventResponse>(valueList.size());
        for (EventValuesWithLog eventValues : valueList) {
            AssociationEventResponse typedResponse = new AssociationEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._nimbusId = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<AssociationEventResponse> associationEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, AssociationEventResponse>() {
            @Override
            public AssociationEventResponse apply(Log log) {
                EventValuesWithLog eventValues = extractEventParametersWithLog(ASSOCIATION_EVENT, log);
                AssociationEventResponse typedResponse = new AssociationEventResponse();
                typedResponse.log = log;
                typedResponse._nimbusId = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<AssociationEventResponse> associationEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ASSOCIATION_EVENT));
        return associationEventFlowable(filter);
    }

    public List<LeaveRedeemEventResponse> getLeaveRedeemEvents(TransactionReceipt transactionReceipt) {
        List<EventValuesWithLog> valueList = extractEventParametersWithLog(LEAVEREDEEM_EVENT, transactionReceipt);
        ArrayList<LeaveRedeemEventResponse> responses = new ArrayList<LeaveRedeemEventResponse>(valueList.size());
        for (EventValuesWithLog eventValues : valueList) {
            LeaveRedeemEventResponse typedResponse = new LeaveRedeemEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._leaveNumber = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<LeaveRedeemEventResponse> leaveRedeemEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, LeaveRedeemEventResponse>() {
            @Override
            public LeaveRedeemEventResponse apply(Log log) {
                EventValuesWithLog eventValues = extractEventParametersWithLog(LEAVEREDEEM_EVENT, log);
                LeaveRedeemEventResponse typedResponse = new LeaveRedeemEventResponse();
                typedResponse.log = log;
                typedResponse._leaveNumber = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<LeaveRedeemEventResponse> leaveRedeemEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(LEAVEREDEEM_EVENT));
        return leaveRedeemEventFlowable(filter);
    }

    public List<RecordRewardInfoEventResponse> getRecordRewardInfoEvents(TransactionReceipt transactionReceipt) {
        List<EventValuesWithLog> valueList = extractEventParametersWithLog(RECORDREWARDINFO_EVENT, transactionReceipt);
        ArrayList<RecordRewardInfoEventResponse> responses = new ArrayList<RecordRewardInfoEventResponse>(valueList.size());
        for (EventValuesWithLog eventValues : valueList) {
            RecordRewardInfoEventResponse typedResponse = new RecordRewardInfoEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._rdDate = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse._rdAmount = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<RecordRewardInfoEventResponse> recordRewardInfoEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, RecordRewardInfoEventResponse>() {
            @Override
            public RecordRewardInfoEventResponse apply(Log log) {
                EventValuesWithLog eventValues = extractEventParametersWithLog(RECORDREWARDINFO_EVENT, log);
                RecordRewardInfoEventResponse typedResponse = new RecordRewardInfoEventResponse();
                typedResponse.log = log;
                typedResponse._rdDate = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse._rdAmount = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<RecordRewardInfoEventResponse> recordRewardInfoEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(RECORDREWARDINFO_EVENT));
        return recordRewardInfoEventFlowable(filter);
    }

    public List<RedeemStateEventResponse> getRedeemStateEvents(TransactionReceipt transactionReceipt) {
        List<EventValuesWithLog> valueList = extractEventParametersWithLog(REDEEMSTATE_EVENT, transactionReceipt);
        ArrayList<RedeemStateEventResponse> responses = new ArrayList<RedeemStateEventResponse>(valueList.size());
        for (EventValuesWithLog eventValues : valueList) {
            RedeemStateEventResponse typedResponse = new RedeemStateEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._success = (Boolean) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<RedeemStateEventResponse> redeemStateEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, RedeemStateEventResponse>() {
            @Override
            public RedeemStateEventResponse apply(Log log) {
                EventValuesWithLog eventValues = extractEventParametersWithLog(REDEEMSTATE_EVENT, log);
                RedeemStateEventResponse typedResponse = new RedeemStateEventResponse();
                typedResponse.log = log;
                typedResponse._success = (Boolean) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<RedeemStateEventResponse> redeemStateEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(REDEEMSTATE_EVENT));
        return redeemStateEventFlowable(filter);
    }

    public List<SendRewardEventResponse> getSendRewardEvents(TransactionReceipt transactionReceipt) {
        List<EventValuesWithLog> valueList = extractEventParametersWithLog(SENDREWARD_EVENT, transactionReceipt);
        ArrayList<SendRewardEventResponse> responses = new ArrayList<SendRewardEventResponse>(valueList.size());
        for (EventValuesWithLog eventValues : valueList) {
            SendRewardEventResponse typedResponse = new SendRewardEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._reward = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<SendRewardEventResponse> sendRewardEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, SendRewardEventResponse>() {
            @Override
            public SendRewardEventResponse apply(Log log) {
                EventValuesWithLog eventValues = extractEventParametersWithLog(SENDREWARD_EVENT, log);
                SendRewardEventResponse typedResponse = new SendRewardEventResponse();
                typedResponse.log = log;
                typedResponse._reward = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<SendRewardEventResponse> sendRewardEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(SENDREWARD_EVENT));
        return sendRewardEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> Iairdrop() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_IAIRDROP,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> Igovern() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_IGOVERN,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> addAssociation(byte[] newNimbusId) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ADDASSOCIATION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(newNimbusId)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> authorMapping() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_AUTHORMAPPING,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> balance() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_BALANCE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> bstate() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_BSTATE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> collatorAddr() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_COLLATORADDR,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> dayRewardInfo() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_DAYREWARDINFO,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> executeRedeemStake() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_EXECUTEREDEEMSTAKE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> faucetType() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_FAUCETTYPE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getRecordRewardDate() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETRECORDREWARDDATE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getRedeemDate() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETREDEEMDATE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> initialize(String _governAddr, String _collatorAddr, String _techAddr, String _owner, Boolean _faucetType) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_INITIALIZE,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _governAddr),
                        new org.web3j.abi.datatypes.Address(160, _collatorAddr),
                        new org.web3j.abi.datatypes.Address(160, _techAddr),
                        new org.web3j.abi.datatypes.Address(160, _owner),
                        new org.web3j.abi.datatypes.Bool(_faucetType)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> leaseDates(BigInteger param0) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_LEASEDATES,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(param0)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> leaseInfos(BigInteger param0) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_LEASEINFOS,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(param0)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> leaseTotal() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_LEASETOTAL,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> leaveNumber() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_LEAVENUMBER,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> nimbusId() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_NIMBUSID,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> owner() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_OWNER,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> punishCount() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_PUNISHCOUNT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> recordRewardInfo() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_RECORDREWARDINFO,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> scheduleRedeemStake() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SCHEDULEREDEEMSTAKE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> sendReward() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SENDREWARD,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setLeaseInfo(String _reddeemAddr, BigInteger _leaseDate, BigInteger _period, BigInteger _amount, BigInteger _marginAmount) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETLEASEINFO,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _reddeemAddr),
                        new org.web3j.abi.datatypes.generated.Uint256(_leaseDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_period),
                        new org.web3j.abi.datatypes.generated.Uint256(_amount),
                        new org.web3j.abi.datatypes.generated.Uint256(_marginAmount)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> staking() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STAKING,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> techAddr() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_TECHADDR,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> updateAssociation(byte[] oldNimbusId, byte[] newNimbusId) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_UPDATEASSOCIATION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(oldNimbusId),
                        new org.web3j.abi.datatypes.generated.Bytes32(newNimbusId)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> zeroIncomePunish() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ZEROINCOMEPUNISH,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static Faucet load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new Faucet(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static Faucet load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new Faucet(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static Faucet load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new Faucet(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static Faucet load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new Faucet(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<Faucet> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Faucet.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    public static RemoteCall<Faucet> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Faucet.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Faucet> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Faucet.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Faucet> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Faucet.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    public static class AssociationEventResponse extends BaseEventResponse {
        public byte[] _nimbusId;
    }

    public static class LeaveRedeemEventResponse extends BaseEventResponse {
        public BigInteger _leaveNumber;
    }

    public static class RecordRewardInfoEventResponse extends BaseEventResponse {
        public BigInteger _rdDate;

        public BigInteger _rdAmount;
    }

    public static class RedeemStateEventResponse extends BaseEventResponse {
        public Boolean _success;
    }

    public static class SendRewardEventResponse extends BaseEventResponse {
        public BigInteger _reward;
    }
}
