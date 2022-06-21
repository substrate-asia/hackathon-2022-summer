import { ERC20_ABI } from 'config/abi/erc20';
import { Contract } from 'ethers';
import { useContract } from 'hooks/useContract';
import multicall, { multicallv3 } from 'utils/multicall';
import grassHouseAbi from '../../constants/abi/grassHouseAbi.json';
import { grassHouseListConfig } from '../../constants/constants';
import { IGrassHouse } from './types';
// struct LockedBalance {
//   int128 amount;
//   uint256 end;
// }

export const fetchGrassHouseListUserData = async (
  grassHouseList: IGrassHouse[],
  account: string,
): Promise<IGrassHouse[]> => {
  const grassHouseListToken = await Promise.all(
    grassHouseList.map(async (grassHouse) => {
      const { claimReward } = await fetchGrassHouseClaimUserData({
        grassHouseAddress: grassHouse.address,
        account,
      });
      return {
        ...grassHouse,
        rewards: claimReward,
      };
    }),
  );
  return grassHouseListToken;
};
export const fetchGrassHouseUserData = async (grassHouse: IGrassHouse, account: string): Promise<IGrassHouse> => {
  const { claimReward } = await fetchGrassHouseClaimUserData({
    grassHouseAddress: grassHouse.address,
    account,
  });
  return {
    ...grassHouse,
    rewards: claimReward,
  };
};

export const fetchGrassHouseListData = async (grassHouseList: IGrassHouse[]): Promise<IGrassHouse[]> => {
  const grassHouseListToken = await Promise.all(
    grassHouseListConfig.map(async (grassHouse, index) => {
      if (grassHouseList[index].token === null) {
        const { symbol, name, decimals } = await fetchGrassHouseData({ grassHouseAddress: grassHouse.address });
        return {
          address: grassHouse.address,
          token: {
            address: grassHouse.address,
            decimals: decimals,
            symbol: symbol,
            name: name,
          },
        };
      } else {
        return grassHouse;
      }
    }),
  );
  return grassHouseListToken;
};

export const fetchGrassHouseData = async ({ grassHouseAddress }: { grassHouseAddress: string }): Promise<any> => {
  const calls = [{ address: grassHouseAddress, name: 'rewardToken' }];
  const [rewardToken] = await multicall(grassHouseAbi, calls);
  if (rewardToken && rewardToken.length) {
    const _rewardToken = rewardToken[0];
    const calls = [
      { address: _rewardToken, name: 'name' },
      { address: _rewardToken, name: 'symbol' },
      { address: _rewardToken, name: 'decimals' },
    ];
    const [[name], [symbol], [decimals]] = await multicall(ERC20_ABI, calls);
    return { name, symbol, decimals };
  }
  return { name: '', symbol: '', decimals: 18 };
};

export const fetchGrassHouseClaimUserData = async ({
  grassHouseAddress,
  account,
}: {
  grassHouseAddress: string;
  account: string;
}): Promise<any> => {
  try {
    const calls = [{ address: grassHouseAddress, name: 'claim', params: [account] }];
    const [[claimReward]] = await multicallv3(grassHouseAbi, calls);
    return { claimReward: claimReward.toString() };
  } catch (e) {
    console.log('err: ', e);
  }
};

export const useGrassHouseContract = (grassHouseAddress: string, withSignerIfPossible?: boolean): Contract | null => {
  return useContract(grassHouseAddress, grassHouseAbi, withSignerIfPossible);
};
