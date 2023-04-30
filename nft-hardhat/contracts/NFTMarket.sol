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
    using SafeMather for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    mapping(unit256 => NFTListing) private _listings;
 
    constructor() ERC721("Muhammad Abdulwahid", "MAW") {}

    // if tokenURI is not an empty string => NFT created
    // if price is not 0 => NFT listed for sale
    // if price is 0 && tokenURI is empty => NFT transfered (either bought or cancel listing)
    event NFTTransfer(uint256 tokenID, address to, string tokenURI, uint256 price);

    // Create NFT
    function createNFT(string calldata tokenURI) public{
        _tokenIDs.increment();
        uint256 currentID = _tokenIDs.current();
        _safeMint(msg.sender, currentID);
        _setTokenURI(currentID, tokenURI);

        emit NFTTransfer(currentID, msg.sender, tokenURI, 0);
    }

    // List NFT
    function listNFT(unit256 tokenID, unit256 price) public {
        // require(ownerOf(tokenID) == msg.sender, "NFTMarket: You are not the owner of NFT");
        require(price > 0, 'NFTMarket: Price must be greater than 0');
        approve(address(this), tokenID);
        transferFrom(msg.sender, address(this), tokenID);
        _listings[tokenID] = NFTListing(price, msg.sender);

        emit NFTTransfer(tokenID, address(this), "", price);
    }

    // Buy NFT
    function buyNFT(uint256 tokenID) public payable {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "NFTMarket: NFT not listed for sale");
        require(msg.value == listing.price, "NFTMarket: Price is incorrect");
        transferFrom(address(this), msg.sender, tokenID);
        payable(msf.sender.transfer(listing.price.mul(95).div(100)));
        // payable(listing.address.transfer(listing.price.mul(95).div(100))); // price * 95 / 100; deducting 5% of the price as fee
        clearListing(tokenID);

        emit NFTTransfer(tokenID, msg.sender, "", 0);
    }

    // Cancel Listing
    function cancelListing(uint256 tokenID) public {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "NFTMarket: NFT not listed for sale");
        require(listing.address == msg.sender, "NFTMarket: You are not the owner of NFT");
        transferFrom(address(this), msg.sender, tokenID);
        clearListing(tokenID);
        
        emit NFTTransfer(tokenID, msg.sender, "", 0);
    }

    // Clear Lisiting from struct
    function clearListing(uint256 tokenID) private {
        _listings[tokenID].price = 0;
        _listings[tokenID].address = address(0);
    }

    // Withdraw funds
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "NNFTMarket: Balance is 0");
        payable(owner()).transfer(balance);
    }
}