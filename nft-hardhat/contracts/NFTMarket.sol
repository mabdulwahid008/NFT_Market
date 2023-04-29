// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    constructor() ERC721("Muhammad Abdulwahid", "MAW") {}


    function mint1(string calldata tokenURI) public returns(uint256){
        _tokenIDs.increment();
        uint256 currentID = _tokenIDs.current();
        _safeMint(msg.sender, currentID);
        _setTokenURI(currentID, tokenURI);
        return currentID;
    }

}