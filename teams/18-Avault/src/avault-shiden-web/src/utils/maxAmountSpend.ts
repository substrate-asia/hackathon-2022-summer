import { CurrencyAmount, ETHER, JSBI } from '@my/sdk';
import { chainId } from 'config/constants/tokens';
import { MIN_BNB } from '../config/constants';

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined;
  if (currencyAmount.currency === ETHER[chainId]) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_BNB)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_BNB), chainId);
    }
    return CurrencyAmount.ether(JSBI.BigInt(0), chainId);
  }
  return currencyAmount;
}

export default maxAmountSpend;
