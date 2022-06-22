import addresses from 'config/constants/contracts';
import multicall from 'utils/multicall';
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';
import masterchefABI from 'config/abi/masterchef.json';
import masterchefSdnABI from 'config/abi/masterchef_Shiden.json';
import sousChefABI from 'config/abi/sousChefV2.json';
import { getMasterChefAddress } from 'utils/addressHelpers';
import { PoolConfig } from 'config/constants/types';
import { chainId } from 'config/constants/tokens';
import pools from 'config/constants/pools';
import { chainKey } from 'config';
import { CHAINKEY } from '@my/sdk';

const base = BIG_TEN.pow(new BigNumber(18));

export const fetchTokenPerBlock = async () => {
  const _masterchefABI = chainKey === CHAINKEY.SDN ? masterchefSdnABI : masterchefABI;
  const res = await multicall(_masterchefABI, [
    {
      address: addresses.masterChef[chainId],
      name: chainKey === CHAINKEY.SDN ? 'kacPerShidenBlock' : 'kacPerBlock',
    },
  ]);

  const tokenPerBlock = new BigNumber(res.toString()).div(base);
  console.log(tokenPerBlock.toNumber());
  return tokenPerBlock;
};

export const fetchRewardPerBlock = async (pool: PoolConfig) => {
  // console.log(`${pool.sousId}` !== '0');
  if (pool.sousId !== 0) {
    // console.log(pool.sousId, addresses.masterChef[chainId]);
    const res = await multicall(sousChefABI, [
      {
        address: pools[pool.sousId].contractAddress[chainId],
        name: 'rewardPerBlock',
      },
    ]);
    const rewardPerBlock = new BigNumber(res.toString()).div(base);
    return rewardPerBlock;
  } else {
    return new BigNumber(0);
  }
};

export const usePoolWeight = async (pool: PoolConfig) => {
  const { sousId } = pool;

  // Only make masterchef calls if farm has pid
  const [info, totalAllocPoint] =
    sousId || sousId === 0
      ? await multicall(masterchefABI, [
          {
            address: getMasterChefAddress(),
            name: 'poolInfo',
            params: [sousId],
          },
          {
            address: getMasterChefAddress(),
            name: 'totalAllocPoint',
          },
        ])
      : [null, null];

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;
  return poolWeight;
};
