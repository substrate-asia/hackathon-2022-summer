import { CHAINKEY } from '@my/sdk';
import { chainKey } from 'config';
import { chainId, main_tokens } from 'config/constants/tokens';
import { Dispatch, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePrice } from 'state/price/hooks';
import { State } from 'state/types';
import { AVATdonation, idoContractAddress } from 'views/Ido/constants/constants';
import { fetchIdoAsync, updateState } from './state';
import { IIdoState } from './types';
import { Web3Provider } from '@ethersproject/providers';
import { sendTransaction } from 'utils/contractHelpers';
import { useIdoContract } from './fetchIdo';
import { callWithEstimateGas } from 'utils/calls';
export const useInitIdo = (account: string, library: Web3Provider, dispatch: Dispatch<any>, accountkey: string) => {
  useMainTokenPrice(dispatch);
  useUpdateAvatEstimatedPrice(dispatch);
  useEffect(() => {
    if (dispatch) {
      dispatch(fetchIdoAsync({ account, library, accountkey }));
    }
  }, [dispatch, account, accountkey, library]);
};
const useMainTokenPrice = (dispatch: Dispatch<any>) => {
  const { priceVsBusdMap } = usePrice();
  return useMemo(() => {
    if (priceVsBusdMap && dispatch) {
      const mainTokenKey = chainKey === CHAINKEY.SDN ? 'sdn' : 'astr';
      const mainTokenAddress = main_tokens[mainTokenKey].address[chainId].toLowerCase();
      if (priceVsBusdMap[mainTokenAddress]) {
        dispatch(updateState({ mainTokenPrice: priceVsBusdMap[mainTokenAddress] }));
      }
    }
  }, [priceVsBusdMap, dispatch]);
};
const useUpdateAvatEstimatedPrice = (dispatch: Dispatch<any>) => {
  const { countedAstrAmount, mainTokenPrice } = useIdoData();
  useMemo(() => {
    const countedAstrAmountNumber = Number(countedAstrAmount);
    const mainTokenPriceNumber = Number(mainTokenPrice);

    if (countedAstrAmountNumber) {
      dispatch(
        updateState({
          avatEstimatedPrice: (((countedAstrAmountNumber * 0.5) / AVATdonation) * mainTokenPriceNumber).toLocaleString(
            'en-US',
            {
              maximumFractionDigits: 6,
              minimumFractionDigits: 2,
            },
          ),
        }),
      );
    }
  }, [dispatch, countedAstrAmount, mainTokenPrice]);
};
export const useIdoFun = (account: string, library: Web3Provider) => {
  const idoContract = useIdoContract();
  const transfer = useCallback(
    async (amount: string) => {
      // 0x98F579252b517BAeA1eF2317cee6287652A5F07B
      // idoContractAddress
      // amount=>0.000000000001
      const res = await sendTransaction(library, account, amount, idoContractAddress);
      if (res.isOk) {
        return true;
      } else {
        return res.message;
      }
    },
    [library, account],
  );
  const abort = useCallback(async () => {
    const res = await callWithEstimateGas(idoContract, 'abort');
    if (res.isOk) {
      return true;
    } else {
      return res.message;
    }
  }, [idoContract]);
  const withrawUncountedAstr = useCallback(async () => {
    const res = await callWithEstimateGas(idoContract, 'withrawUncountedAstr');
    if (res.isOk) {
      return true;
    } else {
      return res.message;
    }
  }, [idoContract]);
  return {
    transfer,
    abort, // take lp
    withrawUncountedAstr, //  claim
  };
};

export const useIdoData = (): IIdoState => {
  const idoData = useSelector((state: State) => state.ido);
  return idoData;
};
