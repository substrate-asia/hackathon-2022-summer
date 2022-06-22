const ProxyAdmin = artifacts.require('ProxyAdmin');
const source = require("../config/source_bar")

module.exports = async (deployer, network, accounts) => {

  await deployer.deploy(ProxyAdmin);
  const proxyAmdin = await ProxyAdmin.deployed();

  console.log("proxyAmdin:", proxyAmdin.address);
};