import erc20ABI from 'config/abi/erc20.json';
import { IVault } from './types';
import BigNumber from 'bignumber.js';
import multicall from 'utils/multicall';
import masterchefABI from 'config/abi/masterchef.json';
import masterchefSdnABI from 'config/abi/masterchef_Shiden.json';
import { chainKey } from 'config';
import { CHAINKEY } from '@my/sdk';
import { chainId } from 'config/constants/tokens';
import AVaultPCS_ABI from 'config/abi/AVaultPCS_ABI.json';
import { haveNumber } from 'utils';

export const fetchVaultsFarmUserAllowances = async (account: string, vaults: IVault[], index?: number) => {
  const calls = !haveNumber(index)
    ? vaults.map((vault: IVault) => {
        const lpAddresses = vault.farm.lpAddresses;
        const contractAddress = vault.contractAddress[chainId];
        return {
          address: lpAddresses,
          name: 'allowance',
          params: [account, contractAddress],
        };
      })
    : [
        {
          address: vaults[index].farm.lpAddresses,
          name: 'allowance',
          params: [account, vaults[index].contractAddress[chainId]],
        },
      ];

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toString();
  });
  return parsedLpAllowances;
};
export const fetchVaultsFarmUserTokenBalances = async (account: string, vaults: IVault[], index?: number) => {
  const calls = !haveNumber(index)
    ? vaults.map((vault: IVault) => {
        const lpAddresses = vault.farm.lpAddresses;
        return {
          address: lpAddresses,
          name: 'balanceOf',
          params: [account],
        };
      })
    : [
        {
          address: vaults[index].farm.lpAddresses,
          name: 'balanceOf',
          params: [account],
        },
      ];

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance, index) => {
    return new BigNumber(tokenBalance).toString();
  });
  return parsedTokenBalances;
};

export const fetchVaultsFarmStakedBalances = async (account: string, vaults: IVault[], index?: number) => {
  const calls = !haveNumber(index)
    ? vaults.map((vault: IVault) => {
        const masterChef = vault.vault.masterChef;
        return {
          address: masterChef,
          name: 'userInfo',
          params: [vault.farm.pid, account],
        };
      })
    : [
        {
          address: vaults[index].vault.masterChef,
          name: 'userInfo',
          params: [vaults[index].farm.pid, account],
        },
      ];
  const _masterchefABI = chainKey === CHAINKEY.SDN ? masterchefSdnABI : masterchefABI;
  const rawStakedBalances = await multicall(_masterchefABI, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};
export const fetchVaultsFarmEarnings = async (account: string, vaults: IVault[], index?: number) => {
  const calls = !haveNumber(index)
    ? vaults.map((vault: IVault) => {
        const masterChef = vault.vault.masterChef;
        return {
          address: masterChef,
          name: 'pendingCake',
          params: [vault.farm.pid, account],
        };
      })
    : [
        {
          address: vaults[index].vault.masterChef,
          name: 'pendingCake',
          params: [vaults[index].farm.pid, account],
        },
      ];
  const _masterchefABI = chainKey === CHAINKEY.SDN ? masterchefSdnABI : masterchefABI;
  const rawEarnings = await multicall(_masterchefABI, calls);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};

export const fetchVaultsUsers = async (account: string, vaults: IVault[], index?: number) => {
  const calls01 = !haveNumber(index)
    ? vaults.map((vault: IVault) => {
        return {
          address: vault.contractAddress[chainId],
          name: 'balanceOf',
          params: [account],
        };
      })
    : [
        {
          address: vaults[index].contractAddress[chainId],
          name: 'balanceOf',
          params: [account],
        },
      ];
  const calls02 = !haveNumber(index)
    ? vaults.map((vault: IVault) => {
        return {
          address: vault.contractAddress[chainId],
          name: 'totalSupply',
        };
      })
    : [
        {
          address: vaults[index].contractAddress[chainId],
          name: 'totalSupply',
        },
      ];
  const calls03 = !haveNumber(index)
    ? vaults.map((vault: IVault) => {
        return {
          address: vault.contractAddress[chainId],
          name: 'wantLockedTotal',
        };
      })
    : [
        {
          address: vaults[index].contractAddress[chainId],
          name: 'wantLockedTotal',
        },
      ];

  if (calls01.length && calls02.length) {
    const rawEarnings01 = await multicall(AVaultPCS_ABI, calls01);
    const rawEarnings02 = await multicall(AVaultPCS_ABI, calls02);
    const rawEarnings03 = await multicall(AVaultPCS_ABI, calls03);
    const parsedEarnings = rawEarnings01.map((balances) => {
      return new BigNumber(balances).toJSON();
    });
    const vaultTotalSupply = rawEarnings02.map((balances) => {
      return balances ? balances[0].toString() : null;
    });
    const vaultWantLockedTotal = rawEarnings03.map((balances) => {
      return balances ? balances[0].toString() : null;
    });

    return [parsedEarnings, vaultTotalSupply, vaultWantLockedTotal];
  }
};
