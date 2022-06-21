import { ethers } from 'ethers';
import { useAAVTContract } from 'hooks/useContract';
import { Dispatch, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { State } from 'state/types';
import { callWithEstimateGas } from 'utils/calls';
import { veAVAT } from 'views/Governance/constants/constants';
import { useGrassHouseContract } from './fetchGrassHouse';
import { useVeAVATAddressContract } from './fetchVeAVAT';
import { fetchGrassHouseListDataAsync, fetchUserDataAsync } from './index';
import { GovernanceState, IGrassHouse, ILockedState } from './types';

export const useInit = (account: string, dispatch: Dispatch<any>, grassHouseList: IGrassHouse[]) => {
  useEffect(() => {
    if (dispatch && grassHouseList) {
      dispatch(fetchGrassHouseListDataAsync({ grassHouseList, account }));
    }
    if (!dispatch || !account) {
      return;
    }
    dispatch(fetchUserDataAsync({ account }));
    // eslint-disable-next-line
  }, [dispatch, account]);
};

export const useVeAVATFun = () => {
  const veAVATAddressContract = useVeAVATAddressContract();
  const AVATAddressContract = useAAVTContract();
  const approve = useCallback(async () => {
    const res = await callWithEstimateGas(AVATAddressContract, 'approve', [
      veAVAT.address,
      ethers.constants.MaxUint256,
    ]);
    if (res.isOk) {
      return true;
    } else {
      return res.message;
    }
  }, [AVATAddressContract]);
  // createLock  创建新锁仓
  // increaseLockAmount 增加锁仓金额
  // increaseUnlockTime 增加锁仓时间
  // withdraw 到期提现
  const createLock = useCallback(
    async ({ amount, unlockTime }: { amount: string; unlockTime: string }) => {
      const res = await callWithEstimateGas(veAVATAddressContract, 'createLock', [amount, unlockTime]);
      if (res.isOk) {
        return true;
      } else {
        return res.message;
      }
    },

    [veAVATAddressContract],
  );
  const increaseLockAmount = useCallback(
    async ({ amount }: { amount: string }) => {
      const res = await callWithEstimateGas(veAVATAddressContract, 'increaseLockAmount', [amount]);
      if (res.isOk) {
        return true;
      } else {
        return res.message;
      }
    },
    [veAVATAddressContract],
  );
  const increaseUnlockTime = useCallback(
    async ({ newUnlockTime }: { newUnlockTime: string }) => {
      const res = await callWithEstimateGas(veAVATAddressContract, 'increaseUnlockTime', [newUnlockTime]);
      if (res.isOk) {
        return true;
      } else {
        return res.message;
      }
    },
    [veAVATAddressContract],
  );

  const withdraw = useCallback(async () => {
    const res = await callWithEstimateGas(veAVATAddressContract, 'withdraw');
    if (res.isOk) {
      return true;
    } else {
      return res.message;
    }
  }, [veAVATAddressContract]);

  return {
    approve,
    createLock,
    increaseLockAmount,
    increaseUnlockTime,
    withdraw,
  };
};

export const useGrassHouseContractFun = (grassHouseAddress: string) => {
  const grassHouseContract = useGrassHouseContract(grassHouseAddress);
  const claim = useCallback(async () => {
    const res = await callWithEstimateGas(grassHouseContract, 'claim');
    if (res.isOk) {
      return true;
    } else {
      return res.message;
    }
  }, [grassHouseContract]);

  return {
    claim,
  };
};

// get data
export const useGovernanceData = (): GovernanceState => {
  const governanceData = useSelector((state: State) => state.governance);
  return governanceData;
};

export const useGovernancelockedState = (): ILockedState => {
  const lockedState = useSelector((state: State) => state.governance.lockedState);
  return lockedState;
};

export const useGovernanceAllTotal = () => {
  const governance = useSelector((state: State) => state.governance);
  return governance.tvlTotal;
};

export const useLockAVATModalState = () => {
  const governance = useSelector((state: State) => state.governance);
  return governance.lockAVATModalState;
};
