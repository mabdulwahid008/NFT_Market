import React, { useContext, useEffect, useState } from 'react'
import { extractTokenURI } from '../../utills';
import './ViewNFT.css'
import { Contract, utils } from 'ethers';
import { SignerContext } from '../../state/signer';
import { NFT_MARKET_CONTRACT_ABI, NFT_MARKET_CONTRACT_ADDRESS } from '../../constants/index';

function ViewNFT({ nft }) {
    const { signer, address } = useContext(SignerContext)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [listPrice, setListPrice] = useState(0)

   const getData = async()=>{
    const Data = await extractTokenURI(nft.tokenURI);
    setData(Data)
   }

   const buy = async() => {
    setLoading(true)
    const contract = new Contract(
        NFT_MARKET_CONTRACT_ADDRESS,
        NFT_MARKET_CONTRACT_ABI,
        signer
    )
    try {
        const transaction = await contract.buyNFT(nft.tokenID, {value: nft.price})
        const receipt = await transaction.wait()
        window.alert('You successfully bought NFT')
    } catch (error) {
        window.alert(error.message)
        console.log(error);
    }
    setLoading(false)
   }

   const cancelList = async() => {
    setLoading(true)
    const contract = new Contract(
        NFT_MARKET_CONTRACT_ADDRESS,
        NFT_MARKET_CONTRACT_ABI,
        signer
    )
    try {
        const transaction = await contract.cancelListing(nft.tokenID)
        const receipt = await transaction.wait()
        window.alert('NFT removed from listings for sale')
    } catch (error) {
        window.alert(error.message)
        console.log(error);
    }
    setLoading(false)
   }

   const listNFT = async() => {
    setLoading(true)
    const contract = new Contract(
        NFT_MARKET_CONTRACT_ADDRESS,
        NFT_MARKET_CONTRACT_ABI,
        signer
    )
    try {
        const transaction = await contract.listNFT(nft.tokenID, utils.parseEther(listPrice))
        const receipt = await transaction.wait()
        window.alert("NFT listed for sale")
    } catch (error) {
        window.alert(error.message)
        console.log(error);
    }
    setLoading(false)
   }

   useEffect(()=>{
    getData()
   },[])
  return (
    <div className='container'>
        <div className='view-nft'>
            <img src={data?.image}/>
            <div>
                <div>
                    <div>
                        <label>Name</label>
                        <input type='text' defaultValue={data?.name} id='name' name='name' readOnly/>
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea name='description' id='description' defaultValue={data?.description} readOnly></textarea>
                    </div>
                </div>
                <div>
                    <input type='checkbox' id='list'/>
                    <label for="list">NFT Listing</label>
                    <div className='list'>
                        {nft.price == 0 ? <>
                            <input type='numbrt' placeholder='Enter Prce in eth' onChange={(e)=> setListPrice(e.target.value)}/>
                            <button className='btn' onClick={listNFT} disabled={loading? true : false}>{loading? 'Please Wait' :'List for Sale'}</button>
                            </>
                            :
                            <>
                            <p>You listed this NFT for {nft.price} ETH</p>
                            <button className='btn' onClick={cancelList} disabled={loading? true : false}>{loading? 'Please Wait' :'Cancel Listing'}</button>
                            </>}
                        {address?.toLowerCase() != nft.to.toLowerCase() && address?.toLowerCase() != nft.from.toLowerCase() && <>
                            <div>
                                <p>Nft listed for sale for {nft.price} ETH</p>
                                <p>Owner: {nft.from}</p>
                                <button className='btn'onClick={buy} disabled={loading? true : false}>{loading? 'Please Wait' :'Buy'}</button>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewNFT
