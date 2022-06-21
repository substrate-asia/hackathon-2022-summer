import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'state';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { BIG_ZERO } from 'utils/bigNumber';
import { getBalanceAmount } from 'utils/formatBalance';
import { farmsConfig } from 'config/constants';
import useRefresh from 'hooks/useRefresh';
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync, nonArchivedFarms } from '.';
import { State, Farm, FarmsState } from '../types';
import { BUSD_BNB_LP_PID, KACO_BNB_LP_PID } from 'config/constants/farms';
import { usePrice } from 'state/price/hooks';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import tokens from 'config/constants/tokens';
import { chainKey } from 'config';
import { useVaultData } from 'state/vault/hooks';
export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  const { account } = useWeb3React();
  const { priceVsBusdMap } = usePrice();
  const vaultData = useVaultData();
  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms;
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid);
    dispatch(fetchFarmsPublicDataAsync({ pids: pids, priceVsBusdMap: priceVsBusdMap, vaultData: vaultData }));
    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }));
    }
  }, [includeArchive, dispatch, vaultData, slowRefresh, account, priceVsBusdMap]);
};
export const useFarmsAllTotal = () => {
  const farms = useSelector((state: State) => state.farms);
  return farms.tvlTotal;
};
/**
 * Fetches the "core" farm data used globally
 * 1 = CAKE-BNB LP
 * 2 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch();

  const { fastRefresh } = useRefresh();
  const { priceVsBusdMap } = usePrice();

  const vaultData = useVaultData();
  useEffect(() => {
    dispatch(
      fetchFarmsPublicDataAsync({
        pids: [KACO_BNB_LP_PID, BUSD_BNB_LP_PID],
        priceVsBusdMap: priceVsBusdMap,
        vaultData,
      }),
    );
  }, [dispatch, fastRefresh, vaultData, priceVsBusdMap]);
};

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid));
  return farm;
};

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol));
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  };
};

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid);
  return farm && new BigNumber(farm.token.busdPrice);
};

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol);
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid);

  let lpTokenPrice = BIG_ZERO;

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal);
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply));
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);
  }

  return lpTokenPrice;
};

// /!\ Deprecated , use the BUSD hook in /hooks

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(BUSD_BNB_LP_PID);
  return new BigNumber(bnbBusdFarm.quoteToken.busdPrice);
};

export const usePriceCakeBusd = (): BigNumber => {
  const { priceVsBusdMap } = usePrice();
  const { chainId } = useActiveWeb3React();
  const kacoPrice = useMemo(
    () => priceVsBusdMap[tokens[chainKey].kaco.address[chainId].toLowerCase()] || new BigNumber(0),
    [priceVsBusdMap, chainId],
  );
  return new BigNumber(kacoPrice);
};
