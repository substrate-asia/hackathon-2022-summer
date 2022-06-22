import { JSBI, Percent, Token, ChainId } from '@my/sdk';
import { BUSD, DAI, USDT, BTCB, Kaco, Base_Token, USDC, JPYC, DOT, KSM, ETH, ALPACA, CAKE, chainId } from './tokens';

export const ROUTER_ADDRESS = {
  [ChainId.ASTR_MAINNET]: '0xa5e48a6E56e164907263e901B98D9b11CCB46C47',
  [ChainId.SDN_MAINNET]: '0x72e86269b919Db5bDbF61cB1DeCfD6d14feC4D7F',
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};
// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ASTR_MAINNET]: [
    Base_Token,
    Kaco,
    // DOT[chainId],
    // KSM[chainId],
    // BUSD[chainId],
    // USDT,
    // BTCB[chainId],
    // UST[chainId],
    // ETH[chainId],
    USDC,
  ],
  [ChainId.ASTR_TESTNET]: [Base_Token, ETH[chainId], Kaco, BUSD[ChainId.BSC_TESTNET]],

  [ChainId.SDN_MAINNET]: [
    Base_Token,
    // Kaco,
    // DOT[chainId],
    // KSM[chainId],
    // BUSD[chainId],
    // USDT,
    // BTCB[chainId],
    // UST[chainId],
    ETH[chainId],
    USDC,
  ],
  [ChainId.SDN_TESTNET]: [Base_Token, ETH[chainId], Kaco, BUSD[ChainId.BSC_TESTNET]],

  [ChainId.BSC_MAINNET]: [
    Base_Token,
    ETH[chainId],
    Kaco,
    DOT[chainId],
    KSM[chainId],
    BUSD[chainId],
    USDT,
    ALPACA[chainId],

    // BTCB[chainId],
    // USDC,
  ],
  [ChainId.BSC_TESTNET]: [ETH[chainId], Kaco, BUSD[ChainId.BSC_TESTNET]],
};

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC_MAINNET]: {},
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.BSC_MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC_MAINNET]: {},
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ASTR_MAINNET]: [BUSD[ChainId.ASTR_MAINNET], Kaco, BTCB[ChainId.ASTR_MAINNET]],
  [ChainId.ASTR_TESTNET]: [ETH[chainId], Kaco, BUSD[ChainId.ASTR_TESTNET]],

  [ChainId.SDN_MAINNET]: [BUSD[ChainId.SDN_MAINNET], Kaco, BTCB[ChainId.SDN_MAINNET]],
  [ChainId.SDN_TESTNET]: [ETH[chainId], Kaco, BUSD[ChainId.SDN_TESTNET]],

  [ChainId.BSC_MAINNET]: [BUSD[ChainId.BSC_MAINNET], Kaco, BTCB[ChainId.BSC_MAINNET]],
  [ChainId.BSC_TESTNET]: [ETH[chainId], Kaco, BUSD[ChainId.BSC_TESTNET]],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ASTR_MAINNET]: [
    ETH[chainId],
    // DAI,
    // BUSD[chainId],
    Base_Token,
    USDT,
    // JPYC,
    USDC,
  ],
  [ChainId.ASTR_TESTNET]: [ETH[chainId], Kaco, BUSD[ChainId.BSC_TESTNET]],

  [ChainId.SDN_MAINNET]: [
    ETH[chainId],
    // DAI,
    // BUSD[chainId],
    Base_Token,
    // USDT,
    JPYC,
    USDC,
  ],
  [ChainId.SDN_TESTNET]: [ETH[chainId], Kaco, BUSD[ChainId.BSC_TESTNET]],

  [ChainId.BSC_MAINNET]: [
    // WETH[chainId],
    // DAI,
    ALPACA[chainId],
    CAKE[chainId],
    Kaco,
    DOT[chainId],
    BUSD[chainId],
    USDT,
  ],
  [ChainId.BSC_TESTNET]: [ETH[chainId], Kaco, BUSD[ChainId.BSC_TESTNET]],
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC_MAINNET]: [
    [Kaco, Base_Token],
    [BUSD[chainId], USDT],
    [DAI, USDT],
  ],
};

export const NetworkContextName = 'NETWORK';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));

export const ZERO_PERCENT = new Percent('0');
export const ONE_HUNDRED_PERCENT = new Percent('1');

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
];
export const FACTORY_ADDRESS = {
  [ChainId.SDN_MAINNET]: '0xcd8620889c1dA22ED228e6C00182177f9dAd16b7',
  [ChainId.SDN_TESTNET]: '0xcd8620889c1dA22ED228e6C00182177f9dAd16b7',

  [ChainId.ASTR_MAINNET]: '0x72e86269b919Db5bDbF61cB1DeCfD6d14feC4D7F',
  [ChainId.ASTR_TESTNET]: '0x72e86269b919Db5bDbF61cB1DeCfD6d14feC4D7F',

  [ChainId.BSC_TESTNET]: '0xa5e48a6E56e164907263e901B98D9b11CCB46C47',
  [ChainId.BSC_MAINNET]: '0xa5e48a6E56e164907263e901B98D9b11CCB46C47',
};

export { default as farmsConfig } from './farms';
export { default as poolsConfig } from './pools';
export { default as ifosConfig } from './ifo';
