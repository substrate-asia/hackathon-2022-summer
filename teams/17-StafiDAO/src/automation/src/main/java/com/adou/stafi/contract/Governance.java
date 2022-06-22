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
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
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
public class Governance extends ContractR {

    private static String BINARY ;

    static {
        try {
            BINARY = ResourceUtils.getFile(
                    "classpath:contract/Governance.txt").getAbsolutePath();
        } catch (FileNotFoundException e) {
        }
    }

    public static final String FUNC_IPOOL = "Ipool";

    public static final String FUNC_AUTHORAMOUNT = "authorAmount";

    public static final String FUNC_BLOCKHEIGHT = "blockHeight";

    public static final String FUNC_COLLATORTECHLIMIT = "collatorTechLimit";

    public static final String FUNC_CURRENTNUMBER = "currentNumber";

    public static final String FUNC_DAOTECHLIMIT = "daoTechLimit";

    public static final String FUNC_DAYLEN = "dayLen";

    public static final String FUNC_DROPPROPORTION = "dropProportion";

    public static final String FUNC_ETHERBASE = "etherBase";

    public static final String FUNC_GETCALTIME = "getCalTime";

    public static final String FUNC_GETCOLLATORTECHFEE = "getCollatorTechFee";

    public static final String FUNC_GETDAOTECHFEE = "getDaoTechFee";

    public static final String FUNC_GETFUNDSDOWNLIMIT = "getFundsDownLimit";

    public static final String FUNC_GETFUNDSUPLIMIT = "getFundsUpLimit";

    public static final String FUNC_GETGOVERNANCEINFO = "getGovernanceInfo";

    public static final String FUNC_GETGOVERNANCEVOTE = "getGovernanceVote";

    public static final String FUNC_GETMARGINPROPORTION = "getMarginProportion";

    public static final String FUNC_GETPERINVESTDOWNLIMIT = "getPerInvestDownLimit";

    public static final String FUNC_GETPROPOSALDOWNLIMIT = "getProposalDownLimit";

    public static final String FUNC_GETREDEEMTIMELIMIT = "getRedeemTimeLimit";

    public static final String FUNC_GETRESERVEPROPORTION = "getReserveProportion";

    public static final String FUNC_GETREWARDDOWNLIMIT = "getRewardDownLimit";

    public static final String FUNC_GETVOTERPROPORTION = "getVoterProportion";

    public static final String FUNC_GETZEROTIMELIMIT = "getZeroTimeLimit";

    public static final String FUNC_INITIALIZE = "initialize";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_RETTOKENADDR = "retTokenAddr";

    public static final String FUNC_REWARDADDR = "rewardAddr";

    public static final String FUNC_SEARCHADDR = "searchAddr";

    public static final String FUNC_SETCALTIME = "setCalTime";

    public static final String FUNC_SETCOLLATORTECHFEE = "setCollatorTechFee";

    public static final String FUNC_SETDAOTECHFEE = "setDaoTechFee";

    public static final String FUNC_SETFUNDSDOWNLIMIT = "setFundsDownLimit";

    public static final String FUNC_SETFUNDSUPLIMIT = "setFundsUpLimit";

    public static final String FUNC_SETMARGINPROPORTION = "setMarginProportion";

    public static final String FUNC_SETPERINVESTDOWNLIMIT = "setPerInvestDownLimit";

    public static final String FUNC_SETPROPOSALDOWNLIMIT = "setProposalDownLimit";

    public static final String FUNC_SETREDEEMTIMELIMIT = "setRedeemTimeLimit";

    public static final String FUNC_SETRESERVEPROPORTION = "setReserveProportion";

    public static final String FUNC_SETRETTOKENADDR = "setRetTokenAddr";

    public static final String FUNC_SETREWARDADDR = "setRewardAddr";

    public static final String FUNC_SETREWARDDOWNLIMIT = "setRewardDownLimit";

    public static final String FUNC_SETSEARCHADDR = "setSearchAddr";

    public static final String FUNC_SETSTKTOKENADDR = "setStkTokenAddr";

    public static final String FUNC_SETVOTERPROPORTION = "setVoterProportion";

    public static final String FUNC_SETZEROTIMELIMIT = "setZeroTimeLimit";

    public static final String FUNC_STARTCATGOVERN = "startCATGovern";

