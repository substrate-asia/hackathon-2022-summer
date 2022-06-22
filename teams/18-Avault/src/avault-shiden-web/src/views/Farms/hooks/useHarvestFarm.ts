import { useCallback } from 'react';
import { harvestFarm } from 'utils/calls';
import { useSpecialMasterchef } from 'hooks/useContract';

const useHarvestFarm = (abi: any, masterChefAddress: string, farmPid: number) => {
  const masterChefContract = useSpecialMasterchef(abi, masterChefAddress);

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterChefContract, farmPid);
  }, [farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};

export default useHarvestFarm;
