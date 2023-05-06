const { ethers } = require("hardhat");

async function main() {
  const NFTMarket = await ethers.getContractFactory('NFTMarket')
  const nftMarket = await NFTMarket.deploy()
  await nftMarket.deployed()

  console.log("NFTMarket: Contract Address: ", nftMarket.address);
  console.log("Sleeping...");

  // wait for etherscan to recognise the contract
  await new Promise((r)=> setTimeout(r, 40000))

  await hre.run("verify:verify", {
    address: nftMarket.address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
