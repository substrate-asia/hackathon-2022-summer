import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomiclabs/hardhat-solpp';
import { mnemonic, BSCSCANAPIKEY } from '../secret.json';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    testnet: {
      url: 'https://rpc.shibuya.astar.network:8545',
      chainId: 81,
      gasPrice: 1000000000,
      accounts: { mnemonic: mnemonic },
    },
    shidenMainnet: {
      url: 'https://evm.shiden.astar.network',
      chainId: 336,
      gasPrice: 1000000000,
      accounts: { mnemonic: mnemonic },
    },
    astarMainnet: {
      url: 'https://astar.api.onfinality.io/public/',
      chainId: 592,
      gasPrice: 1000000000,
      accounts: { mnemonic: mnemonic },
    },
    bscmainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 5000000000,
      accounts: { mnemonic: mnemonic },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solpp: {
    noFlatten: true,
  },
};

export default config;
