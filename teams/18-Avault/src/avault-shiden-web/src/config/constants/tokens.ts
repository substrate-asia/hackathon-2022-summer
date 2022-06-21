import { ChainId, CHAINKEY, Token } from '@my/sdk';
import { BASE_BSC_SCAN_URL, chainKey } from 'config';

export const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
export const tokens = {
  [CHAINKEY.SDN]: {
    wsdn: {
      symbol: 'WSDN',
      address: {
        [ChainId.SDN_MAINNET]: '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
        [ChainId.SDN_TESTNET]: '0x321F318e7C276c93Cf3094fd3a9d7c4362fd19FB',
      },
      decimals: 18,
      projectLink: 'https://shiden.astar.network/',
    },
    syrup: {
      symbol: 'SYRUP',
      address: {
        [ChainId.SDN_MAINNET]: '0x808764026aDddb9E7dFAAEA846977cCe6425D593',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://www.kaco.finance/',
    },
    kaco: {
      symbol: 'KAC',
      address: {
        [ChainId.SDN_MAINNET]: '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://kaco.finance/',
    },
    usdt: {
      symbol: 'USDT',
      address: {
        [ChainId.SDN_MAINNET]: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://tether.to/',
    },
    usdc: {
      symbol: 'USDC',
      address: {
        [ChainId.SDN_MAINNET]: '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 6,
      projectLink: 'https://www.centre.io/usdc',
    },
    dai: {
      symbol: 'DAI',
      address: {
        [ChainId.SDN_MAINNET]: '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://www.makerdao.com/',
    },
    eth: {
      symbol: 'ETH',
      address: {
        [ChainId.SDN_MAINNET]: '0x765277eebeca2e31912c9946eae1021199b39c61',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://ethereum.org/en/',
    },
    wbtc: {
      symbol: 'WBTC',
      address: {
        [ChainId.SDN_MAINNET]: '0x922d641a426dcffaef11680e5358f34d97d112e1',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://bitcoin.org/',
    },

    busd: {
      symbol: 'BUSD',
      address: {
        [ChainId.SDN_MAINNET]: '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://www.paxos.com/busd/',
    },
    jpyc: {
      symbol: 'JPYC',
      address: {
        [ChainId.SDN_MAINNET]: '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
        [ChainId.SDN_TESTNET]: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      },
      decimals: 18,
      projectLink: 'https://jpyc.jp/',
    },
  },
};
export const main_tokens = {
  astr: {
    symbol: 'ASTR',
    name: 'Astar',
    decimals: 18,
    address: {
      [ChainId.ASTR_MAINNET]: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
      [ChainId.ASTR_TESTNET]: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
    },
    projectLink: 'https://blockscout.com/astar/',
  },
  sdn: {
    symbol: 'WSDN',
    name: 'Shiden',
    decimals: 18,
    address: {
      [ChainId.SDN_MAINNET]: '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
      [ChainId.SDN_TESTNET]: '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
    },
    projectLink: 'https://blockscout.com/shiden/',
  },
  bnb: {
    symbol: 'BNB',
    name: 'BNB Token',
    address: {
      [ChainId.BSC_MAINNET]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      [ChainId.BSC_TESTNET]: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: 18,
    projectLink: 'https://www.binance.com/',
  },
  kaco: {
    name: 'Kaco Token',
    symbol: 'KAC',
    address: {
      [ChainId.ASTR_MAINNET]: '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c',
      [ChainId.ASTR_TESTNET]: '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c',
      [ChainId.SDN_MAINNET]: '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
      [ChainId.SDN_TESTNET]: '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
      [ChainId.BSC_MAINNET]: '0xf96429A7aE52dA7d07E60BE95A3ece8B042016fB',
      [ChainId.BSC_TESTNET]: '0x0bA819e30016Cf682C7795b44859148C65e62292',
    },
    decimals: 18,
    projectLink: BASE_BSC_SCAN_URL,
  },
  avat: {
    name: 'avat Token',
    symbol: 'AVAT',
    address: {
      [ChainId.ASTR_MAINNET]: '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c',
      [ChainId.ASTR_TESTNET]: '0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c',
      [ChainId.SDN_MAINNET]: '0xd7d505283A7cd9CBc4760e32d9c80b4Fc66dBDea',
      [ChainId.SDN_TESTNET]: '0xd7d505283A7cd9CBc4760e32d9c80b4Fc66dBDea',
      [ChainId.BSC_MAINNET]: '0xf96429A7aE52dA7d07E60BE95A3ece8B042016fB',
      [ChainId.BSC_TESTNET]: '0x0bA819e30016Cf682C7795b44859148C65e62292',
    },
    decimals: 18,
    projectLink: BASE_BSC_SCAN_URL,
  },
};

export const DEFAULT_Token = {
  [ChainId.BSC_MAINNET]: {
    address: main_tokens.bnb.address[ChainId.BSC_MAINNET],
    decimals: main_tokens.bnb.decimals,
    symbol: main_tokens.bnb.symbol,
    name: main_tokens.bnb.name,
  },
  [ChainId.BSC_TESTNET]: {
    address: main_tokens.bnb.address[ChainId.BSC_TESTNET],
    decimals: main_tokens.bnb.decimals,
    symbol: main_tokens.bnb.symbol,
    name: main_tokens.bnb.name,
  },
  [ChainId.ASTR_MAINNET]: {
    address: main_tokens.astr.address[ChainId.ASTR_MAINNET],
    decimals: main_tokens.astr.decimals,
    symbol: main_tokens.astr.symbol,
    name: main_tokens.astr.name,
  },
  [ChainId.SDN_MAINNET]: {
    address: main_tokens.sdn.address[ChainId.SDN_MAINNET],
    decimals: main_tokens.sdn.decimals,
    symbol: main_tokens.sdn.symbol,
    name: main_tokens.sdn.name,
  },
};
export const Base_Token: Token = new Token(
  chainId,
  DEFAULT_Token[chainId].address,
  DEFAULT_Token[chainId].decimals,
  DEFAULT_Token[chainId].symbol,
  DEFAULT_Token[chainId].name,
);

export const Kaco: Token = CHAINKEY.SDN
  ? new Token(chainId, main_tokens.kaco.address[chainId], 18, main_tokens.kaco.symbol, main_tokens.kaco.name)
  : null;

export const AVAT: Token = CHAINKEY.SDN
  ? new Token(chainId, main_tokens.avat.address[chainId], 18, main_tokens.avat.symbol, main_tokens.avat.name)
  : null;

export const BUSD: { [chainId: number]: Token } = {
  [ChainId.SDN_MAINNET]: new Token(
    ChainId.SDN_MAINNET as any,
    '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
    18,
    'BUSD',
    'Binance USD',
  ),
  [ChainId.SDN_TESTNET]: new Token(
    ChainId.SDN_TESTNET as any,
    '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
    18,
    'BUSD',
    'Binance USD',
  ),

  [ChainId.ASTR_MAINNET]: new Token(
    chainId,
    tokens[chainKey].usdc.address[chainId],
    tokens[chainKey].usdc.decimals,
    tokens[chainKey].usdc.symbol,
    'USD Coin',
  ),
  [ChainId.ASTR_TESTNET]: new Token(
    chainId,
    tokens[chainKey].usdc.address[chainId],
    tokens[chainKey].usdc.decimals,
    tokens[chainKey].usdc.symbol,
    'USD Coin',
  ),
};

export const DOT: { [chainId: number]: Token } = {
  [ChainId.ASTR_MAINNET]: new Token(
    ChainId.ASTR_MAINNET as any,
    '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    18,
    'DOT',
    'DOT Token',
  ),
  [ChainId.ASTR_TESTNET]: new Token(
    ChainId.ASTR_TESTNET as any,
    '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    18,
    'DOT',
    'DOT Token',
  ),
  [ChainId.SDN_MAINNET]: new Token(
    ChainId.SDN_MAINNET as any,
    '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    18,
    'DOT',
    'DOT Token',
  ),
  [ChainId.SDN_TESTNET]: new Token(
    ChainId.SDN_TESTNET as any,
    '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    18,
    'DOT',
    'DOT Token',
  ),
  [ChainId.BSC_MAINNET]: new Token(
    ChainId.BSC_MAINNET as any,
    '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    18,
    'DOT',
    'DOT Token',
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET as any,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'DOT',
    'FAKE DOT',
  ),
};

export const KSM: { [chainId: number]: Token } = {
  [ChainId.SDN_MAINNET]: new Token(
    ChainId.SDN_MAINNET as any,
    '0x2aa69e8d25c045b659787bc1f03ce47a388db6e8',
    18,
    'KSM',
    'KSM Token',
  ),
  [ChainId.SDN_TESTNET]: new Token(
    ChainId.SDN_TESTNET as any,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'KSM',
    'FAKE KSM',
  ),
  [ChainId.BSC_MAINNET]: new Token(
    ChainId.BSC_MAINNET as any,
    '0x2aa69e8d25c045b659787bc1f03ce47a388db6e8',
    18,
    'KSM',
    'KSM Token',
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET as any,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'KSM',
    'FAKE KSM',
  ),
};

export const DAI = new Token(
  ChainId.BSC_MAINNET as any,
  '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
  18,
  'DAI',
  'Dai Stablecoin',
);
export const USDT = new Token(
  chainId,
  tokens[chainKey].usdt.address[chainId],
  tokens[chainKey].usdt.decimals,
  tokens[chainKey].usdt.symbol,
  'Tether USD',
);

export const BTCB: { [chainId: number]: Token } = {
  [ChainId.SDN_MAINNET]: new Token(
    ChainId.SDN_MAINNET as any,
    '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    18,
    'BTCB',
    'Binance BTC',
  ),
  [ChainId.SDN_TESTNET]: new Token(
    ChainId.SDN_TESTNET as any,
    '0x6ce8da28e2f864420840cf74474eff5fd80e65b8',
    18,
    'BTCB',
    'Binance BTC',
  ),
};

export const ETH = {
  [ChainId.SDN_MAINNET]: new Token(
    ChainId.SDN_MAINNET as any,
    '0x765277eebeca2e31912c9946eae1021199b39c61',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
  ),
  [ChainId.ASTR_MAINNET]: new Token(
    ChainId.ASTR_MAINNET as any,
    '0x765277eebeca2e31912c9946eae1021199b39c61',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
  ),
};
export const USDC = new Token(
  chainId,
  tokens[chainKey].usdc.address[chainId],
  tokens[chainKey].usdc.decimals,
  tokens[chainKey].usdc.symbol,
  'USD Coin',
);

export const JPYC =
  chainKey === CHAINKEY.ASTR
    ? null
    : new Token(
        chainId,
        tokens[chainKey].jpyc.address[chainId],
        tokens[chainKey].jpyc.decimals,
        tokens[chainKey].jpyc.symbol,
        'JPYC Coin',
      );
export const ALPACA: { [chainId: number]: Token } = {
  [ChainId.BSC_MAINNET]: new Token(
    ChainId.BSC_MAINNET as any,
    '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
    18,
    'ALPACA',
    'Alpaca',
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET as any,
    '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
    18,
    'ALPACA',
    'Alpaca',
  ),
};

export const CAKE: { [chainId: number]: Token } = {
  [ChainId.BSC_MAINNET]: new Token(
    ChainId.BSC_MAINNET as any,
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    18,
    'CAKE',
    'PancakeSwap Token',
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET as any,
    '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
    18,
    'CAKE',
    'PancakeSwap Token',
  ),
};
export const UST: { [chainId: number]: Token } = {
  [ChainId.SDN_MAINNET]: new Token(
    ChainId.SDN_MAINNET as any,
    '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    18,
    'UST',
    'Wrapped UST Token',
  ),
};
export default tokens;
