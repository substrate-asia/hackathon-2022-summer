const OCComputing = artifacts.require("OCComputing");
const fs = require("fs");

module.exports = async function (deployer) {
  await deployer.deploy(OCComputing);
  console.log('OCComputing contract address: ' + OCComputing.address);

  // generating address.json
  const contractAddressFile = './build/oc.json';
  const contractAddress = {
    'OCContractAddress': OCComputing.address
  };
  fs.writeFileSync(contractAddressFile, JSON.stringify(contractAddress));
};