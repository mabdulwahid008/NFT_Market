import React, { useContext, useEffect, useState } from 'react'
import { SignerContext } from '../../state/signer'
import { NFT_MARKET_CONTRACT_ABI, NFT_MARKET_CONTRACT_ADDRESS } from '../../constants'
import { Contract, utils } from 'ethers'
import { extractTokenURI } from '../../utills'

function BuyNFT({nft}) {
    const { signer, address, refreash, setRefreash } = useContext(SignerContext)

    
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    

    const getData = async()=>{
        const Data = await extractTokenURI(nft.tokenURI);
        setData(Data)
    }

    useEffect(()=>{
        getData()
    },[])

    const buy = async() => {
        setLoading(true)
        const contract = new Contract(
            NFT_MARKET_CONTRACT_ADDRESS,
            NFT_MARKET_CONTRACT_ABI,
            signer
        )
        try {
            const transaction = await contract.buyNFT(nft.tokenID, {value: nft.price}) // nft.price is in wei
            const receipt = await transaction.wait()
            setRefreash(!refreash)
            window.alert('You successfully bought NFT')
        } catch (error) {
            window.alert(error.message)
            console.log(error);
        }
        setLoading(false)
       }
       
       useEffect(()=>{
        if(address?.toLowerCase() == nft.from.toLowerCase()){
            setDisabled(true)
        }
       }, [address])

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
                        <div>
                            <p>Nft listed for sale for {utils.formatEther(nft.price)} ETH</p>
                            <p>Owner: {nft.from}</p>
                            {!disabled && <button id='btn' className='btn'onClick={buy} disabled={loading? true : false}>{loading? 'Please Wait' :'Buy'}</button>}
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default BuyNFT
