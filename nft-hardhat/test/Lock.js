const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("NFTMarket", () => {
  let nftMarket
  let signer

  before(async () => {
      // Deploying Contract
      const NFTMarket = await ethers.getContractFactory('NFTMarket')
      nftMarket = await NFTMarket.deploy()
      await nftMarket.deployed()
  })

  const createNFT = async (tokenURI) => {
    // Calling createNFT funcction
    const transaction = await nftMarket.createNFT(tokenURI)
    const receipt = await transaction.wait()
    return receipt.events[0].args.tokenId;
  }

  describe("Test for createNFT", () => {
    it("Should do something", async () => {
      const tokenURI = 'https://base-token.uri/'

      // Assert the mintedTokenURI is the same one that is sent
      const tokenID = await createNFT(tokenURI)
      const mintedTokenURI = await nftMarket.tokenURI(tokenID)
      expect(mintedTokenURI).to.equal(tokenURI)

      // Assert the owner address that he is the one who created nft
      const ownerAddress = await nftMarket.ownerOf(tokenID)
      signer = await ethers.getSigners()
      const currentAddress = await signer[0].getAddress()
      expect(ownerAddress).to.equal(currentAddress)
    })
  })

  describe("Test for listNFT", () => {
    const tokenURI = "https://hello.word/"

    it("Should revert if price == 0", async () => {
      const tokenID = await createNFT(tokenURI)
      await expect(
        nftMarket.listNFT(tokenID, 0)
        ).to.be.revertedWith("NFTMarket: Price must be greater than 0")
    })

    it("Should revert if caller is not the owner of NFT", async () => {
      const tokenID = await createNFT(tokenURI);
      await expect(
        nftMarket.connect(signer[1]).listNFT(tokenID, 1)
      ).to.be.revertedWith("ERC721: approve caller is not token owner or approved for all")
    })
  })
})


