import { ChainId } from '@my/sdk';
export enum IFarmProject {
  kaco = 'Kacoswap',
  starlay = 'Starlay',
  arthswap = 'Arthswap',
}
export enum ISwapLink {
  kaco = 'https://shiden.kaco.finance',
  starlay = 'https://starlay.finance/app',
  arthswap = 'https://app.arthswap.org/#/swap',
}

export enum IABIType {
  AVaultPCS,
}
interface IAddress {
  [ChainId.SDN_MAINNET]?: string;
  [ChainId.SDN_TESTNET]?: string;
  [ChainId.ASTR_MAINNET]?: string;
  [ChainId.ASTR_TESTNET]?: string;
  [ChainId.BSC_MAINNET]?: string;
  [ChainId.BSC_TESTNET]?: string;
}
export interface IVaultConfigItem {
  contractAddress: IAddress;
  fromSource: IFarmProject;
  abiType: IABIType;
  swapLink: string;
  online_at: number; //  timestamp  s
  lpDetail: {
    symbol: string;
    address: IAddress;
    decimals: number;
  };
}
export interface IVaultFarm {
  // abi
  pid: number;
  lpSymbol: string;
  lpAddresses: string;
  tokenAmountMc: string;
  token: string;
  quoteToken: string;
  quoteTokenAmountMc: string;
  tokenAmountTotal: string;
  quoteTokenAmountTotal: string;
  lpTotalInQuoteToken: string;
  lpTotalSupply: string;
  tokenPriceVsQuote: string;
  poolWeight: string;
  multiplier: string;
  quoteTokenDecimals: number;
  // calculate
  apr?: string;
  apy?: string;
  lpRewardsApr?: string;
  liquidity?: string;
  lpTokenPrice?: string;
  lpAddressDecimals: number;
  userData?: Record<string, IVaultUserData>;
}
export interface IVaultUserData {
  index?: number;
  pid?: number;
  account: string;
  allowance: string;
  stakingTokenBalance: string;
  stakedBalance: string;
  pendingReward: string;
  avaultAddressBalance: string;
  userVaultSupply: string;
  vaultWantLockedTotal?: string;
}
export interface IVaultComp {
  // abi
  symbol: string;
  name: string;
  masterChef: string;
  AVAAddress: string;
  token0Address: string;
  token1Address: string;
  fromSource: IFarmProject;
  wantAddress: string;
  earnedAddress: string;
  wantLockedTotal: string;
  totalSupply: string;
  decimals: number;
  balance?: string;
  liquidity?: string;
  // calculate
  lpToCLpRate?: string;
}
export interface IVault extends IVaultConfigItem {
  vault: IVaultComp;
  farm: IVaultFarm;
  isLoading: boolean;
}
// BTC   ETH  USDC  ASTR
// export const vaultData = [
//   {
//     id: 1,
//     selected: false,
//     hidden: false,
//     original: {
//       vault: {
//         label: 'USDT-USDC LP',
//         token0Address: '0x55d398326f99059ff775485246999027b3197955',
//         token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//         isSingle: false,
//         farmProject: IFarmProject.arthswap,
//         swapLink: ISwapLink.arthswap,
//       },
//       net: { net: '333' },
//       liquidity: { liquidity: '0.00' },
//       apr: {
//         farmProject: IFarmProject.arthswap,
//         apy: '10.02',
//         apr: '63.5',
//         multiplier: '20X',
//         vaultSymbol: 'aAUU',
//         lpLabel: 'USDT-USDC LP',
//         token0Address: '0x55d398326f99059ff775485246999027b3197955',
//         token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 10.020219078151138,
//         fromSource: IFarmProject.arthswap,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         lpSymbol: 'USDT-USDC LP',

