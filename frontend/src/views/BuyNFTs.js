import { useQuery, gql } from '@apollo/client';
import React, { useContext } from 'react'
import  {client}  from '../utills/client'
import NFTItem from '../components/NFTItem/NFTItem';
import '../components/NFTItem/NFTItem.css'
import { SignerContext } from '../state/signer';
import ConnectWallet from '../components/navbar/ConnectWallet';
import { NFT_MARKET_CONTRACT_ADDRESS } from '../constants';

function BuyNFTs() {
    const GET_NFT_TRANSFERS = gql`
        query {
            nfttransfers(where: {to:"${NFT_MARKET_CONTRACT_ADDRESS}"}) {
            id
            tokenID
            from
            to
            tokenURI
            }
        }
        `;
        const { loading, error, data } = useQuery(GET_NFT_TRANSFERS, { client });
        
        if (loading) 
            return <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>Loading...</div>

        return (
            <div className='owned'>
            {data?.nfttransfers.length === 0 && <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>No NFTs listed for sale </div>}
            {data?.nfttransfers.map((nft)=>{
                return <NFTItem nft={nft} key={nft.id}/>
            })}
            </div>
        )
}


export default BuyNFTs
