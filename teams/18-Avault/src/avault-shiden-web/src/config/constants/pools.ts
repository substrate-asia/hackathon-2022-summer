import { ChainId, CHAINKEY } from '@my/sdk';
import tokens from './tokens';
import { PoolConfig, PoolCategory } from './types';
import { chainKey } from 'config';
const pools: PoolConfig[] =
  chainKey === CHAINKEY.BSC
    ? [
        {
          sousId: 0,
          stakingToken: tokens[chainKey].kaco,
          earningToken: tokens[chainKey].kaco,
          contractAddress: {
            [ChainId.BSC_TESTNET]: '0x7DE7fF5D0290695c7f8a4531ff77FFCC8461C29e',
            [ChainId.BSC_MAINNET]: '0x81b71D0bC2De38e37978E6701C342d0b7AA67D59',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.02',
          sortOrder: 1,
          isFinished: false,
        },
        {
          sousId: 1,
          stakingToken: tokens[chainKey].kaco,
          earningToken: tokens[chainKey].usdt,
          contractAddress: {
            [ChainId.BSC_TESTNET]: '',
            [ChainId.BSC_MAINNET]: '0x2c57d7A3352506367be29691eDC0ae77FdD636A8',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.023148148148148',
          sortOrder: 999,
          isFinished: false,
        },
        {
          sousId: 2,
          stakingToken: tokens[chainKey].kaco,
          earningToken: tokens[chainKey].dot,
          contractAddress: {
            [ChainId.BSC_TESTNET]: '',
            [ChainId.BSC_MAINNET]: '0xb676E8fa2a1B38C2Cb22ab14b53743efb2cA93c9',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.0004930555550',
          sortOrder: 999,
          isFinished: false,
        },
      ]
    : [];

export default pools;
