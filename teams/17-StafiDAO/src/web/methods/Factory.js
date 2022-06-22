import Web3 from "./web3.min.js";
import $store from "@/store/index";
import Web3_, {
	providers
} from "web3";
import factory from "../contracts/Factory.json";
let web3;
let web3_ = new Web3(
	new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);
let myContract = new web3_.eth.Contract(factory.abi, $store.state.factory);

function web3_new() {
	if (window.ethereum) { 
		try {
			window.ethereum.enable();
		} catch (error) {
			console.error("User denied account access");
		}
		web3 = new Web3(window.ethereum);
	} else if (window.web3) {
		web3 = new Web3(window.ethereum);
	} else {
		alert("Please install wallet");
	}
	const contract = new web3.eth.Contract(
		factory.abi,
		$store.state.factory
	);
	return contract
}

export async function createDAO({
	authorAmount,
	blockHeight,
	stkName,
	stkSymbol,
	retName,
	retSymbol,
	retAmount,
}) {
	// getDaoAddrs()
	// return
	// let arr=[]
	// let Airdrop=await setAirdropModelAddr()
	// return
	// let Faucet=await setFaucetModelAddr()
	// let Govern=await setGovernModelAddr()
	// let Pool=await setPoolModelAddr()
	// let Reward=await setRewardModelAddr()
	console.log("1")
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let transferData = contract.methods.createDAO(web3.utils.toWei(authorAmount),
		web3.utils.toWei(blockHeight),
		stkName,
		stkSymbol,
		retName,
		retSymbol,
		retAmount).encodeABI();
		console.log("2")
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.factory);
		console.log("3",gasPrice,nonce)
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.factory,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		value: '0x0',
		data: transferData,
		chainId: 1287
	};	
	console.log("4")
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			getDaoAddrs()
			return hash
		})
		.on("error", console.error);
	console.log("5")	
	
}

async function setAirdropModelAddr(){
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let transferData = contract.methods.setAirdropModelAddr($store.state.airdrop).encodeABI();
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.airdrop);
		console.log(gasPrice,nonce,transferData)
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.airdrop,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		// value: ,
		data: transferData,
	};	
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			return hash
		})
		.on("error", console.error);
}

async function setFaucetModelAddr(){
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let transferData = contract.methods.setFaucetModelAddr($store.state.faucet).encodeABI();
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.faucet);
		console.log(gasPrice,nonce)
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.faucet,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		value: '0x0',
		data: transferData,
		chainId: 1287
	};	
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			return hash
		})
		.on("error", console.error);
}

async function setGovernModelAddr(){
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let transferData = contract.methods.setGovernModelAddr($store.state.governance).encodeABI();
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.governance);
		console.log(gasPrice,nonce)
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.governance,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		value: '0x0',
		data: transferData,
		chainId: 1287
	};	
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			return hash
		})
		.on("error", console.error);
	
}

async function setPoolModelAddr(){
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let transferData = contract.methods.setPoolModelAddr($store.state.pool).encodeABI();
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.pool);
		console.log(gasPrice,nonce)
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.pool,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		value: '0x0',
		data: transferData,
		chainId: 1287
	};	
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			return hash
		})
		.on("error", console.error);
}

async function setRewardModelAddr(){
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let transferData = contract.methods.setRewardModelAddr($store.state.reward).encodeABI();
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.reward);
		console.log(gasPrice,nonce)
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.reward,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		value: '0x0',
		data: transferData,
		chainId: 1287
	};	
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			return hash
		})
		.on("error", console.error);
}

async function getDaoAddrs(){
	let res = await myContract.methods.getDaoAddrs(0).call({
	  from: $store.state.accs,
	  gas: 3141592,
	});
	$store.commit('setGovernan',res[0])
	$store.commit('setPool',res[1])
	$store.commit('setAirdrop',res[2])
	$store.commit('setReward',res[3])
	console.log($store.state.governanceAddress)
	console.log($store.state.poolAddress)
	console.log($store.state.airdropAddress)
	console.log($store.state.rewardAddress)
	return res;
}
