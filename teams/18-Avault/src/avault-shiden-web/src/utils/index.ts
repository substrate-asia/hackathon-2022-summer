import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { JSBI, Percent, Token, CurrencyAmount, Currency, ETHER, CHAINKEY } from '@my/sdk';
import { ROUTER_ADDRESS } from '../config/constants';
import { BASE_BSC_SCAN_URL, chainKey } from '../config';
import { TokenAddressMap } from '../state/lists/hooks';
import { chainId as myChainId } from 'config/constants/tokens';
import { WEEKTimeStamp } from 'views/Governance/constants/constants';
export function sortName(name: string) {
  if (name && name.length > 5) {
    return `${name.slice(0, 5)}...${name.slice(name.length - 4, name.length)}`;
  }
  return name;
}
export const getImageUrlFromToken = (token: any) => {
  if (typeof token === 'string') {
    return `/images/tokens/${chainKey}/${token.toLocaleLowerCase()}.svg`;
  }
  console.log('getImageUrlFromToken: ', token);
  if (typeof token.address === 'string') {
    return `/images/tokens/${chainKey}/${token.address.toLocaleLowerCase()}.svg`;
  }
  return `/images/tokens/${chainKey}/${token.address[myChainId].toLocaleLowerCase()}.svg`;
};
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
): string {
  switch (type) {
    case 'transaction': {
      if (chainKey === CHAINKEY.SDN) {
        return `${BASE_BSC_SCAN_URL}/extrinsic/${data}`;
      }
      return `${BASE_BSC_SCAN_URL}/tx/${data}`;
    }
    case 'token': {
      if (chainKey === CHAINKEY.SDN) {
        return `${BASE_BSC_SCAN_URL}/erc20_token/${data}`;
      }
      return `${BASE_BSC_SCAN_URL}/token/${data}`;
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URL}/block/${data}`;
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URL}/block/countdown/${data}`;
    }
    default: {
      if (chainKey === CHAINKEY.SDN) {
        return `${BASE_BSC_SCAN_URL}/erc20_token/${data}`;
      }
      return `${BASE_BSC_SCAN_URL}/address/${data}`;
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ];
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS[myChainId], IUniswapV2Router02ABI, library, account);
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER[myChainId]) return true;
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address]);
}

export const haveNumber = (num: number) => {
  return num || num === 0;
};

export const getTimeStamp = (time?: any) => {
  if (time) {
    return Math.ceil(new Date(time).valueOf() / 1000);
  }
  return Math.ceil(new Date().valueOf() / 1000);
};

export const getWeekTimeStamp = (time: number) => {
  // 2022-5-26 08:00:00
  return Math.floor(time / WEEKTimeStamp) * WEEKTimeStamp;
};

export function timestampToDate(timestamp: number) {
  const date1 = new Date(timestamp);
  const str = date1.toLocaleDateString().replace(/\//g, '-') + ' ' + date1.toTimeString().substring(0, 8);
  if (str === 'Invalid Date Invalid ') {
    return '';
  }
  return str;
}
