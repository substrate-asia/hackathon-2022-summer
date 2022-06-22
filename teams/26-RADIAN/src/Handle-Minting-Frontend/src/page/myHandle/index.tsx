import { FC, useContext, useEffect, useState } from "react";
import DefaultLayout from "../../components/Layout";
import ProfileContract from "../../controllers/profile/contract";
import Web3Context from "../../controllers/web3/context";
import { getProvider } from "../../controllers/web3/erc/utils";
import { IWeb3Context } from "../../controllers/web3/type";
import HandleGrid from "../../components/HandleGrid";
import './myHandle.css';
import { Typography } from "antd";
import HandleListControl from "../../components/HandleListControl";
import { SupportedProvider } from "../../controllers/baseContract/type";

const MyHandlePage: FC = () => {

    const { connect, isRopsten, connectedWallet, network } = useContext<IWeb3Context>(Web3Context);
    const [handles, setHandles] = useState<string[]>([]);
    const [provider, setProvider] = useState<SupportedProvider>();

    const getMyHandle = async () => {
        console.log('getting my handle')
        const _provider = provider || await initProvider();
        const profileContract = new ProfileContract(_provider);
        const _handle = await profileContract.getHandlesByAddress(connectedWallet);
        console.log(_handle)
        setHandles(_handle);
    }

    const initProvider = async () => {
        const _provider = await getProvider();
        setProvider(_provider);

        return _provider;
    };

    useEffect(() => {
        if (!connectedWallet) {
            connect();
        }
        isRopsten();
    }, [])

    useEffect(() => {
        if (network === 3 && connectedWallet) {
            getMyHandle()
        }

    }, [network, connectedWallet])

    return (
        <DefaultLayout >
            <div id='HandlePageRoot'>
                {provider &&
                    <HandleGrid handles={handles} provider={provider} >
                        <div
                            style={{
                                padding: '0 5px 30px',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography.Title>My Profile NFTs</Typography.Title>
                        </div>
                    </HandleGrid>
                }
            </div>
        </DefaultLayout>
    )
};

export default MyHandlePage;