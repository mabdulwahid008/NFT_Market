import React, { useContext, useEffect, useState } from 'react'
import { extractTokenURI, minifyAddress } from '../../utills';
import './ViewNFT.css'
import { Contract, utils } from 'ethers';
import { SignerContext } from '../../state/signer';
import { NFT_MARKET_CONTRACT_ABI, NFT_MARKET_CONTRACT_ADDRESS } from '../../constants/index';

function ViewNFT({ nft }) {
    const { signer, address, refreash, setRefreash, getHistory, tokenHistory } = useContext(SignerContext)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [listPrice, setListPrice] = useState(0)

   const getData = async()=>{
    const Data = await extractTokenURI(nft.tokenURI);
    setData(Data)
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
        setRefreash(!refreash)
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
        setRefreash(!refreash)
        window.alert("NFT listed for sale")
    } catch (error) {
        window.alert(error.message)
        console.log(error);
    }
    setLoading(false)
   }

   setInterval(()=> {
    if(!tokenHistory)
        getHistory(nft.tokenID)
    }
    ,100)

   useEffect(()=>{
        getData()
        
   },[tokenHistory, address])

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
                {address && <div style={{marginTop:-10}}>
                    <input type='checkbox' id='list'/>
                    <label htmlFor="list">NFT Listing</label>
                    <div className='list'>
                        {nft.price == 0 ? 
                            <>
                                <input type='numbrt' placeholder='Enter Prce in eth' onChange={(e)=> setListPrice(e.target.value)}/>
                                <button className='btn' onClick={listNFT} disabled={loading? true : false}>{loading? 'Please Wait' :'List for Sale'}</button>
                            </>
                            :
                            <>
                                <p>You listed this NFT for {utils.formatEther(nft.price)} ETH</p>
                                <button className='btn' onClick={cancelList} disabled={loading? true : false}>{loading? 'Please Wait' :'Cancel Listing'}</button>
                            </>
                        }
                    </div>
                </div>}
                <div style={{marginTop:20}}>
                    <label>History</label>
                    <table>
                        <tr>
                            <th>To</th>
                            <th>From</th>
                            <th>Date</th>
                        </tr>
                        {tokenHistory?.map((history)=> {
                            return <tr>
                                <td>{minifyAddress(history?.to)}</td>
                                <td>{minifyAddress(history?.from)}</td>
                                <td>{new Date(history?.timeStamp * 1000).toLocaleString()}</td>
                            </tr>
                        })}
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewNFT
