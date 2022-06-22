import React, { useState, useContext, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

const WESTEND_SOCKET = 'wss://ws-api.substake.app';

const WestendContext = React.createContext();

const WestendContextProvider = (props) => {
  const [api, setApi] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initApi = async () => {
      const provider = new WsProvider(WESTEND_SOCKET);
      const _api = await ApiPromise.create({ provider });
      setApi(_api);
      setIsLoaded(true);
    };

    initApi();
  }, []);

  return <WestendContext.Provider value={{ api, isLoaded }}>{props.children}</WestendContext.Provider>;
};

const useWestend = () => useContext(WestendContext);

export { WestendContextProvider, useWestend };
