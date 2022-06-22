import { useCallback } from 'react';
import { useAVaultPCSContract } from 'hooks/useContract';
import BigNumber from 'bignumber.js';
import { BIG_TEN } from 'utils/bigNumber';
import { callWithEstimateGas } from 'utils/calls';
import { DEFAULT_GAS_LIMIT } from 'config';

const useVaultWithdraw = (account: string, contractAddress: string, decimal: number) => {
  const contractAddressContract = useAVaultPCSContract(contractAddress);

  const handleWithdraw = useCallback(
    async (amount: string) => {
      // const txHash =
      try {
        // const tx = await contract.withdraw(account, `${value}`, options);
        // const receipt = await tx.wait();
        // return receipt.status;

        const value = parseInt(new BigNumber(amount).times(BIG_TEN.pow(decimal)).toString());
        // const tx = await contract.withdraw(account, `${value}`, options);
        const res = await callWithEstimateGas(contractAddressContract, 'withdraw', [account, `${value}`], {
          gasLimit: DEFAULT_GAS_LIMIT,
        });
        if (res.isOk) {
          return true;
        } else {
          return res.message;
        }
        // return await withdrawVaultUtil(contractAddressContract, account, amount, decimal);
      } catch (e) {
        return false;
      }
    },
    [contractAddressContract, account, decimal],
  );

  return { onWithdraw: handleWithdraw };
};

export default useVaultWithdraw;