    public static final String FUNC_STARTCTGOVERN = "startCTGovern";

    public static final String FUNC_STARTDTGOVERN = "startDTGovern";

    public static final String FUNC_STARTFDLGOVERN = "startFDLGovern";

    public static final String FUNC_STARTFULGOVERN = "startFULGovern";

    public static final String FUNC_STARTMPGOVERN = "startMPGovern";

    public static final String FUNC_STARTPDLGOVERN = "startPDLGovern";

    public static final String FUNC_STARTPIDLGOVERN = "startPIDLGovern";

    public static final String FUNC_STARTRDGOVERN = "startRDGovern";

    public static final String FUNC_STARTRPGOVERN = "startRPGovern";

    public static final String FUNC_STARTRTLGOVERN = "startRTLGovern";

    public static final String FUNC_STARTURLGOVERN = "startUrlGovern";

    public static final String FUNC_STARTVPGOVERN = "startVPGovern";

    public static final String FUNC_STARTZTLGOVERN = "startZTLGovern";

    public static final String FUNC_STKTOKENADDR = "stkTokenAddr";

    public static final String FUNC_VOTECATBYNUMBER = "voteCATByNumber";

    public static final String FUNC_VOTECTBYNUMBER = "voteCTByNumber";

    public static final String FUNC_VOTEFDLBYNUMBER = "voteFDLByNumber";

    public static final String FUNC_VOTEFULBYNUMBER = "voteFULByNumber";

    public static final String FUNC_VOTEMPBYNUMBER = "voteMPByNumber";

    public static final String FUNC_VOTEPDLBYNUMBER = "votePDLByNumber";

    public static final String FUNC_VOTEPIDLBYNUMBER = "votePIDLByNumber";

    public static final String FUNC_VOTERDBYNUMBER = "voteRDByNumber";

    public static final String FUNC_VOTERPBYNUMBER = "voteRPByNumber";

    public static final String FUNC_VOTERTLBYNUMBER = "voteRTLByNumber";

    public static final String FUNC_VOTETPBYNUMBER = "voteTPByNumber";

    public static final String FUNC_VOTEURLBYNUMBER = "voteURLByNumber";

    public static final String FUNC_VOTEVPBYNUMBER = "voteVPByNumber";

    public static final String FUNC_VOTEZTLBYNUMBER = "voteZTLByNumber";

    public static final String FUNC_VOTERDOWNLIMIT = "voterDownLimit";