//         contractAddress: {
//           '82': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//           '336': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//         },
//         fromSource: IFarmProject.arthswap,
//         swapLink: ISwapLink.arthswap,
//         abiType: 0,
//         vault: {
//           symbol: 'aAUU',
//           name: 'Avault Arthswap USDT-USDC LP',
//           masterChef: '0x293A7824582C56B0842535f94F6E3841888168C8',
//           token0Address: '0x55d398326f99059ff775485246999027b3197955',
//           token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//           fromSource: IFarmProject.arthswap,
//           swapLink: ISwapLink.arthswap,
//           wantAddress: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           earnedAddress: '0x55d398326f99059ff775485246999027b3197955',
//           wantLockedTotal: '110390420000000',
//           totalSupply: '110000000000000',
//           AVAAddress: '0x55d398326f99059ff775485246999027b3197955',
//           decimals: 18,
//           lpToCLpRate: '1',
//           liquidity: '0.00',
//         },
//         farm: {
//           pid: 1,
//           lpSymbol: 'USDT-USDC LP',
//           lpAddresses: '0x03065E84748a9e4a1AEbef15AC89da1Cdf18B202',
//           token: '0x55d398326f99059ff775485246999027b3197955',
//           quoteToken: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           lpTotalSupply: '98176461450833208727334',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           quoteTokenDecimals: 18,
//           liquidity: '28015.52611672134',
//           lpTokenPrice: '0.28505652613293882452117588446169683262071264798495095077236909192679546370616882',
//           userData: {
//             allowance: '0',
//             stakingTokenBalance: '0',
//             stakedBalance: '0',
//             pendingReward: '0',
//             avaultAddressBalance: '0',
//           },
//           apr: '63.50215608181524',
//           lpRewardsApr: '0',
//           apy: '10.020219078151138',
//         },
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'vault',
//         value: {
//           label: 'USDT-USDC LP',
//           token0Address: '0x55d398326f99059ff775485246999027b3197955',
//           token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//         },
//       },
//       { hidden: false, field: 'net', value: { net: '333' } },
//       { hidden: false, field: 'liquidity', value: { liquidity: '0.00' } },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '10.02',
//           apr: '63.5',
//           multiplier: '20X',
//           vaultSymbol: 'aAUU',
//           lpLabel: 'USDT-USDC LP',
//           token0Address: '0x55d398326f99059ff775485246999027b3197955',
//           token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//           cakePrice: '0.0296',
//           originalValue: 10.020219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           contractAddress: {
//             '82': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//             '336': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//           },
//           fromSource: IFarmProject.arthswap,
//           abiType: 0,
//           vault: {
//             symbol: 'aAUU',
//             name: 'Avault Arthswap USDT-USDC LP',
//             masterChef: '0x293A7824582C56B0842535f94F6E3841888168C8',
//             token0Address: '0x55d398326f99059ff775485246999027b3197955',
//             token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//             fromSource: IFarmProject.arthswap,
//             swapLink: ISwapLink.arthswap,

//             wantAddress: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//             earnedAddress: '0x55d398326f99059ff775485246999027b3197955',
//             wantLockedTotal: '110390420000000',
//             totalSupply: '110000000000000',
//             AVAAddress: '0x55d398326f99059ff775485246999027b3197955',
//             decimals: '18',
//             lpToCLpRate: '1.0122',
//             liquidity: '0.00',
//           },
//           farm: {
//             pid: 1,
//             lpSymbol: 'USDT-USDC LP',
//             lpAddresses: '0xBb6F40E8739cC5b89A247AA54C612D7E3cc9AD2a',
//             token: '0x55d398326f99059ff775485246999027b3197955',
//             quoteToken: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//             tokenAmountMc:
//               '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//             quoteTokenAmountMc:
//               '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//             tokenAmountTotal: '472733.801506738136252855',
//             quoteTokenAmountTotal: '20708.797818239259072963',
//             lpTotalInQuoteToken:
//               '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//             lpTotalSupply: '98176461450833208727334',
//             tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//             poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//             multiplier: '20X',
//             quoteTokenDecimals: 18,
//             liquidity: '28015.52611672134',
//             lpTokenPrice: '0.28505652613293882452117588446169683262071264798495095077236909192679546370616882',
//             userData: {
//               allowance: '0',
//               stakingTokenBalance: '0',
//               stakedBalance: '0',
//               pendingReward: '0',
//               avaultAddressBalance: '0',
//             },
//             apr: '63.50215608181524',
//             lpRewardsApr: '0',
//             apy: '10.020219078151138',
//           },
//         },
//       },
//     ],
//   },

