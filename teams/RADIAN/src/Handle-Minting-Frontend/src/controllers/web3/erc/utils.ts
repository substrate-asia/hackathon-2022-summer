import { ethers, Signer } from "ethers";
import PolygonIcon from "../../../components/Icons/polygon.components";
import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import ErrorHandler from "../../error/errorHandler";
import Web3 from "web3";


export async function getProvider(): Promise<Web3Provider> {
    return new ethers.providers.Web3Provider(window.ethereum, "any");
}

async function initEtherProvider(): Promise<Web3Provider> {
    console.log("init provider");
    let resp = await connectWallet();
    if (!resp) throw Error('4001');
    return await getProvider();
}

function ercErrorHandler(code: string): string {
    switch (parseInt(code)) {
        case 4001:
            return 'Unable to find provider';
        case 4002:
            return 'Unable to find signer';
        case 4003:
            return 'Unable to connect wallet';
        case 4100:
            return 'Invalid address'
        default:
            return 'something went wrong';
    }
}

async function getSigner(): Promise<Signer> {
    console.log("getting signer");
    let provider = await initEtherProvider();
    if (!provider) throw Error('4001')
    return await provider.getSigner()
};

async function getAddress() {
    console.log("getting address");
    let signer = await getSigner();
    if (!signer) throw Error('4002');
    return await signer.getAddress();
}

async function getChainId() {
    console.log("Get chain ID");
    const eth = await initEtherProvider();
    if (!eth) return null;
    let currentNetworkId = await eth.getNetwork();
    // console.log('ERC_CHAINID_UTILS', currentNetworkId)
    return currentNetworkId;
}

const networkMapping : any = {
    137: {
      chainId: Web3.utils.toHex(137), // '0x89'
      chainName: "Matic(Polygon) Mainnet", 
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://www.polygonscan.com/"],
    },
    80001: {
      chainId: Web3.utils.toHex(80001), // '0x13881'
      chainName: "Polygon Testnet",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
};

async function switchNetwork(chainId: number) {

    const param = networkMapping[chainId];
    try {
        const data = [{ chainId: Web3.utils.toHex(chainId) }]// '0x89'
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: data,
        });
        return true;
    } catch (switchError: any) {
        console.log('Error in switching polygon', switchError)
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [param]
                })
            } catch (err) {
                console.log('Error in adding ethereum chain', err)
            }
        }
    }
};

/**
 * method to connect metamask
 * @returns {[string]} array of wallet address
 */
async function connectWallet() : Promise<string[]> {
    const provider: any = await detectEthereumProvider();
    if (provider) {
        try {
            const resp = await window.ethereum.request({ method: 'eth_requestAccounts', params: [{ eth_accounts: {} }] })
            return resp;    
        } catch(err) {
            console.log(err)
            throw(err)
        }
    } else {
        throw(ErrorHandler(1000))
    }
        // try {
        //     if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
        //         let resp = await window.ethereum.request({ method: 'eth_requestAccounts', params: [{ eth_accounts: {} }] })
        //         return resp;
        //     }
        // } catch (err: any) {
        //     if (err.code == -32002) {
        //         console.log("Pending Request");
        //         // TODO show snack bar to notify user here
        //     }
        //     console.log('Error in connecting wallet', err.message);
        //     throw Error('4003')
        // }
}

function isConnected() {
    return window.ethereum.isConnected()
}


async function initContract(
    address: string, 
    abi: any, 
    readOnly: boolean = false
    ) {
    try {
        let signer: Signer = await getSigner();
        const contract = new ethers.Contract(address, abi, signer);
        return contract;    
    } catch(err) {
        console.error(err);
    }
    // signer = ethers.getDefaultProvider(maticHttpProvider)
    // console.log('initContract signer', signer);
}

// async function initContractGasless(
//     address: string, 
//     abi: any, 
//     config: any) {
//     let provider = await initEtherProvider();
//     const RelayProvider = require('@opengsn/provider');
//     let relayProvider = provider = await RelayProvider.newProvider({ provider: window.ethereum, config }).init();
//     const provider2 = new ethers.providers.Web3Provider(relayProvider, "any");
//     const signer = provider2.getSigner();
//     const contract = new ethers.Contract(address, abi, signer);
//     return contract;
// };

function validAddress(address: string) {
    try {
        return ethers.utils.getAddress(address);
    } catch (err) {
        console.log(err)
        throw({status: 4100})
    }
    
}


const ERCUtils = {
    getSigner,
    getAddress,
    validAddress,
    getChainId,
    switchNetwork,
    connectWallet,
    initContract,
    ercErrorHandler,
    getProvider,
    // initContractGasless,
    isConnected,
}

export default ERCUtils;