    public static final Event STARTGOVERN_EVENT = new Event("StartGovern",
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event VOTEBYNUMBER_EVENT = new Event("VoteByNumber",
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
    ;

    @Deprecated
    protected Governance(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected Governance(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected Governance(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected Governance(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public List<StartGovernEventResponse> getStartGovernEvents(TransactionReceipt transactionReceipt) {
        List<EventValuesWithLog> valueList = extractEventParametersWithLog(STARTGOVERN_EVENT, transactionReceipt);
        ArrayList<StartGovernEventResponse> responses = new ArrayList<StartGovernEventResponse>(valueList.size());
        for (EventValuesWithLog eventValues : valueList) {
            StartGovernEventResponse typedResponse = new StartGovernEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.creator = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.number = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.governType = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.startDate = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            typedResponse.endDate = (BigInteger) eventValues.getNonIndexedValues().get(3).getValue();
            typedResponse.uintValue = (BigInteger) eventValues.getNonIndexedValues().get(4).getValue();
            typedResponse.strValue = (String) eventValues.getNonIndexedValues().get(5).getValue();
            typedResponse.totalVoter = (BigInteger) eventValues.getNonIndexedValues().get(6).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<StartGovernEventResponse> startGovernEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, StartGovernEventResponse>() {
            @Override
            public StartGovernEventResponse apply(Log log) {
                EventValuesWithLog eventValues = extractEventParametersWithLog(STARTGOVERN_EVENT, log);
                StartGovernEventResponse typedResponse = new StartGovernEventResponse();
                typedResponse.log = log;
                typedResponse.creator = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.number = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.governType = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                typedResponse.startDate = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
                typedResponse.endDate = (BigInteger) eventValues.getNonIndexedValues().get(3).getValue();
                typedResponse.uintValue = (BigInteger) eventValues.getNonIndexedValues().get(4).getValue();
                typedResponse.strValue = (String) eventValues.getNonIndexedValues().get(5).getValue();
                typedResponse.totalVoter = (BigInteger) eventValues.getNonIndexedValues().get(6).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<StartGovernEventResponse> startGovernEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(STARTGOVERN_EVENT));
        return startGovernEventFlowable(filter);
    }

    public List<VoteByNumberEventResponse> getVoteByNumberEvents(TransactionReceipt transactionReceipt) {
        List<EventValuesWithLog> valueList = extractEventParametersWithLog(VOTEBYNUMBER_EVENT, transactionReceipt);
        ArrayList<VoteByNumberEventResponse> responses = new ArrayList<VoteByNumberEventResponse>(valueList.size());
        for (EventValuesWithLog eventValues : valueList) {
            VoteByNumberEventResponse typedResponse = new VoteByNumberEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.votor = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.number = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.governType = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.state = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            typedResponse.voters = (BigInteger) eventValues.getNonIndexedValues().get(3).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<VoteByNumberEventResponse> voteByNumberEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, VoteByNumberEventResponse>() {
            @Override
            public VoteByNumberEventResponse apply(Log log) {
                EventValuesWithLog eventValues = extractEventParametersWithLog(VOTEBYNUMBER_EVENT, log);
                VoteByNumberEventResponse typedResponse = new VoteByNumberEventResponse();
                typedResponse.log = log;
                typedResponse.votor = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.number = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.governType = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                typedResponse.state = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
                typedResponse.voters = (BigInteger) eventValues.getNonIndexedValues().get(3).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<VoteByNumberEventResponse> voteByNumberEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(VOTEBYNUMBER_EVENT));
        return voteByNumberEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> Ipool() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_IPOOL,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> authorAmount() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_AUTHORAMOUNT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> blockHeight() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_BLOCKHEIGHT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> collatorTechLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_COLLATORTECHLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> currentNumber() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_CURRENTNUMBER,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> daoTechLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_DAOTECHLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> dayLen() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_DAYLEN,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> dropProportion() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_DROPPROPORTION,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> etherBase() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ETHERBASE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getCalTime() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETCALTIME,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getCollatorTechFee() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETCOLLATORTECHFEE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getDaoTechFee() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETDAOTECHFEE,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getFundsDownLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETFUNDSDOWNLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getFundsUpLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETFUNDSUPLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getGovernanceInfo(BigInteger _number) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETGOVERNANCEINFO,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getGovernanceVote(BigInteger _number, String _addr) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETGOVERNANCEVOTE,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.Address(160, _addr)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getMarginProportion() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETMARGINPROPORTION,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getPerInvestDownLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETPERINVESTDOWNLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getProposalDownLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETPROPOSALDOWNLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getRedeemTimeLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETREDEEMTIMELIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getReserveProportion() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETRESERVEPROPORTION,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getRewardDownLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETREWARDDOWNLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getVoterProportion() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETVOTERPROPORTION,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getZeroTimeLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETZEROTIMELIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> initialize(BigInteger _authorAmount, BigInteger _blockHeight, String _owner) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_INITIALIZE,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_authorAmount),
                        new org.web3j.abi.datatypes.generated.Uint256(_blockHeight),
                        new org.web3j.abi.datatypes.Address(160, _owner)),
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

    public RemoteFunctionCall<TransactionReceipt> retTokenAddr() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_RETTOKENADDR,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> rewardAddr() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_REWARDADDR,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> searchAddr() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SEARCHADDR,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setCalTime(BigInteger _calTime) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETCALTIME,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_calTime)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setCollatorTechFee(BigInteger _collatorTechFee) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETCOLLATORTECHFEE,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_collatorTechFee)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setDaoTechFee(BigInteger _daoTechFee) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETDAOTECHFEE,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_daoTechFee)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setFundsDownLimit(BigInteger _fundsDownLimit) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETFUNDSDOWNLIMIT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_fundsDownLimit)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setFundsUpLimit(BigInteger _fundsUpLimit) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETFUNDSUPLIMIT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_fundsUpLimit)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setMarginProportion(BigInteger _marginProportion) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETMARGINPROPORTION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_marginProportion)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setPerInvestDownLimit(BigInteger _perInvestDownLimit) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETPERINVESTDOWNLIMIT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_perInvestDownLimit)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setProposalDownLimit(BigInteger _proposalDownLimit) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETPROPOSALDOWNLIMIT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_proposalDownLimit)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setRedeemTimeLimit(BigInteger _redeemTimeLimit) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETREDEEMTIMELIMIT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_redeemTimeLimit)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setReserveProportion(BigInteger _reserveProportion) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETRESERVEPROPORTION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_reserveProportion)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setRetTokenAddr(String _retTokenAddr) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETRETTOKENADDR,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _retTokenAddr)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setRewardAddr(String _rewardAddr) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETREWARDADDR,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _rewardAddr)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setRewardDownLimit(BigInteger _rewardDownLimit) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETREWARDDOWNLIMIT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_rewardDownLimit)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setSearchAddr(String _searchAddr) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETSEARCHADDR,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _searchAddr)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setStkTokenAddr(String _stkTokenAddr) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETSTKTOKENADDR,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _stkTokenAddr)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setVoterProportion(BigInteger _voterProportion) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETVOTERPROPORTION,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_voterProportion)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setZeroTimeLimit(BigInteger _zeroTimeLimit) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETZEROTIMELIMIT,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_zeroTimeLimit)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startCATGovern(BigInteger _calTime, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTCATGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_calTime),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startCTGovern(BigInteger _collatorTechFee, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTCTGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_collatorTechFee),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startDTGovern(BigInteger _daoTechFee, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTDTGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_daoTechFee),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startFDLGovern(BigInteger _fundsDownLimit, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTFDLGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_fundsDownLimit),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startFULGovern(BigInteger _fundsUpLimit, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTFULGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_fundsUpLimit),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startMPGovern(BigInteger _marginProportion, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTMPGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_marginProportion),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startPDLGovern(BigInteger _proposalDownLimit, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTPDLGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_proposalDownLimit),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startPIDLGovern(BigInteger _perInvestDownLimit, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTPIDLGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_perInvestDownLimit),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startRDGovern(BigInteger _rewardDownLimit, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTRDGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_rewardDownLimit),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startRPGovern(BigInteger _reserveProportion, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTRPGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_reserveProportion),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startRTLGovern(BigInteger _redeemTimeLimit, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTRTLGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_redeemTimeLimit),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startUrlGovern(String _urlPath, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTURLGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_urlPath),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startVPGovern(BigInteger _voterProportion, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTVPGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_voterProportion),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> startZTLGovern(BigInteger _zeroTimeLimit, BigInteger _startDate, BigInteger _endDate) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STARTZTLGOVERN,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_zeroTimeLimit),
                        new org.web3j.abi.datatypes.generated.Uint256(_startDate),
                        new org.web3j.abi.datatypes.generated.Uint256(_endDate)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> stkTokenAddr() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_STKTOKENADDR,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteCATByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTECATBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteCTByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTECTBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteFDLByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEFDLBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteFULByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEFULBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteMPByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEMPBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> votePDLByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEPDLBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> votePIDLByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEPIDLBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteRDByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTERDBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteRPByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTERPBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteRTLByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTERTLBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteTPByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTETPBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteURLByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEURLBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteVPByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEVPBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voteZTLByNumber(BigInteger _number, BigInteger _state) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTEZTLBYNUMBER,
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_number),
                        new org.web3j.abi.datatypes.generated.Uint256(_state)),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> voterDownLimit() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_VOTERDOWNLIMIT,
                Arrays.<Type>asList(),
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static Governance load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new Governance(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static Governance load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new Governance(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static Governance load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new Governance(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static Governance load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new Governance(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<Governance> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Governance.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    public static RemoteCall<Governance> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Governance.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Governance> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Governance.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Governance> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Governance.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    public static class StartGovernEventResponse extends BaseEventResponse {
        public String creator;

        public BigInteger number;

        public BigInteger governType;

        public BigInteger startDate;

        public BigInteger endDate;

        public BigInteger uintValue;

        public String strValue;

        public BigInteger totalVoter;
    }

    public static class VoteByNumberEventResponse extends BaseEventResponse {
        public String votor;

        public BigInteger number;

        public BigInteger governType;

        public BigInteger state;

        public BigInteger voters;
    }
}
