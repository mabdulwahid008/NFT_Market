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

  const createNFTAndList = async (price) => {
    const tokenID = await createNFT("token uri")
    const transaction = await nftMarket.listNFT(tokenID, price)
    await transaction.wait()
    return tokenID
  }

  describe("Test for createNFT", () => {
    it("Should do something", async () => {
      const tokenURI = 'https://base-token.uri/'

      // Assert the mintedTokenURI is the same one that is sent
      const transaction = await nftMarket.createNFT(tokenURI)
      const receipt = await transaction.wait()
      const tokenID = receipt.events[0].args.tokenId;

      const mintedTokenURI = await nftMarket.tokenURI(tokenID)
      expect(mintedTokenURI).to.equal(tokenURI)

      // Assert the owner address that he is the one who created nft
      const ownerAddress = await nftMarket.ownerOf(tokenID)
      signer = await ethers.getSigners()
      const currentAddress = await signer[0].getAddress()
      expect(ownerAddress).to.equal(currentAddress)

      // Assert that NFTTransfer event has correct args
      const args = receipt.events[1].args;
      expect(args.tokenID).to.equal(tokenID)
      expect(args.tokenURI).to.equal(tokenURI)
      expect(args.to).to.equal(ownerAddress)
      expect(args.price).to.equal(0)
    })
  })

  describe("Test for listNFT", () => {
    const tokenURI = "https://hello.word/"

    it("Should revert if price == 0", async () => {
      const tokenID = await createNFT(tokenURI)
      // Assert transaction reverts if price set to 0 with correct err msg
      await expect(
        nftMarket.listNFT(tokenID, 0)
        ).to.be.revertedWith("NFTMarket: Price must be greater than 0")
    })

    it("Should revert if caller is not the owner of NFT", async () => {
      const tokenID = await createNFT(tokenURI);
      // Assert if not owner of the nft do the transaction with correct err msg
      await expect(
        nftMarket.connect(signer[1]).listNFT(tokenID, 1)
      ).to.be.revertedWith("ERC721: caller is not token owner or approved")
    })

    it("Should work fine if all requirements are fine", async () => {
      const tokenID = await createNFT(tokenURI);
      const price = 3;
      const transaction = await nftMarket.listNFT(tokenID, price);
      const receipt = await transaction.wait()
      const args = receipt.events[1].args;
      // Assert that NFTTransfer event has correct args
      expect(args.tokenID).to.equal(tokenID)
      expect(args.tokenURI).to.equal("")
      expect(args.to).to.equal(nftMarket.address)
      expect(args.price).to.equal(price)
    })
  })

  describe("Test for buyNFT", () => {
    it("Should revert if tokenID not listed for sale", async () => {
      const tokenID = 10;
      await expect(
        nftMarket.buyNFT(tokenID)
      ).to.be.revertedWith("NFTMarket: NFT not listed for sale")
    })

    it("Should revert if price(wei) sent is not == to the price listed for sale", async () => {
      const tokenID = await createNFTAndList(123)
      await expect(
        nftMarket.buyNFT(tokenID, {value: 125})
      ).to.be.revertedWith("NFTMarket: Price is incorrect")
    })
  })

})


