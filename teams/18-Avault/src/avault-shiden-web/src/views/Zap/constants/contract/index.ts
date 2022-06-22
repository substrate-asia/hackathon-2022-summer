import BigNumber from 'bignumber.js';
import { chainId, main_tokens } from 'config/constants/tokens';
import { Contract, ethers } from 'ethers';
import { useContract, useWETHContract } from 'hooks/useContract';
import { useCallback, useEffect, useState } from 'react';
import { BIG_TEN } from 'utils/bigNumber';
import { callWithEstimateGas } from 'utils/calls';
import multicall from 'utils/multicall';
import { IToken, ITokenType } from 'views/Zap/utils/types';
import zapAbi from './zapAbi.json';
import erc20 from 'config/abi/erc20.json';
import { chainKey } from 'config';

export const zapAddress = '0x5Af88505CF2cE57bb5e36816d7853A221F6Fc981';

function useZapContractFn(zapAddress: string): Contract | null {
  return useContract(zapAddress, zapAbi);
}

const useZapContract = (zapAddress: string, fromCurrency: IToken, toCurrency: IToken) => {
  const contract = useZapContractFn(zapAddress);
  const wethContract = useWETHContract();
  const handleZapClick = useCallback(
    async (val: string, account: string) => {
      let res = null;
      try {
        const value = parseInt(new BigNumber(val).times(BIG_TEN.pow(fromCurrency.decimals)).toString());
        if (
          fromCurrency.type === ITokenType.TOKEN &&
          (toCurrency.type === ITokenType.LP || toCurrency.type === ITokenType.TOKEN)
        ) {
          // ERC20 -> LP
          // ERC20 -> ERC20
          res = await callWithEstimateGas(contract, 'zapInToken', [
            fromCurrency.address[chainId],
            `${value}`,
            toCurrency.address[chainId],
          ]);
        } else if (
          fromCurrency.type === ITokenType.MAIN &&
          (toCurrency.type === ITokenType.LP || toCurrency.type === ITokenType.TOKEN)
        ) {
          // ETH -> LP
          // ETH -> ERC20
          // SDN -> WSDN
          if (
            toCurrency.address[chainId].toLowerCase() ===
            main_tokens[chainKey.toLowerCase()].address[chainId].toLowerCase()
          ) {
            res = await callWithEstimateGas(wethContract, 'deposit', [], { value: `${value}` });
          } else {
            res = await callWithEstimateGas(contract, 'zapIn', [toCurrency.address[chainId]], {
              value: `${value}`,
              from: account,
            });
          }
        } else if (
          (fromCurrency.type === ITokenType.LP || fromCurrency.type === ITokenType.TOKEN) &&
          (toCurrency.type === ITokenType.TOKEN || toCurrency.type === ITokenType.MAIN)
        ) {
          // LP -> ERC20
          // ERC20 -> ETH
          // WSDN -> SDN
          if (
            toCurrency.type === ITokenType.MAIN &&
            fromCurrency.address[chainId].toLowerCase() ===
              main_tokens[chainKey.toLowerCase()].address[chainId].toLowerCase()
          ) {
            res = await callWithEstimateGas(wethContract, 'withdraw', [`${value}`]);
          } else {
            res = await callWithEstimateGas(contract, 'zapOut', [fromCurrency.address[chainId], `${value}`]);
          }
        }
        if (res && res.isOk) {
          return true;
        } else {
          return res.message;
        }
      } catch (e) {
        return false;
      }
    },
    [contract, fromCurrency, wethContract, toCurrency],
  );
  return {
    handleZapClick,
  };
};

export const useHandleApproved = (fromCurrency: IToken, account: string, approvedAddress: string) => {
  const address =
    fromCurrency.type === ITokenType.MAIN
      ? main_tokens[chainKey.toLowerCase()].address[chainId]
      : fromCurrency.address[chainId];
  const contract = useContract(address, erc20, true);
  const fetchApprove = useCallback(async () => {
    if (!account) {
      return;
    }
    const res = await callWithEstimateGas(contract, 'approve', [approvedAddress, ethers.constants.MaxUint256]);
    if (res.isOk) {
      return true;
    } else {
      return res.message;
    }
  }, [approvedAddress, contract, account]);
  return { fetchApprove };
};

export const useApprove = (
  isLoaded: boolean,
  setPendingTx: any,
  fromCurrency: IToken,
  toCurrency: IToken,
  account: string,
  approvedAddress: string,
) => {
  const [isApprove, setIsApprove] = useState(false);
  useEffect(() => {
    // contractAddress, approvedAddress
    if (!account) {
      return;
    }
    // setPendingTx(true);
    if (fromCurrency.address && fromCurrency.address[chainId]) {
      if (
        toCurrency.type === ITokenType.MAIN &&
        fromCurrency.address[chainId].toLowerCase() ===
          main_tokens[chainKey.toLowerCase()].address[chainId].toLowerCase()
      ) {
        setIsApprove(true);
        return;
      }
      const calls = [
        {
          address: fromCurrency.address[chainId],
          name: 'allowance',
          params: [account, approvedAddress],
        },
      ];
      getApprove(calls, setIsApprove, setPendingTx);
    } else {
      // setPendingTx(false);
      setIsApprove(fromCurrency.type === ITokenType.MAIN ? true : false);
    }
  }, [isLoaded, toCurrency, setPendingTx, account, approvedAddress, fromCurrency]);
  return isApprove;
};

const getApprove = async (calls: any, setIsApprove: any, setPendingTx: any) => {
  setPendingTx(true);
  const [allowance] = await multicall(erc20, calls);
  setIsApprove(new BigNumber(allowance).toString() !== '0');
  setPendingTx(false);
};
export default useZapContract;
