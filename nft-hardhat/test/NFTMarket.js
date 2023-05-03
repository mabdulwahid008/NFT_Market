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

    it("Should transfer ownership to the buyer and send the price to the seller", async () => { 
      const price = 123
      const sellerProfit = Math.floor(price * 95 / 100)
      const fee = price - sellerProfit
      const initialBalanceOfContract = await nftMarket.provider.getBalance(nftMarket.address)

      const tokenID = await createNFTAndList(price)
      await new Promise((res) => setTimeout(res, 100))
      
      const oldBalanceOfSeller = await signer[0].getBalance()
      const transaction = await nftMarket.connect(signer[1]).buyNFT(tokenID, {value: price})
      const receipt = await transaction.wait()

      // 95% of the price should be added to the seller balance
      await new Promise((res) => setTimeout(res, 100))
      const newBalanceOfSeller = await signer[0].getBalance()
      const diff = newBalanceOfSeller.sub(oldBalanceOfSeller)
      expect(diff).to.equal(sellerProfit)

      // 5% of the price should be added to the contract balance
      const newBalanceOfContract = await nftMarket.provider.getBalance(nftMarket.address)
      const diffContracctBalance = newBalanceOfContract.sub(initialBalanceOfContract) 
      expect(diffContracctBalance).to.equal(fee)

      // NFT ownership should be trandfered to the buyer
      const newOwnerAddress = await nftMarket.ownerOf(tokenID)
      expect(newOwnerAddress).to.equal(signer[1].address)

      // NFTTransfer event has correct agrs
      const args = receipt.events[1].args
      expect(args.tokenID).to.equal(tokenID)
      expect(args.tokenURI).to.equal("")
      expect(args.to).to.equal(signer[1].address)
      expect(args.price).to.equal(0)
    })
  })

  describe("Cancel Listing", () => {
    it("Should revert if NFT not listed for sale", async () => {
      await expect(
        nftMarket.cancelListing(9999)
      ).to.be.revertedWith("NFTMarket: NFT not listed for sale")
    })

    it("Should revert if not the owner of the nft cancels list", async () => {
      const tokenID = await createNFTAndList(123);
      await expect(
        nftMarket.connect(signer[2]).cancelListing(tokenID)
      ).to.be.revertedWith("NFTMarket: You are not the owner of NFT")
    })

    it("Should cancels the listing of token if all requirements are fine", async () => {
      const tokenID = createNFTAndList(123)
      const transaction = await nftMarket.cancelListing(tokenID)
      const receipt = await transaction.wait()
      const args = receipt.events[1].args

      // Check OwnerShip gets back to the owner
      const owner = await nftMarket.ownerOf(tokenID)
      expect(owner).to.equal(signer[0].address)

      // Assert the NFTTransfer event has correct params
      // expect(args.tokenID).to.equal(tokenID);
      expect(args.to).to.equal(signer[0].address);
      expect(args.tokenURI).to.equal("");
      expect(args.price).to.equal(0);
    })
  })

  describe("Withdraw", () => {
    it("Should revert if called by not the owner of the coontract", async () => {
      await expect(
        nftMarket.connect(signer[2]).withdrawFunds()
      ).to.be.revertedWith("Ownable: caller is not the owner")
    })
    it("Should transfer the fee to the owner of the contract", async() => {
      const tokenID = await createNFTAndList(10)
      let transaction = await nftMarket.connect(signer[1]).buyNFT(tokenID, { value: 10})
      let receipt = await transaction.wait()
      await new Promise((r) => setTimeout(r, 100))

      const beforeContractBalance = await nftMarket.provider.getBalance(nftMarket.address)

      await new Promise((r) => setTimeout(r, 100))

      transaction = await nftMarket.withdrawFunds()
      receipt = transaction.wait()

      const thenContractBalance = await nftMarket.provider.getBalance(nftMarket.address)

      console.log(beforeContractBalance, "    ", thenContractBalance);

    })
  })
})




