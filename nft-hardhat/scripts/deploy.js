const { ethers } = require("hardhat");

async function main() {
  const NFTMarket = await ethers.getContractFactory('NFTMarket')
  const nftMarket = await NFTMarket.deploy()
  await nftMarket.deployed()

  console.log("NFTMarket: Contract Address: ", nftMarket.address); // 0x6E9DbD58811d1B0A8c59AE6bb9817B3eE7160d4A
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
