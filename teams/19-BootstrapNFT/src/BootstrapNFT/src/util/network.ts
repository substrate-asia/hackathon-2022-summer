type Network = {
    id: number;
    name: string;
};

export const currentNetwork = (): Network => {
    const sessionNetwork = JSON.parse(
        sessionStorage.getItem("chain") ?? "null"
    );
    return sessionNetwork || { id: 4, name: "rinkeby" };
};

const networks: any = {
    4: {
        chainId: "0x4",
        chainName: "Rinkeby Test Network",
        rpcUrls: ["https://rinkeby.infura.io/v3/"],
        nativeCurrency: {
            name: "ETH",
            symbol: "RinkebyETH",
            decimals: 18,
        },
        blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    },
    1313161555: {
        chainId: "0x4e454153",
        chainName: "Aurora Testnet",
        rpcUrls: ["https://testnet.aurora.dev"],
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.aurorascan.dev/"],
    },
};

export const changeNetwork = async (network: Network, provider: any) => {
    sessionStorage.setItem("chain", JSON.stringify(network));
    console.log("prover", typeof provider, provider);
    console.log("network", network.id.toString(16));
    if (provider.isMetaMask) {
        if (
            provider.chainId !== network.id ||
            provider.chainId !== network.id.toString(16)
        ) {
            try {
                await provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x" + network.id.toString(16) }],
                });
            } catch (switchError: any) {
                console.log("aaa", switchError);
                if (switchError.code === 4902) {
                    try {
                        await provider.request({
                            method: "wallet_addEthereumChain",
                            params: [networks[network.id]],
                        });
                    } catch (addError: any) {
                        console.error("add chain", addError.message);
                    }
                }
            }
        }
    }
    window.location.href = "/";
};
