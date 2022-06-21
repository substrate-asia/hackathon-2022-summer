const Greetings = artifacts.require("Greetings");
const fs = require("fs");

module.exports = async function (deployer) {
  await deployer.deploy(Greetings);
  console.log('Greeting contract address: ' + Greetings.address);

  // generating address.json
  const contractAddressFile = './build/address.json';
  const contractAddress = {
    'greetingsContractAddress': Greetings.address
  };
  fs.writeFileSync(contractAddressFile, JSON.stringify(contractAddress));
};