// Set of helper functions to facilitate wallet setup

import { ChainId } from '@my/sdk';
import { BASE_BSC_SCAN_URL, BASE_URL, chainKey } from 'config';
import { chainId } from 'config/constants/tokens';

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
const wallet_config = {
  [ChainId.ASTR_MAINNET]: {
    chainId: `0x${ChainId.ASTR_MAINNET.toString(16)}`,
    chainName: 'Astar Network Mainnet',
    nativeCurrency: {
      name: 'ASTR Token',
      symbol: 'ASTR',
      decimals: 18,
    },
    rpcUrls: ['https://astar.api.onfinality.io/public'],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },
  [ChainId.ASTR_TESTNET]: {
    chainId: `0x${ChainId.ASTR_TESTNET.toString(16)}`,
    chainName: 'Shibuya Testnet',
    nativeCurrency: {
      name: 'ASTR Token',
      symbol: 'ASTR',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.shibuya.astar.network:8545'],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },
  [ChainId.SDN_MAINNET]: {
    chainId: `0x${ChainId.SDN_MAINNET.toString(16)}`,
    chainName: 'Shiden Network Mainnet',
    nativeCurrency: {
      name: 'SDN Token',
      symbol: 'SDN',
      decimals: 18,
    },
    rpcUrls: ['https://evm.shiden.astar.network'],
    // rpcUrls: ['https://shiden.api.onfinality.io/public'],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },
  [ChainId.SDN_TESTNET]: {
    chainId: `0x${ChainId.ASTR_TESTNET.toString(16)}`,
    chainName: 'Shibuya Testnet',
    nativeCurrency: {
      name: 'SDN Token',
      symbol: 'SDN',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.shibuya.astar.network:8545'],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },

  [ChainId.BSC_MAINNET]: {
    chainId: `0x${ChainId.BSC_MAINNET.toString(16)}`,
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },

  [ChainId.BSC_TESTNET]: {
    chainId: `0x${ChainId.BSC_TESTNET.toString(16)}`,
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'BNB Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
  },
};

export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [wallet_config[chainId]],
      });
      return true;
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `${BASE_URL[chainKey]}/images/tokens/${chainKey}/${tokenAddress}.svg`,
      },
    },
  });

  return tokenAdded;
};
