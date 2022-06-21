import { useCallback } from 'react';
import { useAVaultPCSContract } from 'hooks/useContract';
import BigNumber from 'bignumber.js';
import { BIG_TEN } from 'utils/bigNumber';
import { callWithEstimateGas } from 'utils/calls';
import { DEFAULT_GAS_LIMIT } from 'config';
const useVaultDeposit = (account: string, contractAddress: string, decimal: number) => {
  const contractAddressContract = useAVaultPCSContract(contractAddress);

  const handleDeposit = useCallback(
    async (amount: string) => {
      // const txHash =
      // try {
      //   return await depositVaultUtil(contractAddressContract, account, amount, decimal);
      // } catch (e) {
      //   return false;
      // }
      const value = new BigNumber(amount).times(BIG_TEN.pow(decimal)).toString();
      const res = await callWithEstimateGas(contractAddressContract, 'deposit', [account, `${value}`], {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      if (res.isOk) {
        return true;
      } else {
        return res.message;
      }
    },
    [contractAddressContract, account, decimal],
  );

  return { onDeposit: handleDeposit };
};

export default useVaultDeposit;
