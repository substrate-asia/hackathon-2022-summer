import BigNumber from 'bignumber.js';
import { chainKey } from 'config';
import { chainId, main_tokens } from 'config/constants/tokens';
import { useEffect, useMemo, useState } from 'react';
import { usePrice } from 'state/price/hooks';
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber';
import { IToken } from './types';
import erc20 from 'config/abi/erc20.json';
import multicall from 'utils/multicall';
import { getBalanceAmount } from 'utils/formatBalance';
import { showDecimals } from 'views/Vault/utils';
import { IVault } from 'state/vault/types';

export const isCurrencyEquals = (selectedCurrency: IToken, currency: IToken) => {
  if (!selectedCurrency.address && !currency.address) {
    return true;
  }
  if (selectedCurrency.address && currency.address) {
    if (selectedCurrency.address[chainId].toLowerCase() === currency.address[chainId].toLowerCase()) {
      return true;
    }
  }
  return false;
};

export function currencyKey(currency: IToken, index: number): string {
  // console.log(currency);
  return !currency.address || !currency.address[chainId] ? 'ETHER' + index : currency.address[chainId] + index ?? '';
}

export function deweight(comeArr: IToken[]) {
  const map = new Map();
  for (const i of comeArr) {
    if (!map.has(i.symbol.toLocaleLowerCase())) {
      map.set(i.symbol.toLocaleLowerCase(), i);
    }
  }

  return [...map.values()];
}

export function useZapSortedTokensByQuery(tokens: IToken[] | undefined, searchQuery: string): IToken[] {
  return useMemo(() => {
    if (!tokens) {
      return [];
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);

    if (symbolMatch.length > 1) {
      return tokens;
    }

    const symbolSubtrings: IToken[] = [];

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase().indexOf(searchQuery.toLowerCase().trim()) > -1) {
        return symbolSubtrings.push(token);
      }
      return null;
    });

    return symbolSubtrings;
  }, [tokens, searchQuery]);
}

export const useEstimatedPrice = (value: string, fromCurrency: IToken, toCurrency: IToken, val: BigNumber) => {
  const { priceVsBusdMap } = usePrice();
  const [amount, setAmount] = useState('0');
  const [valPre, setAmountPre] = useState(BIG_ZERO);
  useEffect(() => {
    if (value === '' && amount !== '0') {
      setAmount('0');
      return;
    }
    (async () => {
      if (val && val.gt(0) && valPre.toNumber() !== val.toNumber()) {
        setAmountPre(val);
        const fromCurrencyAddress = fromCurrency.address
          ? fromCurrency.address[chainId].toLowerCase()
          : main_tokens[chainKey.toLocaleLowerCase()].address[chainId].toLowerCase();
        const toCurrencyAddress = toCurrency.address
          ? toCurrency.address[chainId].toLowerCase()
          : main_tokens[chainKey.toLocaleLowerCase()].address[chainId].toLowerCase();

        // 1u => fromCurrency Amount
        const fromCurrencyVsBusd = priceVsBusdMap[fromCurrencyAddress];
        // 1u => toCurrency Amount
        let toCurrencyVsBusd = priceVsBusdMap[toCurrencyAddress];
        console.log('priceVsBusdMap---', priceVsBusdMap, toCurrencyAddress);
        if (toCurrency.symbol.indexOf(' LP') > 0) {
          const token = toCurrency.token.address[chainId].toLowerCase();
          const tokenDecimals = toCurrency.token.decimals;
          toCurrencyVsBusd = await getLpAddreeTotalSupply(token, tokenDecimals, priceVsBusdMap, toCurrencyAddress);
        }
        // 1 from -> to
        const vs = new BigNumber(fromCurrencyVsBusd).div(toCurrencyVsBusd);
        // console.log(vs.toNumber());
        const toAmount = vs.times(val).times(0.98);
        // console.log(
        //   priceVsBusdMap,
        //   'fromCurrencyVsBusd: ',
        //   fromCurrencyVsBusd,
        //   'toCurrencyVsBusd:',
        //   toCurrencyVsBusd,
        //   'toAmount:',
        //   toAmount.toNumber(),
        // );
        setAmount(
          toAmount.toString(2) === 'NaN' || !toAmount.gt(0)
            ? '0'
            : '≈' +
                Number(toAmount.toFixed(showDecimals(toCurrency.symbol), BigNumber.ROUND_DOWN)).toLocaleString(
                  'en-US',
                  {
                    maximumFractionDigits: showDecimals(toCurrency.symbol),
                  },
                ),
        );
      }
    })();
    // eslint-disable-next-line
  }, [value, toCurrency, val]);
  return amount;
};

export const getLpAddreeTotalSupply = async (
  token: string,
  tokenDecimals: number,
  priceVsBusdMap: Record<string, string>,
  lpAddress: string,
): Promise<string> => {
  const calls = [
    {
      address: token,
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: lpAddress,
      name: 'totalSupply',
    },
  ];
  const [tokenBalanceLP, lpTotalSupply] = await multicall(erc20, calls);

  let lpTokenPrice = BIG_ZERO;
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
  if (lpTotalSupply && priceVsBusdMap[token]) {
    const farmTokenPriceInUsd = priceVsBusdMap[token];
    const valueOfBaseTokenInFarm = new BigNumber(farmTokenPriceInUsd).times(tokenAmountTotal);
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
    const totalLpTokens = getBalanceAmount(new BigNumber(lpTotalSupply));
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);
  }
  return lpTokenPrice.toString();
};
export const getAultPrice = async (
  token: string,
  tokenDecimals: number,
  priceVsBusdMap: Record<string, string>,
  lpAddress: string,
  contractAddress: string,
  vaultData: IVault[],
): Promise<string> => {
  const _lpPrice = await getLpAddreeTotalSupply(token, tokenDecimals, priceVsBusdMap, lpAddress);
  const vault = vaultData.filter((v) => v.contractAddress[chainId].toLowerCase() === contractAddress);
  let lpToCLpRate = '1';
  if (vault) {
    const _valut = vault[0];
    lpToCLpRate = _valut.vault.lpToCLpRate;
  }

  return new BigNumber(_lpPrice).times(new BigNumber(lpToCLpRate)).toFixed(8);
};
