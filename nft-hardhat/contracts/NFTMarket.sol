// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

struct NFTListing{
    uint256 price;
    address seller;
}

contract NFTMarket is ERC721URIStorage{
    using SafeMather for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    mapping(unit256 => NFTListing) private _listings;
 
    constructor() ERC721("Muhammad Abdulwahid", "MAW") {}


    // Create NFT
    function createNFT(string calldata tokenURI) public{
        _tokenIDs.increment();
        uint256 currentID = _tokenIDs.current();
        _safeMint(msg.sender, currentID);
        _setTokenURI(currentID, tokenURI);
    }

    // List NFT
    function listNFT(unit256 tokenID, unit256 price) public {
        // require(ownerOf(tokenID) == msg.sender, "NFTMarket: You are not the owner of NFT");
        require(price > 0, 'NFTMarket: Price must be greater than 0');
        approve(address(this), tokenID);
        transferFrom(msg.sender, address(this), tokenID);
        _listings[tokenID] = NFTListing(price, msg.sender);
    }

    // Buy NFT
    function buyNFT(uint256 tokenID) public payable {
        NFTListing memory listing = _listings[tokenID];
        require(listing.price > 0, "NFTMarket: NFT not listed for sale");
        require(msg.value == listing.price, "NFTMarket: Price is incorrect");
        transferFrom(address(this), msg.sender, tokenID);
        payable(msf.sender.transfer(listing.price.mul(95).div(100)));
        // payable(listing.address.transfer(listing.price.mul(95).div(100))); // price * 95 / 100; deducting 5% of the price as fee
    }

    // Cancel List
    function cancelList(uint256 tokenID) public {
        
    }
}