//   {
//     id: 3,
//     selected: false,
//     hidden: false,
//     original: {
//       vault: {
//         label: 'USDC',
//         token0Address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//         token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//         isSingle: true,
//         farmProject: IFarmProject.starlay,
//         swapLink: ISwapLink.starlay,
//       },
//       net: { net: '333' },
//       liquidity: { liquidity: '0.00' },
//       apr: {
//         apy: '8.91',
//         apr: '63.5',
//         multiplier: '20X',
//         vaultSymbol: 'aSUSDC',
//         fromSource: IFarmProject.starlay,
//         lpLabel: 'USDC',
//         token0Address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//         token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 8.910219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         contractAddress: {
//           '82': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//           '336': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//         },
//         lpSymbol: 'USDC',
//         fromSource: IFarmProject.starlay,
//         swapLink: ISwapLink.starlay,
//         abiType: 0,
//         vault: {
//           symbol: 'aSUSDC',
//           name: 'Avault Starlay USDC',
//           masterChef: '0x293A7824582C56B0842535f94F6E3841888168C8',
//           token0Address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//           token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//           fromSource: IFarmProject.starlay,
//           swapLink: ISwapLink.starlay,
//           wantAddress: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           earnedAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//           wantLockedTotal: '110390420000000',
//           totalSupply: '110000000000000',
//           AVAAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//           decimals: 18,
//           lpToCLpRate: '1.0000',
//           liquidity: '0.00',
//         },
//         farm: {
//           pid: 1,
//           lpSymbol: 'USDC',
//           lpAddresses: '0x3937C6f8120c206646bf616FF62eB2631D0D9d6A',
//           token: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//           quoteToken: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           lpTotalSupply: '98176461450833208727334',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           quoteTokenDecimals: 18,
//           liquidity: '28015.52611672134',
//           lpTokenPrice: '0.28505652613293882452117588446169683262071264798495095077236909192679546370616882',
//           userData: {
//             allowance: '0',
//             stakingTokenBalance: '0',
//             stakedBalance: '0',
//             pendingReward: '0',
//             avaultAddressBalance: '0',
//           },
//           apr: '63.50215608181524',
//           lpRewardsApr: '0',
//           apy: '8.910219078151138',
//         },
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'vault',
//         value: {
//           label: 'USDC',
//           token0Address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//           token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//         },
//       },
//       { hidden: false, field: 'net', value: { net: '333' } },
//       { hidden: false, field: 'liquidity', value: { liquidity: '0.00' } },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '8.91',
//           apr: '63.5',
//           multiplier: '20X',
//           vaultSymbol: 'aSUSDC',
//           lpLabel: 'USDC',
//           token0Address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//           token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//           cakePrice: '0.0296',
//           originalValue: 8.910219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           contractAddress: {
//             '82': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//             '336': '0xFB6Ae2A33e95C21d06A583D762BAfEC0F4967403',
//           },
//           fromSource: IFarmProject.starlay,
//           swapLink: ISwapLink.starlay,
//           abiType: 0,
//           vault: {
//             symbol: 'aSUSDC',
//             name: 'Avault Starlay USDC',
//             masterChef: '0x293A7824582C56B0842535f94F6E3841888168C8',
//             token0Address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//             token1Address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//             fromSource: IFarmProject.starlay,
//             swapLink: ISwapLink.starlay,
//             wantAddress: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//             earnedAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//             wantLockedTotal: '110390420000000',
//             totalSupply: '110000000000000',
//             AVAAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//             decimals: '18',
//             lpToCLpRate: '1.0000',
//             liquidity: '0.00',
//           },
//           farm: {
//             pid: 1,
//             lpSymbol: 'USDC',
//             lpAddresses: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//             token: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
//             quoteToken: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
//             tokenAmountMc:
//               '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//             quoteTokenAmountMc:
//               '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//             tokenAmountTotal: '472733.801506738136252855',
//             quoteTokenAmountTotal: '20708.797818239259072963',
//             lpTotalInQuoteToken:
//               '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//             lpTotalSupply: '98176461450833208727334',
//             tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//             poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//             multiplier: '20X',
//             quoteTokenDecimals: 18,
//             liquidity: new BigNumber('28015.52611672134'),
//             lpTokenPrice: '0.28505652613293882452117588446169683262071264798495095077236909192679546370616882',
//             userData: {
//               allowance: '0',
//               stakingTokenBalance: '0',
//               stakedBalance: '0',
//               pendingReward: '0',
//               avaultAddressBalance: '0',
//             },
//             apr: '63.50215608181524',
//             lpRewardsApr: '0',
//             apy: '8.910219078151138',
//           },
//         },
//       },
//     ],
//   },
// ];

