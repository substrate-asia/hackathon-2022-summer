import { useCallback } from 'react';
import { ethers, Contract } from 'ethers';
import { useSpecialMasterchef } from 'hooks/useContract';
const useApproveFarm = (abi: any, masterChefAddress: string, lpContract: Contract) => {
  const masterChefContract = useSpecialMasterchef(abi, masterChefAddress);
  const handleApprove = useCallback(async () => {
    try {
      const tx = await lpContract.approve(masterChefContract.address, ethers.constants.MaxUint256);
      const receipt = await tx.wait();
      return receipt.status;
    } catch (e) {
      return false;
    }
  }, [lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

export default useApproveFarm;
