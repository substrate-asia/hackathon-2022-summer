import { ChainId, CHAINKEY } from '@my/sdk';
import { chainKey } from 'config';
import { IFarmProject, IABIType, IVaultConfigItem } from 'state/vault/types';
const vault: IVaultConfigItem[] =
  chainKey === CHAINKEY.SDN
    ? [
        {
          contractAddress: {
            [ChainId.SDN_TESTNET]: '0x9A6080753a35dCd8e77102aE83A93170A831393e',
            [ChainId.SDN_MAINNET]: '0x9A6080753a35dCd8e77102aE83A93170A831393e',
          },
          // 2022-03-28 00:00:00
          fromSource: IFarmProject.kaco, // from which swap
          abiType: IABIType.AVaultPCS, // use which abi
          swapLink: 'https://shiden.kaco.finance/add/SDN/0xb12c13e66AdE1F72f71834f2FC5082Db8C091358',
          online_at: 1648396800,
          lpDetail: {
            symbol: 'KAC-wSDN LP',
            address: {
              [ChainId.SDN_TESTNET]: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
              [ChainId.SDN_MAINNET]: '0x456C0082DE0048EE883881fF61341177FA1FEF40',
            },
            decimals: 18,
          },
        },

        {
          contractAddress: {
            [ChainId.SDN_TESTNET]: '0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2',
            [ChainId.SDN_MAINNET]: '0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2',
          },
          fromSource: IFarmProject.kaco, // from which swap
          abiType: IABIType.AVaultPCS, // use which abi
          swapLink: 'https://shiden.kaco.finance/add/0xfa9343c3897324496a05fc75abed6bac29f8a40f/SDN',
          online_at: 1648396800,
          lpDetail: {
            symbol: 'wSDN-USDC LP',
            address: {
              [ChainId.SDN_TESTNET]: '0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020',
              [ChainId.SDN_MAINNET]: '0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020',
            },
            decimals: 18,
          },
        },
        {
          contractAddress: {
            [ChainId.SDN_TESTNET]: '0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D',
            [ChainId.SDN_MAINNET]: '0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D',
          },
          fromSource: IFarmProject.kaco, // from which swap
          abiType: IABIType.AVaultPCS, // use which abi
          swapLink: 'https://shiden.kaco.finance/add/SDN/0x765277eebeca2e31912c9946eae1021199b39c61',
          online_at: 1648396800,
          lpDetail: {
            symbol: 'ETH-wSDN LP',
            address: {
              [ChainId.SDN_TESTNET]: '0xeb2C6d3F1bbe9DA50A0272E80fAA89354630DE88',
              [ChainId.SDN_MAINNET]: '0xeb2C6d3F1bbe9DA50A0272E80fAA89354630DE88',
            },
            decimals: 18,
          },
        },

        {
          contractAddress: {
            [ChainId.SDN_TESTNET]: '0xCA9b609b7a0Bc46CcF744B2e0261B9Afd14f81C0',
            [ChainId.SDN_MAINNET]: '0xCA9b609b7a0Bc46CcF744B2e0261B9Afd14f81C0',
          },
          fromSource: IFarmProject.kaco, // from which swap
          abiType: IABIType.AVaultPCS, // use which abi
          swapLink:
            'https://shiden.kaco.finance/add/0xfa9343c3897324496a05fc75abed6bac29f8a40f/0x765277eebeca2e31912c9946eae1021199b39c61',
          online_at: 1648396800,
          lpDetail: {
            symbol: 'ETH-USDC LP',
            address: {
              [ChainId.SDN_TESTNET]: '0xcfb0e95a3A68E3574C73a3C6985D56B7c03b6348',
              [ChainId.SDN_MAINNET]: '0xcfb0e95a3A68E3574C73a3C6985D56B7c03b6348',
            },
            decimals: 18,
          },
        },

        {
          contractAddress: {
            [ChainId.SDN_TESTNET]: '0x8fcbe72710185dd34a8bBBA1Cc05eB2628945FEC',
            [ChainId.SDN_MAINNET]: '0x8fcbe72710185dd34a8bBBA1Cc05eB2628945FEC',
          },
          fromSource: IFarmProject.kaco, // from which swap
          abiType: IABIType.AVaultPCS, // use which abi
          swapLink:
            'https://shiden.kaco.finance/add/0xfa9343c3897324496a05fc75abed6bac29f8a40f/0x65e66a61d0a8f1e686c2d6083ad611a10d84d97a',
          online_at: 1648396800,
          lpDetail: {
            symbol: 'BUSD-USDC LP',
            address: {
              [ChainId.SDN_TESTNET]: '0x8644e9AC84273cA0609F2A2B09b2ED2A5aD2e9DD',
              [ChainId.SDN_MAINNET]: '0x8644e9AC84273cA0609F2A2B09b2ED2A5aD2e9DD',
            },
            decimals: 18,
          },
        },

        {
          contractAddress: {
            [ChainId.SDN_TESTNET]: '0x5167E12139Ee4b2F6590F3C95E56B29d408a9048',
            [ChainId.SDN_MAINNET]: '0x5167E12139Ee4b2F6590F3C95E56B29d408a9048',
          },
          fromSource: IFarmProject.kaco, // from which swap
          abiType: IABIType.AVaultPCS, // use which abi
          swapLink: 'https://shiden.kaco.finance/add/SDN/0x735abe48e8782948a37c7765ecb76b98cde97b0f',
          online_at: 1648396800,
          lpDetail: {
            symbol: 'wSDN-JPYC LP',
            address: {
              [ChainId.SDN_TESTNET]: '0x1Ba530cf929ea5bc7f1Af241495C97331Ddb4f70',
              [ChainId.SDN_MAINNET]: '0x1Ba530cf929ea5bc7f1Af241495C97331Ddb4f70',
            },
            decimals: 18,
          },
        },

        {
          contractAddress: {
            [ChainId.SDN_TESTNET]: '0x9d03BfE2e0BEDA103f1961A8595bF5d8b1F6FD18',
            [ChainId.SDN_MAINNET]: '0x9d03BfE2e0BEDA103f1961A8595bF5d8b1F6FD18',
          },
          fromSource: IFarmProject.kaco, // from which swap
          abiType: IABIType.AVaultPCS, // use which abi
          swapLink:
            'https://shiden.kaco.finance/add/0xfa9343c3897324496a05fc75abed6bac29f8a40f/0x735abe48e8782948a37c7765ecb76b98cde97b0f',
          online_at: 1648396800,
          lpDetail: {
            symbol: 'JPYC-USDC LP',
            address: {
              [ChainId.SDN_TESTNET]: '0xE2c19EB0f91c80275cc254f90Ed0f18F26650ec5',
              [ChainId.SDN_MAINNET]: '0xE2c19EB0f91c80275cc254f90Ed0f18F26650ec5',
            },
            decimals: 18,
          },
        },
      ]
    : [];
// aKKS deployed to: 0x9A6080753a35dCd8e77102aE83A93170A831393e
// aKSU deployed to: 0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2
// aKES deployed to: 0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D
// aKEU deployed to: 0xCA9b609b7a0Bc46CcF744B2e0261B9Afd14f81C0
// aKBU deployed to: 0x8fcbe72710185dd34a8bBBA1Cc05eB2628945FEC
// aKSJ deployed to: 0x5167E12139Ee4b2F6590F3C95E56B29d408a9048
// aKJU deployed to: 0x9d03BfE2e0BEDA103f1961A8595bF5d8b1F6FD18

export default vault;
