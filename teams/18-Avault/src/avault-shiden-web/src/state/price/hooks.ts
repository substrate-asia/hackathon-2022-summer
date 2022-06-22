import { useSelector } from 'react-redux';
import { setPrice } from '.';
import { State } from '../types';
import { useCurrency } from 'hooks/Tokens';
import { tryParseAmount } from 'state/swap/hooks';
import { Currency, CurrencyAmount } from '@my/sdk';
import { BUSD, chainId } from 'config/constants/tokens';

import { useAppDispatch } from 'state';
import DEFAULT_TOKEN_LIST from 'config/constants/tokenLists/pancake-default.tokenlist.json';
import { useEffect } from 'react';
import { useTradeExactIn } from 'hooks/Trades';
import { chainKey } from 'config';
export const usePollPrice = (_address: string, amount = '1') => {
  const address = _address.toLocaleLowerCase();
  const dispatch = useAppDispatch();
  const tokenArr = DEFAULT_TOKEN_LIST[chainKey].tokens.filter((v) => v.address.toLocaleLowerCase() === address);
  const token = tokenArr[0];
  const inputCurrency = useCurrency(token?.address);
  const currencyIn: CurrencyAmount = tryParseAmount(amount, inputCurrency);
  const currencyOut: Currency = BUSD[chainId];
  const bestTradeExactIn = useTradeExactIn(false, currencyIn, currencyOut);
  const { priceVsBusdMap } = usePrice();

  useEffect(() => {
    if (priceVsBusdMap[address] && amount === '1') {
      return null;
    }
    if (bestTradeExactIn && bestTradeExactIn.executionPrice) {
      dispatch(setPrice({ address: address, num: bestTradeExactIn.executionPrice.toFixed() }));
    }
  }, [dispatch, address, bestTradeExactIn, amount, bestTradeExactIn?.executionPrice, priceVsBusdMap]);
};
export const usePrice = () => {
  return useSelector((state: State) => state.price);
};
