const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config()
const privateKeyTest = process.env.PRIVATE_KEY_OK_TESTNET;

const enabledWs = false

module.exports = {
  networks: {
    mainnet: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: [privateKeyTest],
          providerOrUrl: enabledWs ? okchainTestWs : okchainTest,
          pollingInterval: 600000
        });
      },
      networkCheckTimeout: 600000,
      timeoutBlocks: 60000,
      gasPrice: 20000000000,
      skipDryRun: true,
      confirmations: 2,
      websocket: enabledWs,
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  },
  solc: {
    optimizer: { // Turning on compiler optimization that removes some local variables during compilation
      enabled: true,
      runs: 200
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: ''
  }
};