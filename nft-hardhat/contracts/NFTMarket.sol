// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct NFTListing{
    uint256 price;
    address seller;
}

contract NFTMarket is ERC721URIStorage, Ownable{
    using SafeMath for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    mapping(uint256 => NFTListing) private _listings;
 
    constructor() ERC721("Muhammad Abdulwahid", "MAW") {}

    // if tokenURI is not an empty string => NFT created
    // if price is not 0 => NFT listed for sale
    // if price is 0 && tokenURI is empty => NFT transfered (either bought or cancel listing)
    event NFTTransfer(uint256 tokenID, address from, address to, string tokenURI, uint256 price, uint256 timeStamp);

    // Create NFT
    function createNFT(string calldata tokenURI) public{
        _tokenIDs.increment();
        uint256 currentID = _tokenIDs.current();
        _safeMint(msg.sender, currentID);
        _setTokenURI(currentID, tokenURI);

        emit NFTTransfer(currentID, address(0), msg.sender, tokenURI, 0, block.timestamp);
    }

    // List NFT
    function listNFT(uint256 tokenID, uint256 price) public {
        require(price > 0, "NFTMarket: Price must be greater than 0");
        transferFrom(msg.sender, address(this), tokenID);
        _listings[tokenID] = NFTListing(price, msg.sender);

        emit NFTTransfer(tokenID, msg.sender, address(this), "", price, block.timestamp);
    }

    // Buy NFT
    function buyNFT(uint256 tokenID) public payable {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "NFTMarket: NFT not listed for sale");
        require(msg.value == listing.price, "NFTMarket: Price is incorrect");
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenID);
        payable(listing.seller).transfer(listing.price.mul(95).div(100)); // price * 95 / 100; deducting 5% of the price as fee
        clearListing(tokenID);

        emit NFTTransfer(tokenID, address(this), msg.sender, "", 0, block.timestamp);
    }

    // Cancel Listing
    function cancelListing(uint256 tokenID) public {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "NFTMarket: NFT not listed for sale");
        require(listing.seller == msg.sender, "NFTMarket: You are not the owner of NFT");
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenID);
        clearListing(tokenID);
        
        emit NFTTransfer(tokenID, address(this), msg.sender, "", 0, block.timestamp);
    }

    // Clear Lisiting from struct
    function clearListing(uint256 tokenID) private {
        _listings[tokenID].price = 0;
        _listings[tokenID].seller = address(0);
    }

    // Withdraw funds
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "NNFTMarket: Balance is 0");
        payable(owner()).transfer(balance);
    }
}