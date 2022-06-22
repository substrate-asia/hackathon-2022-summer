import { useCallback } from 'react';
import { stakeFarm } from 'utils/calls';
import { useSpecialMasterchef } from 'hooks/useContract';
const useStakeFarms = (abi: any, masterChefAddress: string, pid: number) => {
  const masterChefContract = useSpecialMasterchef(abi, masterChefAddress);

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeFarm(masterChefContract, pid, amount);
      console.info(txHash);
    },
    [masterChefContract, pid],
  );
  // const handleStake = useCallback(
  //   async (amount: string, deadline: number, v: number, r: string, s: string) => {
  //     const txHash = await depositWithPermit(masterChefContract, pid, amount, deadline, v, r, s);
  //     console.info(txHash);
  //   },
  //   [masterChefContract, pid],
  // );

  return { onStake: handleStake };
};

export default useStakeFarms;