// export const farmData = [
//   {
//     id: 1,
//     selected: false,
//     hidden: false,
//     original: {
//       farm: {
//         label: 'aKKS',
//         pid: 1,
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//             '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//       },
//       liquidity: {
//         liquidity: new BigNumber('0.001'),
//       },
//       apr: {
//         apy: '188.6',
//         apr: '0.00',
//         multiplier: '20X',
//         lpLabel: 'aKKS',
//         tokenAddress: {
//           '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//           '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//         },
//         quoteTokenAddress: {
//           '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//         },
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 188.60219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         pid: 1,
//         lpSymbol: 'aKKS',
//         lpAddresses: {
//           '82': '0x03065E84748a9e4a1AEbef15AC89da1Cdf18B202',
//           '336': '0x03065E84748a9e4a1AEbef15AC89da1Cdf18B202',
//         },
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//             '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//         tokenAmountMc:
//           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//         quoteTokenAmountMc:
//           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//         tokenAmountTotal: '472733.801506738136252855',
//         quoteTokenAmountTotal: '20708.797818239259072963',
//         lpTotalSupply: '98176461450833208727334',
//         lpTotalInQuoteToken:
//           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//         multiplier: '20X',
//         apr: 63.50215608181524,
//         lpRewardsApr: 0,
//         liquidity: new BigNumber('28015.52611672134'),
//         apy: 188.60219078151138,
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'farm',
//         value: {
//           label: 'aKKS',
//           pid: 1,
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//               '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//               '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//         },
//       },
//       {
//         hidden: false,
//         field: 'liquidity',
//         value: {
//           liquidity: new BigNumber('28015.52611672134'),
//         },
//       },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '188.6',
//           apr: '63.5',
//           multiplier: '20X',
//           lpLabel: 'aKKS',
//           tokenAddress: {
//             '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//             '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//           },
//           quoteTokenAddress: {
//             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           },
//           cakePrice: '0.0296',
//           originalValue: 188.60219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           pid: 1,
//           lpSymbol: 'aKKS',
//           lpAddresses: {
//             '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//             '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           },
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//               '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//               '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//           userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalSupply: '98176461450833208727334',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           apr: 63.50215608181524,
//           lpRewardsApr: 0,
//           liquidity: new BigNumber('28015.52611672134'),
//           apy: 188.60219078151138,
//         },
//       },
//     ],
//   },
//   {
//     id: 2,
//     selected: false,
//     hidden: false,
//     original: {
//       farm: {
//         label: 'aKSU',
//         pid: 1,
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//       },
//       liquidity: {
//         liquidity: new BigNumber('0.001'),
//       },
//       apr: {
//         apy: '188.6',
//         apr: '0.00',
//         multiplier: '20X',
//         lpLabel: 'aKSU',
//         tokenAddress: {
//           '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//         },
//         quoteTokenAddress: {
//           '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//         },
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 188.60219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         pid: 1,
//         lpSymbol: 'aKSU',
//         lpAddresses: {
//           '82': '0xBb6F40E8739cC5b89A247AA54C612D7E3cc9AD2a',
//           '336': '0xBb6F40E8739cC5b89A247AA54C612D7E3cc9AD2a',
//         },
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//         tokenAmountMc:
//           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//         quoteTokenAmountMc:
//           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//         tokenAmountTotal: '472733.801506738136252855',
//         quoteTokenAmountTotal: '20708.797818239259072963',
//         lpTotalSupply: '98176461450833208727334',
//         lpTotalInQuoteToken:
//           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//         multiplier: '20X',
//         apr: 63.50215608181524,
//         lpRewardsApr: 0,
//         liquidity: new BigNumber('28015.52611672134'),
//         apy: 188.60219078151138,
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'farm',
//         value: {
//           label: 'aKSU',
//           pid: 1,
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//               '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//         },
//       },
//       {
//         hidden: false,
//         field: 'liquidity',
//         value: {
//           liquidity: new BigNumber('28015.52611672134'),
//         },
//       },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '188.6',
//           apr: '63.5',
//           multiplier: '20X',
//           lpLabel: 'aKSU',
//           tokenAddress: {
//             '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           },
//           quoteTokenAddress: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           cakePrice: '0.0296',
//           originalValue: 188.60219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           pid: 1,
//           lpSymbol: 'aKSU',
//           lpAddresses: {
//             '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//             '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           },
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//               '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//           userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalSupply: '98176461450833208727334',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           apr: 63.50215608181524,
//           lpRewardsApr: 0,
//           liquidity: new BigNumber('28015.52611672134'),
//           apy: 188.60219078151138,
//         },
//       },
//     ],
//   },

