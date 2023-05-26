import { useQuery, gql } from '@apollo/client';
import React, { useContext, useEffect } from 'react'
import  {client}  from '../utills/client'
import NFTItem from '../components/NFTItem/NFTItem';
import '../components/NFTItem/NFTItem.css'
import { SignerContext } from '../state/signer';
import ConnectWallet from '../components/navbar/ConnectWallet';

function OwnedNfts() {
    const { address } = useContext(SignerContext)
    const GET_NFT_TRANSFERS = gql`
        query {
            nfttransfers(where: {to:"${address}"}) {
            id
            tokenID
            from
            to
            tokenURI
            price
            }
        }
        `;
        const { loading, error, data } = useQuery(GET_NFT_TRANSFERS, { client });

    useEffect(()=>{
        
    }, [data])
        
    if(address){
        if (loading) 
            return <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>Loading...</div>

        return (
            <div className='owned'>
            {!data && <ConnectWallet/>}
            {data?.nfttransfers.length === 0 && <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>No NFTs minted </div>}
            {data?.nfttransfers.map((nft)=>{
                return <NFTItem nft={nft} key={nft.id}/>
            })}
            </div>
        )
    }
    else
        return(
            <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>
                <ConnectWallet />
            </div>
        )
}

export default OwnedNfts
