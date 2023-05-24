import React, { useContext, useEffect, useState } from 'react'
import { extractTokenURI } from '../../utills';
import './ViewNFT.css'
import { Contract, utils } from 'ethers';
import { SignerContext } from '../../state/signer';
import { NFT_MARKET_CONTRACT_ABI, NFT_MARKET_CONTRACT_ADDRESS } from '../../constants/index';

function ViewNFT({ nft }) {
    const { signer } = useContext(SignerContext)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [listPrice, setListPrice] = useState(0)


   const getData = async()=>{
    const Data = await extractTokenURI(nft.tokenURI);
    setData(Data)
   }

   const listNFT = async() => {
    setLoading(true)
    const contract = new Contract(
        NFT_MARKET_CONTRACT_ADDRESS,
        NFT_MARKET_CONTRACT_ABI,
        signer
    )
    try {
        const transaction = await contract.listNFT(nft.tokenID, parseInt(listPrice))
        const receipt = await transaction.wait()
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
                    <label for="list">List Nft for selling</label>
                    <div className='list'>
                          <input type='numbrt' placeholder='Enter Prce in eth' onChange={(e)=> setListPrice(e.target.value)}/>
                          <button className='btn' onClick={listNFT} disabled={loading? true : false}>{loading? 'Please Wait' :'List for Sale'}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewNFT
