import { ChainId, Currency } from '@my/sdk';
export enum ITokenType {
  LP = 'LP',
  MAIN = 'MAIN',
  TOKEN = 'TOKEN',
}

export interface IToken extends Currency {
  type: ITokenType;
  symbol?: string;
  address?: {
    [ChainId.SDN_TESTNET]: string;
    [ChainId.SDN_MAINNET]: string;
  };
  decimals: number;
  token?: IToken;
  quoteToken?: IToken;
}
