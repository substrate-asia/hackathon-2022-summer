package com.adou.stafi.web3j;

import org.web3j.abi.*;
import org.web3j.abi.datatypes.*;
import org.web3j.crypto.Credentials;
import org.web3j.ens.EnsResolver;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthGetCode;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.exceptions.TransactionException;
import org.web3j.tx.ManagedTransaction;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.exceptions.ContractCallException;
import org.web3j.tx.gas.ContractEIP1559GasProvider;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.utils.Numeric;
import org.web3j.utils.RevertReasonExtractor;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

public class ContractR extends ManagedTransaction {

    public static final BigInteger GAS_LIMIT = BigInteger.valueOf(4300000L);
    protected final String contractBinary;
    protected String contractAddress;
    protected ContractGasProvider gasProvider;
    protected TransactionReceipt transactionReceipt;
    protected Map<String, String> deployedAddresses;
    protected DefaultBlockParameter defaultBlockParameter;

    protected ContractR(String contractBinary, String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider gasProvider) {
        this(new EnsResolver(web3j), contractBinary, contractAddress, web3j, transactionManager, gasProvider);
    }

    protected ContractR(EnsResolver ensResolver, String contractBinary, String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider gasProvider) {
        super(ensResolver, web3j, transactionManager);
        this.defaultBlockParameter = DefaultBlockParameterName.LATEST;
        this.contractAddress = this.resolveContractAddress(contractAddress);
        this.contractBinary = getFileString(contractBinary);
        this.gasProvider = gasProvider;
    }

