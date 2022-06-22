import { createContext } from 'react';
import { IWeb3Context } from './type';

const Web3Context = createContext<IWeb3Context>({
    connect: async () => {},
    connectedWallet: '',
    isPolygon: async () => {},
    isMumbai: async () => {},
    isRopsten: async () => {},
    network: 0,
    hasMetamask: false
});

export default Web3Context;
