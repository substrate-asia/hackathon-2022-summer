import { ethers } from 'ethers';
import { IDappStakingInterface } from 'utils/types';

export const UseStakeDApp = async (contract: IDappStakingInterface, account: string, value = '0') => {
  // console.log(contract.depositFor);
  const tx = await contract.depositFor(account, {
    value: ethers.utils.parseEther(value),
    gasLimit: 380000,
  });
  if (tx) {
    const receipt = await tx.wait();
    return receipt.status;
  }
};
