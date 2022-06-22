import { FC, useContext, useEffect, useState } from "react";
import DefaultLayout from "../../components/Layout";
import ProfileContract from "../../controllers/profile/contract";
import Web3Context from "../../controllers/web3/context";
import { getProvider } from "../../controllers/web3/erc/utils";
import { IWeb3Context } from "../../controllers/web3/type";
import HandleGrid from "../../components/HandleGrid";
import HandleControl from "../../components/HandleListControl";
import './allHandle.css';
import { SupportedProvider } from "../../controllers/baseContract/type";

const MyHandlePage: FC = () => {

    const { connect, isRopsten, connectedWallet, network } = useContext<IWeb3Context>(Web3Context);
    const [handles, setHandles] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [provider, setProvider] = useState<SupportedProvider>();
    const LIMIT = 20;


    const getMyHandle = async () => {
        console.log('getting my handle')
        const _provider = provider || await initProvider();
        const profileContract = new ProfileContract(_provider);
        const _handle = await profileContract.getHandlePaginatedList(getOffset(), LIMIT);
        setCount(_handle.meta.count);
        setHandles(_handle.results);
    }

    const getOffset = () => page * LIMIT;

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
        if (network === 3 && connectedWallet) getMyHandle();

    }, [network, connectedWallet, page])

    return (
        <DefaultLayout >
            <div id="HandlePageRoot">

                {provider &&
                    <HandleGrid handles={handles} provider={provider} >
                        <HandleControl page={page} setPage={setPage} count={count} />
                    </HandleGrid>
                }
            </div>
        </DefaultLayout>
    )
};

export default MyHandlePage;