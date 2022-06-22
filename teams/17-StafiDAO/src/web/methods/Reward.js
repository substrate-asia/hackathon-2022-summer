import Web3 from "./web3.min.js";
import $store from "@/store/index";
import Web3_, {
	providers
} from "web3";
import reward from "../contracts/Reward.json";
let web3;
let web3_ = new Web3(
	new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);
let myContract = new web3_.eth.Contract(reward.abi, $store.state.contractAddress);

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
		reward.abi,
		$store.state.rewardAddress
	);
	return contract
}

