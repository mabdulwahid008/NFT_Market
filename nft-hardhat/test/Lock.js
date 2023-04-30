const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("NFTMarket", () => {
  let nftMarket

  before(async () => {
      // Deploying Contract
      const NFTMarket = await ethers.getContractFactory('NFTMarket')
      nftMarket = await NFTMarket.deploy()
      await nftMarket.deployed()
  })


  describe("createNFT", () => {
    it("Should do something", async () => {
      // Calling createNFT funcction
      const tokenURI = 'https://base-token.uri/'
      const transaction = await nftMarket.createNFT(tokenURI)
      const receipt = await transaction.wait()

      // Assert the mintedTokenURI is the same one that is sent
      const tokenID = receipt.events[0].args.tokenId 
      const mintedTokenURI = await nftMarket.tokenURI(tokenID)
      expect(mintedTokenURI).to.equal(tokenURI)

      // Assert the owner address that he is the one who created nft
      const ownerAddress = await nftMarket.ownerOf(tokenID)
      const signer = await ethers.getSigners()
      const currentAddress = await signer[0].getAddress()
      expect(ownerAddress).to.equal(currentAddress)
    })
  })
  
})


