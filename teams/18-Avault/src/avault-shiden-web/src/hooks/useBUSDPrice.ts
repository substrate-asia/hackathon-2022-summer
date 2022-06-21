import { Currency, currencyEquals, JSBI, Price, WETH } from '@my/sdk';
import { useMemo } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BUSD, chainId as myChainId, Kaco } from '../config/constants/tokens';
import { PairState, usePairs } from './usePairs';
import { wrappedCurrency } from '../utils/wrappedCurrency';
import { ChainId } from '@my/sdk';

const BUSD_MAINNET = BUSD[myChainId];

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React();
  const wrapped = wrappedCurrency(currency, myChainId);
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WETH[myChainId], wrapped) ? undefined : currency,
        chainId ? WETH[myChainId] : undefined,
      ],
      [wrapped?.equals(BUSD_MAINNET) ? undefined : wrapped, chainId === ChainId.BSC_MAINNET ? BUSD_MAINNET : undefined],
      [chainId ? WETH[myChainId] : undefined, chainId === ChainId.ASTR_MAINNET ? BUSD_MAINNET : undefined],
    ],
    [chainId, currency, wrapped],
  );
  const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs);

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined;
    }
    // handle weth/eth
    if (wrapped.equals(WETH[myChainId])) {
      if (busdPair) {
        const price = busdPair.priceOf(WETH[myChainId]);
        return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator);
      }
      return undefined;
    }
    // handle busd
    if (wrapped.equals(BUSD_MAINNET)) {
      return new Price(BUSD_MAINNET, BUSD_MAINNET, '1', '1');
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH[myChainId]);
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount && busdEthPair
        ? busdEthPair.priceOf(WETH[myChainId]).quote(ethPairETHAmount, myChainId).raw
        : JSBI.BigInt(0);

    // all other tokens
    // first try the busd pair
    if (
      busdPairState === PairState.EXISTS &&
      busdPair &&
      busdPair.reserveOf(BUSD_MAINNET).greaterThan(ethPairETHBUSDValue)
    ) {
      const price = busdPair.priceOf(wrapped);
      return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator);
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busdEthPair.reserveOf(BUSD_MAINNET).greaterThan('0') && ethPair.reserveOf(WETH[myChainId]).greaterThan('0')) {
        const ethBusdPrice = busdEthPair.priceOf(BUSD_MAINNET);
        const currencyEthPrice = ethPair.priceOf(WETH[myChainId]);
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert();
        return new Price(currency, BUSD_MAINNET, busdPrice.denominator, busdPrice.numerator);
      }
    }
    return undefined;
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped]);
}

export const useCakeBusdPrice = (): Price | undefined => {
  const cakeBusdPrice = useBUSDPrice(Kaco);
  return cakeBusdPrice;
};
