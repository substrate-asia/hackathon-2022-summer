const hre = require("hardhat");

async function main() {

  const MockErc20 = await hre.ethers.getContractFactory("MockERC20");



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
