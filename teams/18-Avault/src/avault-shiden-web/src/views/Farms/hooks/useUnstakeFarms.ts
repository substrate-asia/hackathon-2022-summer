import { useCallback } from 'react';
import { unstakeFarm } from 'utils/calls';
import { useSpecialMasterchef } from 'hooks/useContract';

const useUnstakeFarms = (abi: any, masterChefAddress: string, pid: number) => {
  const masterChefContract = useSpecialMasterchef(abi, masterChefAddress);

  const handleUnstake = useCallback(
    async (amount: string) => {
      await unstakeFarm(masterChefContract, pid, amount);
    },
    [masterChefContract, pid],
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakeFarms;