    private static String getFileString(String filename) {
        File f = new File(filename);
        StringBuilder sb = new StringBuilder();
        if (f.exists()) {
            Scanner scanner = null;
            try {
                scanner = new Scanner(f);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            while (scanner.hasNextLine()) sb.append(scanner.nextLine());
        }
        return sb.toString();
    }

    protected ContractR(String contractBinary, String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider gasProvider) {
        this((new EnsResolver(web3j)), contractBinary, (String)contractAddress, (Web3j)web3j, (TransactionManager)(new RawTransactionManager(web3j, credentials)), (ContractGasProvider)gasProvider);
    }

    /** @deprecated */
    @Deprecated
    protected ContractR(String contractBinary, String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        this((EnsResolver)(new EnsResolver(web3j)), contractBinary, (String)contractAddress, (Web3j)web3j, (TransactionManager)transactionManager, (ContractGasProvider)(new StaticGasProvider(gasPrice, gasLimit)));
    }

    /** @deprecated */
    @Deprecated
    protected ContractR(String contractBinary, String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        this((String)contractBinary, contractAddress, (Web3j)web3j, (TransactionManager)(new RawTransactionManager(web3j, credentials)), (BigInteger)gasPrice, (BigInteger)gasLimit);
    }

    /** @deprecated */
    @Deprecated
    protected ContractR(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        this("", contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    /** @deprecated */
    @Deprecated
    protected ContractR(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        this((String)"", contractAddress, (Web3j)web3j, (TransactionManager)(new RawTransactionManager(web3j, credentials)), (BigInteger)gasPrice, (BigInteger)gasLimit);
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    public String getContractAddress() {
        return this.contractAddress;
    }

    public void setTransactionReceipt(TransactionReceipt transactionReceipt) {
        this.transactionReceipt = transactionReceipt;
    }

    public String getContractBinary() {
        return this.contractBinary;
    }

    public void setGasProvider(ContractGasProvider gasProvider) {
        this.gasProvider = gasProvider;
    }

    /** @deprecated */
    public void setGasPrice(BigInteger newPrice) {
        this.gasProvider = new StaticGasProvider(newPrice, this.gasProvider.getGasLimit());
    }

    /** @deprecated */
    public BigInteger getGasPrice() {
        return this.gasProvider.getGasPrice();
    }

    public boolean isValid() throws IOException {
        if (this.contractBinary.equals("Bin file was not provided")) {
            throw new UnsupportedOperationException("Contract binary not present in contract wrapper, please generate your wrapper using -abiFile=<file>");
        } else if (this.contractAddress.equals("")) {
            throw new UnsupportedOperationException("Contract binary not present, you will need to regenerate your smart contract wrapper with web3j v2.2.0+");
        } else {
            EthGetCode ethGetCode = this.transactionManager.getCode(this.contractAddress, DefaultBlockParameterName.LATEST);
            if (ethGetCode.hasError()) {
                return false;
            } else {
                String code = Numeric.cleanHexPrefix(ethGetCode.getCode());
                int metadataIndex = code.indexOf("a165627a7a72305820");
                if (metadataIndex != -1) {
                    code = code.substring(0, metadataIndex);
                }

                return !code.isEmpty() && this.contractBinary.contains(code);
            }
        }
    }

    public Optional<TransactionReceipt> getTransactionReceipt() {
        return Optional.ofNullable(this.transactionReceipt);
    }

    public void setDefaultBlockParameter(DefaultBlockParameter defaultBlockParameter) {
        this.defaultBlockParameter = defaultBlockParameter;
    }

    private List<Type> executeCall(Function function) throws IOException {
        String encodedFunction = FunctionEncoder.encode(function);
        String value = this.call(this.contractAddress, encodedFunction, this.defaultBlockParameter);
        return FunctionReturnDecoder.decode(value, function.getOutputParameters());
    }

    protected <T extends Type> T executeCallSingleValueReturn(Function function) throws IOException {
        List<Type> values = this.executeCall(function);
        return !values.isEmpty() ? (T)values.get(0) : null;
    }

    protected <T extends Type, R> R executeCallSingleValueReturn(Function function, Class<R> returnType) throws IOException {
        T result = this.executeCallSingleValueReturn(function);
        if (result == null) {
            throw new ContractCallException("Empty value (0x) returned from contract");
        } else {
            Object value = result.getValue();
            if (returnType.isAssignableFrom(result.getClass())) {
                return (R) result;
            } else if (returnType.isAssignableFrom(value.getClass())) {
                return (R) value;
            } else if (result.getClass().equals(Address.class) && returnType.equals(String.class)) {
                return (R) result.toString();
            } else {
                throw new ContractCallException("Unable to convert response: " + value + " to expected type: " + returnType.getSimpleName());
            }
        }
    }

    protected List<Type> executeCallMultipleValueReturn(Function function) throws IOException {
        return this.executeCall(function);
    }

    protected TransactionReceipt executeTransaction(Function function) throws IOException, TransactionException {
        return this.executeTransaction(function, BigInteger.ZERO);
    }

    private TransactionReceipt executeTransaction(Function function, BigInteger weiValue) throws IOException, TransactionException {
        return this.executeTransaction(FunctionEncoder.encode(function), weiValue, function.getName());
    }

    TransactionReceipt executeTransaction(String data, BigInteger weiValue, String funcName) throws TransactionException, IOException {
        return this.executeTransaction(data, weiValue, funcName, false);
    }

    TransactionReceipt executeTransaction(String data, BigInteger weiValue, String funcName, boolean constructor) throws TransactionException, IOException {
        TransactionReceipt receipt = null;
        if (this.gasProvider instanceof ContractEIP1559GasProvider) {
            ContractEIP1559GasProvider eip1559GasProvider = (ContractEIP1559GasProvider)this.gasProvider;
            if (eip1559GasProvider.isEIP1559Enabled()) {
                receipt = this.sendEIP1559(eip1559GasProvider.getChainId(), this.contractAddress, data, weiValue, eip1559GasProvider.getGasLimit(funcName), eip1559GasProvider.getMaxPriorityFeePerGas(funcName), eip1559GasProvider.getMaxFeePerGas(funcName), constructor);
            }
        }

        if (receipt == null) {
            receipt = this.send(this.contractAddress, data, weiValue, this.gasProvider.getGasPrice(funcName), this.gasProvider.getGasLimit(funcName), constructor);
        }

        if (!receipt.isStatusOK()) {
            throw new TransactionException(String.format("Transaction %s has failed with status: %s. Gas used: %s. Revert reason: '%s'.", receipt.getTransactionHash(), receipt.getStatus(), receipt.getGasUsedRaw() != null ? receipt.getGasUsed().toString() : "unknown", RevertReasonExtractor.extractRevertReason(receipt, data, this.web3j, true)), receipt);
        } else {
            return receipt;
        }
    }

    protected <T extends Type> RemoteFunctionCall<T> executeRemoteCallSingleValueReturn(Function function) {
        return new RemoteFunctionCall(function, () -> {
            return this.executeCallSingleValueReturn(function);
        });
    }

    protected <T> RemoteFunctionCall<T> executeRemoteCallSingleValueReturn(Function function, Class<T> returnType) {
        return new RemoteFunctionCall(function, () -> {
            return this.executeCallSingleValueReturn(function, returnType);
        });
    }

    protected RemoteFunctionCall<List<Type>> executeRemoteCallMultipleValueReturn(Function function) {
        return new RemoteFunctionCall(function, () -> {
            return this.executeCallMultipleValueReturn(function);
        });
    }

    protected RemoteFunctionCall<TransactionReceipt> executeRemoteCallTransaction(Function function) {
        return new RemoteFunctionCall(function, () -> {
            return this.executeTransaction(function);
        });
    }

    protected RemoteFunctionCall<TransactionReceipt> executeRemoteCallTransaction(Function function, BigInteger weiValue) {
        return new RemoteFunctionCall(function, () -> {
            return this.executeTransaction(function, weiValue);
        });
    }

    private static <T extends ContractR> T create(T contract, String binary, String encodedConstructor, BigInteger value) throws IOException, TransactionException {
        TransactionReceipt transactionReceipt = contract.executeTransaction(binary + encodedConstructor, value, "deploy", true);
        String contractAddress = transactionReceipt.getContractAddress();
        if (contractAddress == null) {
            throw new RuntimeException("Empty contract address returned");
        } else {
            contract.setContractAddress(contractAddress);
            contract.setTransactionReceipt(transactionReceipt);
            return contract;
        }
    }

    protected static <T extends ContractR> T deploy(Class<T> type, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider, String binary, String encodedConstructor, BigInteger value) throws RuntimeException, TransactionException {
        try {
            Constructor<T> constructor = type.getDeclaredConstructor(String.class, Web3j.class, Credentials.class, ContractGasProvider.class);
            constructor.setAccessible(true);
            T contract = constructor.newInstance(null, web3j, credentials, contractGasProvider);
            return create(contract, binary, encodedConstructor, value);
        } catch (TransactionException var9) {
            throw var9;
        } catch (Exception var10) {
            throw new RuntimeException(var10);
        }
    }

    protected static <T extends ContractR> T deploy(Class<T> type, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider, String binary, String encodedConstructor, BigInteger value) throws RuntimeException, TransactionException {
        try {
            Constructor<T> constructor = type.getDeclaredConstructor(String.class, Web3j.class, TransactionManager.class, ContractGasProvider.class);
            constructor.setAccessible(true);
            T contract = constructor.newInstance(null, web3j, transactionManager, contractGasProvider);
            return create(contract, binary, encodedConstructor, value);
        } catch (TransactionException var9) {
            throw var9;
        } catch (Exception var10) {
            throw new RuntimeException(var10);
        }
    }

    /** @deprecated */
    @Deprecated
    protected static <T extends ContractR> T deploy(Class<T> type, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit, String binary, String encodedConstructor, BigInteger value) throws RuntimeException, TransactionException {
        return deploy(type, web3j, (Credentials)credentials, new StaticGasProvider(gasPrice, gasLimit), binary, encodedConstructor, value);
    }

    /** @deprecated */
    @Deprecated
    protected static <T extends ContractR> T deploy(Class<T> type, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit, String binary, String encodedConstructor, BigInteger value) throws RuntimeException, TransactionException {
        return deploy(type, web3j, (TransactionManager)transactionManager, new StaticGasProvider(gasPrice, gasLimit), binary, encodedConstructor, value);
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit, String binary, String encodedConstructor, BigInteger value) {
        return new RemoteCall(() -> {
            return deploy(type, web3j, credentials, gasPrice, gasLimit, binary, encodedConstructor, value);
        });
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit, String binary, String encodedConstructor) {
        return deployRemoteCall(type, web3j, credentials, gasPrice, gasLimit, binary, encodedConstructor, BigInteger.ZERO);
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider, String binary, String encodedConstructor, BigInteger value) {
        return new RemoteCall(() -> {
            return deploy(type, web3j, credentials, contractGasProvider, binary, encodedConstructor, value);
        });
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider, String binary, String encodedConstructor) {
        return new RemoteCall(() -> {
            return deploy(type, web3j, credentials, contractGasProvider, binary, encodedConstructor, BigInteger.ZERO);
        });
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit, String binary, String encodedConstructor, BigInteger value) {
        return new RemoteCall(() -> {
            return deploy(type, web3j, transactionManager, gasPrice, gasLimit, binary, encodedConstructor, value);
        });
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit, String binary, String encodedConstructor) {
        return deployRemoteCall(type, web3j, transactionManager, gasPrice, gasLimit, binary, encodedConstructor, BigInteger.ZERO);
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider, String binary, String encodedConstructor, BigInteger value) {
        return new RemoteCall(() -> {
            return deploy(type, web3j, transactionManager, contractGasProvider, binary, encodedConstructor, value);
        });
    }

    public static <T extends ContractR> RemoteCall<T> deployRemoteCall(Class<T> type, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider, String binary, String encodedConstructor) {
        return new RemoteCall(() -> {
            return deploy(type, web3j, transactionManager, contractGasProvider, binary, encodedConstructor, BigInteger.ZERO);
        });
    }

    public static EventValues staticExtractEventParameters(Event event, Log log) {
        List<String> topics = log.getTopics();
        String encodedEventSignature = EventEncoder.encode(event);
        if (topics != null && topics.size() != 0 && ((String)topics.get(0)).equals(encodedEventSignature)) {
            List<Type> indexedValues = new ArrayList();
            List<Type> nonIndexedValues = FunctionReturnDecoder.decode(log.getData(), event.getNonIndexedParameters());
            List<TypeReference<Type>> indexedParameters = event.getIndexedParameters();

            for(int i = 0; i < indexedParameters.size(); ++i) {
                Type value = FunctionReturnDecoder.decodeIndexedValue((String)topics.get(i + 1), (TypeReference)indexedParameters.get(i));
                indexedValues.add(value);
            }

            return new EventValues(indexedValues, nonIndexedValues);
        } else {
            return null;
        }
    }

    protected String resolveContractAddress(String contractAddress) {
        return this.ensResolver.resolve(contractAddress);
    }

    protected EventValues extractEventParameters(Event event, Log log) {
        return staticExtractEventParameters(event, log);
    }

    protected List<EventValues> extractEventParameters(Event event, TransactionReceipt transactionReceipt) {
        return (List)transactionReceipt.getLogs().stream().map((log) -> {
            return this.extractEventParameters(event, log);
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    protected ContractR.EventValuesWithLog extractEventParametersWithLog(Event event, Log log) {
        return staticExtractEventParametersWithLog(event, log);
    }

    protected static ContractR.EventValuesWithLog staticExtractEventParametersWithLog(Event event, Log log) {
        EventValues eventValues = staticExtractEventParameters(event, log);
        return eventValues == null ? null : new ContractR.EventValuesWithLog(eventValues, log);
    }

    protected List<ContractR.EventValuesWithLog> extractEventParametersWithLog(Event event, TransactionReceipt transactionReceipt) {
        return (List)transactionReceipt.getLogs().stream().map((log) -> {
            return this.extractEventParametersWithLog(event, log);
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    protected String getStaticDeployedAddress(String networkId) {
        return null;
    }

    public final void setDeployedAddress(String networkId, String address) {
        if (this.deployedAddresses == null) {
            this.deployedAddresses = new HashMap();
        }

        this.deployedAddresses.put(networkId, address);
    }

    public final String getDeployedAddress(String networkId) {
        String addr = null;
        if (this.deployedAddresses != null) {
            addr = (String)this.deployedAddresses.get(networkId);
        }

        return addr == null ? this.getStaticDeployedAddress(networkId) : addr;
    }

    protected static <S extends Type, T> List<T> convertToNative(List<S> arr) {
        List<T> out = new ArrayList();
        Iterator var2 = arr.iterator();

        while(var2.hasNext()) {
            S s = (S) var2.next();
            if (StructType.class.isAssignableFrom(s.getClass())) {
                out.add((T) s);
            } else {
                out.add((T) s.getValue());
            }
        }

        return out;
    }

    public static class EventValuesWithLog {
        private final EventValues eventValues;
        private final Log log;

        private EventValuesWithLog(EventValues eventValues, Log log) {
            this.eventValues = eventValues;
            this.log = log;
        }

        public List<Type> getIndexedValues() {
            return this.eventValues.getIndexedValues();
        }

        public List<Type> getNonIndexedValues() {
            return this.eventValues.getNonIndexedValues();
        }

        public Log getLog() {
            return this.log;
        }
    }

    public static void main(String[] args) {

    }
}
