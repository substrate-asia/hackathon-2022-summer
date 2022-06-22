import { useEffect, useState , useContext, FC, ReactNode} from "react";
import Web3Context from "./context"
import ERCUtils from "./erc/utils";
import { WalletProvider } from "./type";
import detectEthereumProvider from "@metamask/detect-provider";
import { message } from "antd";
import Web3 from "web3";

interface Web3ProviderProps {
    children: ReactNode
}

const Web3Provider : FC<Web3ProviderProps> = ({ children }) => {

    const POLYGON_TESTNET_CHAINID = 80001;
    const POLYGON_MAINNET_CHAINID = 137;
    const ETHER_ROPSTEN_CHAINID = 3;

    const [ hasMetamask, setHasMetamask ] = useState<boolean>(false);
    const [ networkId, setNetworkId ] = useState<number>(0);
    const [ connectedWallet, setConnectedWallet ] = useState<string>('');

    const detectMetamask = async () : Promise<void> => {
        const provider: any = await detectEthereumProvider();
        setHasMetamask(Boolean(provider))
    }

    const checkNetworkOrSwitch = async (
        targetNetwork: number        
    ): Promise<void> => {
        console.log(networkId);
        try {
            if (networkId != targetNetwork) {
                message.info(`we are switching you to the network ${targetNetwork}`)

                await ERCUtils.switchNetwork(targetNetwork);
            }
        } catch (error) {
            console.log(error)
            throw(error)
        }
    }

    const isPolygon = async () : Promise<void> => {
        try {
            await checkNetworkOrSwitch(POLYGON_MAINNET_CHAINID)
        } catch (error) {
            throw(error)
        }
    }

    const isMumbai = async () => {
        try {
            await checkNetworkOrSwitch(POLYGON_TESTNET_CHAINID)
        } catch (error) {
            throw(error)
        }
    }

    const isRopsten = async () => {
        try {
            await checkNetworkOrSwitch(ETHER_ROPSTEN_CHAINID)
        } catch (error) {
            throw(error)
        }
    }
    const connectERCProvider = async (init: boolean=false) => {
        if (window.ethereum !== undefined && window.ethereum?.isMetaMask) {
            let _connectedWallet = await ERCUtils.connectWallet();
            if (_connectedWallet.length > 0) {
                if (!init) {
                    setConnectedWallet(_connectedWallet[0])
                }
            }
            return _connectedWallet
        } else {
            throw('something went wrong')
        }
    }

    const getEthereumChainId = (): number => {
        return window.ethereum.networkVersion;
    }   

    const connectProvider = async () => {
        try {
            const resp: string[] = await connectERCProvider();
            if (resp.length > 0) {
                message.info(`connected ${resp[0]}`)
                let _networkId = getEthereumChainId();
                if (typeof _networkId === 'string') {
                    _networkId = parseInt(_networkId)
                }
                setNetworkId(_networkId)
            }
            return resp;            
        } catch (error) {
            console.log(error)
            throw(error);
        }
    };

    useEffect(() => {
        // listen to chain change event  
        window.ethereum?.on("chainChanged", async (_chainIdInHex: string) => {
            const _chainId = Web3.utils.toNumber(_chainIdInHex);
            setNetworkId(_chainId);
        });
    
        return () => window.ethereum?.removeAllListeners();
    }, [])
    

    useEffect(() => {
        detectMetamask()
    }, [])

    const providerValue = {
        connect: connectProvider,
        connectedWallet: connectedWallet,
        isPolygon: isPolygon,
        isMumbai: isMumbai,
        isRopsten: isRopsten,
        hasMetamask: hasMetamask,
        network: networkId,
    };
 
    return (
        <Web3Context.Provider value={providerValue}>
            {children}
        </Web3Context.Provider>
    )
};

export default Web3Provider;