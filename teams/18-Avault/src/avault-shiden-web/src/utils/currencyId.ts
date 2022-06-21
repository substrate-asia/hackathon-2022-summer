import { Currency, ETHER, Token } from '@my/sdk';
import { chainId } from 'config/constants/tokens';

export function currencyId(currency: Currency): string {
  if (currency === ETHER[chainId]) return 'BNB';
  if (currency instanceof Token) return currency.address;
  throw new Error('invalid currency');
}

export default currencyId;