//   {
//     id: 3,
//     selected: false,
//     hidden: false,
//     original: {
//       farm: {
//         label: 'aKES',
//         pid: 1,
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//       },
//       liquidity: {
//         liquidity: new BigNumber('0.001'),
//       },
//       apr: {
//         apy: '188.6',
//         apr: '0.00',
//         multiplier: '20X',
//         lpLabel: 'aKES',
//         tokenAddress: {
//           '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//         },
//         quoteTokenAddress: {
//           '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//         },
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 188.60219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         pid: 1,
//         lpSymbol: 'aKES',
//         lpAddresses: {
//           '82': '0x3937C6f8120c206646bf616FF62eB2631D0D9d6A',
//           '336': '0x3937C6f8120c206646bf616FF62eB2631D0D9d6A',
//         },
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//         tokenAmountMc:
//           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//         quoteTokenAmountMc:
//           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//         tokenAmountTotal: '472733.801506738136252855',
//         quoteTokenAmountTotal: '20708.797818239259072963',
//         lpTotalSupply: '98176461450833208727334',
//         lpTotalInQuoteToken:
//           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//         multiplier: '20X',
//         apr: 63.50215608181524,
//         lpRewardsApr: 0,
//         liquidity: new BigNumber('28015.52611672134'),
//         apy: 188.60219078151138,
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'farm',
//         value: {
//           label: 'aKES',
//           pid: 1,
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//               '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//               '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//         },
//       },
//       {
//         hidden: false,
//         field: 'liquidity',
//         value: {
//           liquidity: new BigNumber('28015.52611672134'),
//         },
//       },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '188.6',
//           apr: '63.5',
//           multiplier: '20X',
//           lpLabel: 'aKES',
//           tokenAddress: {
//             '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           },
//           quoteTokenAddress: {
//             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//           },
//           cakePrice: '0.0296',
//           originalValue: 188.60219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           pid: 1,
//           lpSymbol: 'aKES',
//           lpAddresses: {
//             '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//             '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           },
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//               '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//               '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//           userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalSupply: '98176461450833208727334',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           apr: 63.50215608181524,
//           lpRewardsApr: 0,
//           liquidity: new BigNumber('28015.52611672134'),
//           apy: 188.60219078151138,
//         },
//       },
//     ],
//   },
//   {
//     id: 4,
//     selected: false,
//     hidden: false,
//     original: {
//       farm: {
//         label: 'aKEU',
//         pid: 1,
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//       },
//       liquidity: {
//         liquidity: new BigNumber('0.001'),
//       },
//       apr: {
//         apy: '188.6',
//         apr: '0.00',
//         multiplier: '20X',
//         lpLabel: 'aKEU',
//         tokenAddress: {
//           '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//         },
//         quoteTokenAddress: {
//           '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//         },
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 188.60219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         pid: 1,
//         lpSymbol: 'aKEU',
//         lpAddresses: {
//           '82': '0x38325f901a698aF88D855f061d0FEA70825856c5',
//           '336': '0x38325f901a698aF88D855f061d0FEA70825856c5',
//         },
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//         tokenAmountMc:
//           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//         quoteTokenAmountMc:
//           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//         tokenAmountTotal: '472733.801506738136252855',
//         quoteTokenAmountTotal: '20708.797818239259072963',
//         lpTotalSupply: '98176461450833208727334',
//         lpTotalInQuoteToken:
//           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//         multiplier: '20X',
//         apr: 63.50215608181524,
//         lpRewardsApr: 0,
//         liquidity: new BigNumber('28015.52611672134'),
//         apy: 188.60219078151138,
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'farm',
//         value: {
//           label: 'aKEU',
//           pid: 1,
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//               '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//         },
//       },
//       {
//         hidden: false,
//         field: 'liquidity',
//         value: {
//           liquidity: new BigNumber('28015.52611672134'),
//         },
//       },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '188.6',
//           apr: '63.5',
//           multiplier: '20X',
//           lpLabel: 'aKEU',
//           tokenAddress: {
//             '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//           },
//           quoteTokenAddress: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           cakePrice: '0.0296',
//           originalValue: 188.60219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           pid: 1,
//           lpSymbol: 'aKEU',
//           lpAddresses: {
//             '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//             '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           },
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x765277eebeca2e31912c9946eae1021199b39c61',
//               '336': '0x765277eebeca2e31912c9946eae1021199b39c61',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//           userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalSupply: '98176461450833208727334',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           apr: 63.50215608181524,
//           lpRewardsApr: 0,
//           liquidity: new BigNumber('28015.52611672134'),
//           apy: 188.60219078151138,
//         },
//       },
//     ],
//   },

