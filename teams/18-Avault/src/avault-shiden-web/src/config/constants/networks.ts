import { ChainId } from '@my/sdk';

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.BSC_MAINNET]: 'https://bsc-dataseed1.defibit.io',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',

  [ChainId.SDN_MAINNET]: 'https://evm.shiden.astar.network',
  [ChainId.SDN_TESTNET]: 'https://evm.shiden.astar.network',

  [ChainId.ASTR_MAINNET]: 'https://astar.api.onfinality.io/public',
  [ChainId.ASTR_TESTNET]: 'https://astar.api.onfinality.io/public',
};

export default NETWORK_URLS;
