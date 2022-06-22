import { ChainId } from '@my/sdk';
import tokens, { chainId, DOT, main_tokens } from './tokens';
import { chainKey } from 'config';
import { FarmConfig } from './types';
export const KACO_LP_PID = 0;
export const KACO_BNB_LP_PID = 1;
export const BUSD_BNB_LP_PID = 2;
export const FARM_QUOTE_QUOTE_TOKEN_SYMBOL = DOT[chainId]!.symbol;

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'aKKS',
    lpAddresses: {
      [ChainId.SDN_TESTNET]: '0x9A6080753a35dCd8e77102aE83A93170A831393e',
      [ChainId.SDN_MAINNET]: '0x9A6080753a35dCd8e77102aE83A93170A831393e',
    },
    lpMasterChefes: {
      [ChainId.SDN_TESTNET]: '0x4BfF42C0F19A46f4c3bf2c2A07a7e6a17f16ea88',
      [ChainId.SDN_MAINNET]: '0x4BfF42C0F19A46f4c3bf2c2A07a7e6a17f16ea88',
    },
    lpDetail: {
      symbol: 'KAC-wSDN LP',
      address: {
        [ChainId.SDN_TESTNET]: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
        [ChainId.SDN_MAINNET]: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
      },
      decimals: 18,
    },
    token: tokens[chainKey].kaco,
    quoteToken: main_tokens.sdn,
    decimals: 18,
  },
];

export default farms;
