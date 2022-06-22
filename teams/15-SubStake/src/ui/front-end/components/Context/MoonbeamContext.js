import React, { useState, useContext, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ethers } from 'ethers';

const providerRPC = {
  moonbeam: {
    name: 'moonbase-alpha',
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
    chainId: 1287, // 0x507 in hex,
  },
};

const MoonbeamContext = React.createContext();

const MoonbeamContextProvider = (props) => {
  const [provider, setProvider] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const _provider = new ethers.providers.StaticJsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });

    setProvider(_provider);
    setIsLoaded(true);
  }, []);

  return <MoonbeamContext.Provider value={{ provider, isLoaded }}>{props.children}</MoonbeamContext.Provider>;
};

const useMoonbeam = () => useContext(MoonbeamContext);

export { MoonbeamContextProvider, useMoonbeam };
