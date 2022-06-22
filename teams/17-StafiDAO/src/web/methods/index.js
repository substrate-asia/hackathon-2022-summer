import Web3 from "./web3.min.js";
import $store from "@/store/index";
import Web3_, {
	providers
} from "web3";
import adou from "../contracts/AdouCollator.json";
let web3;
let web3_ = new Web3(
	new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);
let myContract = new web3_.eth.Contract(adou.abi, $store.state.contractAddress);

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
		adou.abi,
		$store.state.contractAddress
	);
	return contract
}
export async function addStake(val) {
	let contract=web3_new()
	web3.eth.getBalance($store.state.accs).then(console.log);
	let chainId = await web3.eth.getChainId();
	let amount = val + "";
	let transferData = contract.methods.addStake().encodeABI();
	// let estimateGasRes=await web3.eth.estimateGas({from:$store.state.accs, to: "0x531a48659Cf2AF1067E8D03e9d14c5DA2d19D9EB", value: web3.utils.toWei("1")})
	// console.log(estimateGasRes)
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.contractAddress);
	let estimateGasRes = await web3.eth.estimateGas({
		to: $store.state.contractAddress,
		data: transferData,
		from: $store.state.accs,
		value: web3.utils.toWei(amount),
	});
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.contractAddress,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		value: web3.utils.toWei(amount),
		data: transferData,
		// chainId: 1287
	};
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			console.log(hash);
		})
		.on("error", console.error);

	//计算交易手续费TxFee
	// let fee = estimateGasRes*gasPrice
	// let gass=parseInt(fee) + parseInt(web3.utils.toWei("1","ether"))
	// console.log(gass)
	// const txObject = {
	// 		nonce: web3.utils.toHex(nonce*10),
	// 		to: $store.state.accs,
	// 		gas: 100000*2,
	// 		gasPrice: gasPrice,
	// 		// gasLimit: '0x420710',
	// 		//链ID，这里我填的是BSC测试网的链ID
	// 		chainId: 1287,
	// 		// //这里调用的方法是代币合约里的授权转账方法
	// 		data: contract.methods.addStake().encodeABI()
	// 	}
	// 	console.log(txObject)
	// 	let tx = await web3.eth.accounts.signTransaction(txObject,
	// 		"0x38d785e7eb849e732521be8c1c8e5c52d88524dd183cb8f14687eb9496c384f6")
	// 	console.log(tx)
	// 	web3.eth.sendSignedTransaction(tx.rawTransaction, (err, txHash) => {
	// 		console.log('err:', err, 'txHash:', txHash)
	// 	})
	// 50000000000000000000
	// 1000022317000000000
	console.log("5");
}

export async function scheduleRedeemStake(val){//计划赎回
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let amount = val + "";
	let transferData = contract.methods.scheduleRedeemStake(web3.utils.toWei(amount)).encodeABI();
	console.log(transferData)
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.contractAddress);
	// let estimateGasRes = await web3.eth.estimateGas({
	// 	to: $store.state.contractAddress,
	// 	data: transferData,
	// 	from: $store.state.accs,
	// 	value: web3.utils.toWei(amount),
	// });
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.contractAddress,
		nonce: web3.utils.toHex(nonce),
		gasPrice: gasPrice,
		// gas: estimateGasRes * 2,
		gas: 2000000 * 2,
		value: web3.utils.toWei(amount),
		data: transferData,
		// chainId: 1287
	};
	web3.eth
		.sendTransaction(rawTransaction)
		.on("transactionHash", function(hash) {
			console.log(hash);
		})
		.on("error", console.error);
} 


export async function sudo({
	techProportion,
	fundsDownLimit,
	perInvestDownLimit,
	nodeStartDate,
	rewardDownLimit,
	techRewardAddr,
	scheduleTime,
	authorMappingLimit
}) {
	let contract=web3_new()
	let chainId = await web3.eth.getChainId();
	let transferData = contract.methods.setParameter(web3.utils.toWei(techProportion),
		web3.utils.toWei(fundsDownLimit),
		web3.utils.toWei(perInvestDownLimit),
		web3.utils.toWei(nodeStartDate),
		web3.utils.toWei(rewardDownLimit),
		techRewardAddr,
		web3.utils.toWei(scheduleTime),
		web3.utils.toWei(authorMappingLimit)).encodeABI();
	let gasPrice = await web3.eth.getGasPrice();
	let nonce = await web3.eth.getTransactionCount($store.state.contractAddress);
		console.log(gasPrice,nonce)
	let rawTransaction = {
		from: $store.state.accs,
		to: $store.state.contractAddress,
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

export async function getBalance() {
	//获取账户余额
	let res = await myContract.methods.getBalance().call({
		from: $store.state.accs,
		gas: 3141592,
	});
	return web3_.utils.fromWei(res);
	// await contract.methods.getBalance().call({
	// 	from: $store.state.accs,
	// 	gas: 3141592
	// }, function(error, result) {
	// 	console.log(result)
	// 	console.log(error)
	// 	return result

	// });
}
export async function getTotalReward() {
	//查看节点总奖励
	let res = await myContract.methods.getTotalReward().call({
		from: $store.state.accs,
		gas: 3141592,
	});
	return res;
}
export async function getPendingReward() {
  //查看节点待领取奖励
  let res = await myContract.methods.getPendingReward().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getAnnualReward() {
  //查看年化奖励
  let res = await myContract.methods.getAnnualReward().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}
export async function getStake() {
	//查看抵押
	let res = await myContract.methods.getStake().call({
		from: $store.state.accs,
		gas: 3141592,
	});
	return res;
}
export async function getStakeProportion() {
	//查看抵押所占比例
	let res = await myContract.methods.getStakeProportion().call({
		from: $store.state.accs,
		gas: 3141592,
	});
	return res;
}
// 查看节点总抵押
export async function getTotalStake() {
  //查看节点总抵押
  let res = await myContract.methods.getTotalStake().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}
export async function getMemberReal() {
  //查看节点成员人数
  let res = await myContract.methods.getMemberReal().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}
export async function getMemberTotal() {
   //查看节点历史成员总人数
  let res = await myContract.methods.getMemberTotal().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getRedeem() {
   //查看赎回
  let res = await myContract.methods.getRedeem().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function executeRedeemStake() {
   //赎回节点抵押
  let res = await myContract.methods.executeRedeemStake().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}


export async function scheduleLeaveStake() {
   //节点计划解散
  let res = await myContract.methods.scheduleLeaveStake().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function executeLeaveStake() {
   //节点执行解散
  let res = await myContract.methods.executeLeaveStake().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function start() {
   //节点开启（关闭抵押）500个才可用此事件
   let  TotalStake= await myContract.methods.getTotalStake().call({
     from: $store.state.accs,
     gas: 3141592,
   });
   if(TotalStake>=500){
	   let res = await myContract.methods.start().call({
	     from: $store.state.accs,
	     gas: 3141592,
	   });
	   return res;
   }else return null
  
}