//   {
//     id: 5,
//     selected: false,
//     hidden: false,
//     original: {
//       farm: {
//         label: 'aKBU',
//         pid: 1,
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//             '336': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//       },
//       liquidity: {
//         liquidity: new BigNumber('0.001'),
//       },
//       apr: {
//         apy: '188.6',
//         apr: '0.00',
//         multiplier: '20X',
//         lpLabel: 'aKBU',
//         tokenAddress: {
//           '82': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//           '336': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//         },
//         quoteTokenAddress: {
//           '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//         },
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 188.60219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         pid: 1,
//         lpSymbol: 'aKBU',
//         lpAddresses: {
//           '82': '0x85599937c68fD72D2eac2170009Bda288A79758a',
//           '336': '0x85599937c68fD72D2eac2170009Bda288A79758a',
//         },
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//             '336': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//         tokenAmountMc:
//           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//         quoteTokenAmountMc:
//           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//         tokenAmountTotal: '472733.801506738136252855',
//         quoteTokenAmountTotal: '20708.797818239259072963',
//         lpTotalSupply: '98176461450833208727334',
//         lpTotalInQuoteToken:
//           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//         multiplier: '20X',
//         apr: 63.50215608181524,
//         lpRewardsApr: 0,
//         liquidity: new BigNumber('28015.52611672134'),
//         apy: 188.60219078151138,
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'farm',
//         value: {
//           label: 'aKBU',
//           pid: 1,
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//               '336': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//         },
//       },
//       {
//         hidden: false,
//         field: 'liquidity',
//         value: {
//           liquidity: new BigNumber('28015.52611672134'),
//         },
//       },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '188.6',
//           apr: '63.5',
//           multiplier: '20X',
//           lpLabel: 'aKBU',
//           tokenAddress: {
//             '82': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//             '336': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//           },
//           quoteTokenAddress: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           cakePrice: '0.0296',
//           originalValue: 188.60219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           pid: 1,
//           lpSymbol: 'aKBU',
//           lpAddresses: {
//             '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//             '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           },
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//               '336': '0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//           userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalSupply: '98176461450833208727334',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           apr: 63.50215608181524,
//           lpRewardsApr: 0,
//           liquidity: new BigNumber('28015.52611672134'),
//           apy: 188.60219078151138,
//         },
//       },
//     ],
//   },
//   {
//     id: 6,
//     selected: false,
//     hidden: false,
//     original: {
//       farm: {
//         label: 'aKSJ',
//         pid: 1,
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//       },
//       liquidity: {
//         liquidity: new BigNumber('0.001'),
//       },
//       apr: {
//         apy: '188.6',
//         apr: '0.00',
//         multiplier: '20X',
//         lpLabel: 'aKSJ',
//         tokenAddress: {
//           '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//         },
//         quoteTokenAddress: {
//           '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//         },
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 188.60219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         pid: 1,
//         lpSymbol: 'aKSJ',
//         lpAddresses: {
//           '82': '0x477033fD6A020c3D09AFE0B6341F813247AF70fa',
//           '336': '0x477033fD6A020c3D09AFE0B6341F813247AF70fa',
//         },
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//         tokenAmountMc:
//           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//         quoteTokenAmountMc:
//           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//         tokenAmountTotal: '472733.801506738136252855',
//         quoteTokenAmountTotal: '20708.797818239259072963',
//         lpTotalSupply: '98176461450833208727334',
//         lpTotalInQuoteToken:
//           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//         multiplier: '20X',
//         apr: 63.50215608181524,
//         lpRewardsApr: 0,
//         liquidity: new BigNumber('28015.52611672134'),
//         apy: 188.60219078151138,
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'farm',
//         value: {
//           label: 'aKSJ',
//           pid: 1,
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//               '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//               '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//         },
//       },
//       {
//         hidden: false,
//         field: 'liquidity',
//         value: {
//           liquidity: new BigNumber('28015.52611672134'),
//         },
//       },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '188.6',
//           apr: '63.5',
//           multiplier: '20X',
//           lpLabel: 'aKSJ',
//           tokenAddress: {
//             '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//           },
//           quoteTokenAddress: {
//             '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           },
//           cakePrice: '0.0296',
//           originalValue: 188.60219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           pid: 1,
//           lpSymbol: 'aKSJ',
//           lpAddresses: {
//             '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//             '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           },
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//               '336': '0x0f933dc137d21ca519ae4c7e93f87a4c8ef365ef',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//               '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//           userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalSupply: '98176461450833208727334',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           apr: 63.50215608181524,
//           lpRewardsApr: 0,
//           liquidity: new BigNumber('28015.52611672134'),
//           apy: 188.60219078151138,
//         },
//       },
//     ],
//   },
//   {
//     id: 7,
//     selected: false,
//     hidden: false,
//     original: {
//       farm: {
//         label: 'aKJU',
//         pid: 1,
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//       },
//       liquidity: {
//         liquidity: new BigNumber('0.001'),
//       },
//       apr: {
//         apy: '188.6',
//         apr: '0.00',
//         multiplier: '20X',
//         lpLabel: 'aKJU',
//         tokenAddress: {
//           '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//         },
//         quoteTokenAddress: {
//           '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//         },
//         cakePrice: new BigNumber('0.0296'),
//         originalValue: 188.60219078151138,
//       },
//       earned: { earnings: 0, pid: 1 },
//       multiplier: { multiplier: '20X' },
//       details: {
//         pid: 1,
//         lpSymbol: 'aKJU',
//         lpAddresses: {
//           '82': '0x7745d489DC858D07313Bc18Ba48930066C019590',
//           '336': '0x7745d489DC858D07313Bc18Ba48930066C019590',
//         },
//         token: {
//           symbol: 'AVAT',
//           address: {
//             '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           },
//           decimals: 18,
//           projectLink: 'https://kaco.finance/',
//           busdPrice: '0.0296',
//         },
//         quoteToken: {
//           symbol: 'WSDN',
//           name: 'Wrapped SDN',
//           decimals: 18,
//           address: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           projectLink: 'https://blockscout.com/shiden/',
//           busdPrice: '0.6781',
//         },
//         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//         tokenAmountMc:
//           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//         quoteTokenAmountMc:
//           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//         tokenAmountTotal: '472733.801506738136252855',
//         quoteTokenAmountTotal: '20708.797818239259072963',
//         lpTotalSupply: '98176461450833208727334',
//         lpTotalInQuoteToken:
//           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//         multiplier: '20X',
//         apr: 63.50215608181524,
//         lpRewardsApr: 0,
//         liquidity: new BigNumber('28015.52611672134'),
//         apy: 188.60219078151138,
//       },
//     },
//     cells: [
//       {
//         hidden: false,
//         field: 'farm',
//         value: {
//           label: 'aKJU',
//           pid: 1,
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//               '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//         },
//       },
//       {
//         hidden: false,
//         field: 'liquidity',
//         value: {
//           liquidity: new BigNumber('28015.52611672134'),
//         },
//       },
//       {
//         hidden: false,
//         field: 'apr',
//         value: {
//           apy: '188.6',
//           apr: '63.5',
//           multiplier: '20X',
//           lpLabel: 'aKJU',
//           tokenAddress: {
//             '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//           },
//           quoteTokenAddress: {
//             '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//           },
//           cakePrice: '0.0296',
//           originalValue: 188.60219078151138,
//         },
//       },
//       { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//       { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//       {
//         hidden: false,
//         field: 'details',
//         value: {
//           pid: 1,
//           lpSymbol: 'aKJU',
//           lpAddresses: {
//             '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//             '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//           },
//           token: {
//             symbol: 'AVAT',
//             address: {
//               '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//               '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//             },
//             decimals: 18,
//             projectLink: 'https://kaco.finance/',
//             busdPrice: '0.0296',
//           },
//           quoteToken: {
//             symbol: 'WSDN',
//             name: 'Wrapped SDN',
//             decimals: 18,
//             address: {
//               '82': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//               '336': '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
//             },
//             projectLink: 'https://blockscout.com/shiden/',
//             busdPrice: '0.6781',
//           },
//           userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//           tokenAmountMc:
//             '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//           quoteTokenAmountMc:
//             '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//           tokenAmountTotal: '472733.801506738136252855',
//           quoteTokenAmountTotal: '20708.797818239259072963',
//           lpTotalSupply: '98176461450833208727334',
//           lpTotalInQuoteToken:
//             '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//           tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//           poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//           multiplier: '20X',
//           apr: 63.50215608181524,
//           lpRewardsApr: 0,
//           liquidity: new BigNumber('28015.52611672134'),
//           apy: 188.60219078151138,
//         },
//       },
//     ],
//   },
//   // {
//   //   id: 2,
//   //   selected: false,
//   //   hidden: false,
//   //   original: {
//   //     farm: {
//   //       label: 'aAVAT',
//   //       pid: 1,
//   //       token: {
//   //         symbol: 'AVAT',
//   //         address: {
//   //           '82': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//   //           '336': '0x735abe48e8782948a37c7765ecb76b98cde97b0f',
//   //         },
//   //         decimals: 18,
//   //         projectLink: 'https://kaco.finance/',
//   //         busdPrice: '0.0296',
//   //       },
//   //       quoteToken: {
//   //         symbol: 'WSDN',
//   //         name: 'Wrapped SDN',
//   //         decimals: 18,
//   //         address: {
//   //           '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //           '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //         },
//   //         projectLink: 'https://blockscout.com/shiden/',
//   //         busdPrice: '0.6781',
//   //       },
//   //     },
//   //     liquidity: {
//   //       liquidity: new BigNumber('115.52'),
//   //     },
//   //     apr: {
//   //       apy: '188.6',
//   //       apr: '12.31',
//   //       multiplier: '20X',
//   //       lpLabel: 'AVAT',
//   //       tokenAddress: {
//   //         '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//   //         '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//   //       },
//   //       quoteTokenAddress: {
//   //         '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //         '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //       },
//   //       cakePrice: new BigNumber('0.0296'),
//   //       originalValue: 188.60219078151138,
//   //     },
//   //     earned: { earnings: 0, pid: 1 },
//   //     multiplier: { multiplier: '20X' },
//   //     details: {
//   //       pid: 1,
//   //       lpSymbol: 'AVAT',
//   //       lpAddresses: {
//   //         '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//   //         '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//   //       },
//   //       token: {
//   //         symbol: 'AVAT',
//   //         address: {
//   //           '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//   //           '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//   //         },
//   //         decimals: 18,
//   //         projectLink: 'https://kaco.finance/',
//   //         busdPrice: '0.0296',
//   //       },
//   //       quoteToken: {
//   //         symbol: 'WSDN',
//   //         name: 'Wrapped SDN',
//   //         decimals: 18,
//   //         address: {
//   //           '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //           '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //         },
//   //         projectLink: 'https://blockscout.com/shiden/',
//   //         busdPrice: '0.6781',
//   //       },
//   //       userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//   //       tokenAmountMc:
//   //         '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//   //       quoteTokenAmountMc:
//   //         '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//   //       tokenAmountTotal: '472733.801506738136252855',
//   //       quoteTokenAmountTotal: '20708.797818239259072963',
//   //       lpTotalSupply: '98176461450833208727334',
//   //       lpTotalInQuoteToken:
//   //         '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//   //       tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//   //       poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//   //       multiplier: '20X',
//   //       apr: 63.50215608181524,
//   //       lpRewardsApr: 0,
//   //       liquidity: new BigNumber('28015.52611672134'),
//   //       apy: 188.60219078151138,
//   //     },
//   //   },
//   //   cells: [
//   //     {
//   //       hidden: false,
//   //       field: 'farm',
//   //       value: {
//   //         label: 'AVAT',
//   //         pid: 1,
//   //         token: {
//   //           symbol: 'AVAT',
//   //           address: {
//   //             '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//   //             '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//   //           },
//   //           decimals: 18,
//   //           projectLink: 'https://kaco.finance/',
//   //           busdPrice: '0.0296',
//   //         },
//   //         quoteToken: {
//   //           symbol: 'WSDN',
//   //           name: 'Wrapped SDN',
//   //           decimals: 18,
//   //           address: {
//   //             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //           },
//   //           projectLink: 'https://blockscout.com/shiden/',
//   //           busdPrice: '0.6781',
//   //         },
//   //       },
//   //     },
//   //     {
//   //       hidden: false,
//   //       field: 'liquidity',
//   //       value: {
//   //         liquidity: new BigNumber('28015.52611672134'),
//   //       },
//   //     },
//   //     {
//   //       hidden: false,
//   //       field: 'apr',
//   //       value: {
//   //         apy: '188.6',
//   //         apr: '63.5',
//   //         multiplier: '20X',
//   //         lpLabel: 'AVAT',
//   //         tokenAddress: {
//   //           '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//   //           '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//   //         },
//   //         quoteTokenAddress: {
//   //           '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //           '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //         },
//   //         cakePrice: '0.0296',
//   //         originalValue: 188.60219078151138,
//   //       },
//   //     },
//   //     { hidden: false, field: 'earned', value: { earnings: 0, pid: 1 } },
//   //     { hidden: false, field: 'multiplier', value: { multiplier: '20X' } },
//   //     {
//   //       hidden: false,
//   //       field: 'details',
//   //       value: {
//   //         pid: 1,
//   //         lpSymbol: 'AVAT',
//   //         lpAddresses: {
//   //           '82': '0x0bA819e30016Cf682C7795b44859148C65e62292',
//   //           '336': '0x456C0082DE0048EE883881fF61341177FA1FEF40',
//   //         },
//   //         token: {
//   //           symbol: 'AVAT',
//   //           address: {
//   //             '82': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
//   //             '336': '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
//   //           },
//   //           decimals: 18,
//   //           projectLink: 'https://kaco.finance/',
//   //           busdPrice: '0.0296',
//   //         },
//   //         quoteToken: {
//   //           symbol: 'WSDN',
//   //           name: 'Wrapped SDN',
//   //           decimals: 18,
//   //           address: {
//   //             '82': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //             '336': '0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef',
//   //           },
//   //           projectLink: 'https://blockscout.com/shiden/',
//   //           busdPrice: '0.6781',
//   //         },
//   //         userData: { allowance: '0', tokenBalance: '0', stakedBalance: '0', earnings: '0' },
//   //         tokenAmountMc:
//   //           '471559.8392807465922754335585012287478156162052075807015060024359882761365621443949805082594920415051519',
//   //         quoteTokenAmountMc:
//   //           '20657.37068037261666224906946605307327697003681220776317494838004563472061327824254405542855963695741614',
//   //         tokenAmountTotal: '472733.801506738136252855',
//   //         quoteTokenAmountTotal: '20708.797818239259072963',
//   //         lpTotalSupply: '98176461450833208727334',
//   //         lpTotalInQuoteToken:
//   //           '41314.74136074523332449813893210614655394007362441552634989676009126944122655648508811085711927391483228',
//   //         tokenPriceVsQuote: '0.04380646730196652783146946639140426953535937682783101164957744370366617922314668',
//   //         poolWeight: '0.60606060606060606060606060606060606060606060606060606060606060606060606060606061',
//   //         multiplier: '20X',
//   //         apr: 63.50215608181524,
//   //         lpRewardsApr: 0,
//   //         liquidity: new BigNumber('28015.52611672134'),
//   //         apy: 188.60219078151138,
//   //       },
//   //     },
//   //   ],
//   // },
// ];
