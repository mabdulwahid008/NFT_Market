import { useQuery, gql } from '@apollo/client';
import React, { useContext } from 'react'
import  {client}  from '../utills/client'
import NFTItem from '../components/NFTItem/NFTItem';
import '../components/NFTItem/NFTItem.css'
import { SignerContext } from '../state/signer';
import ConnectWallet from '../components/navbar/ConnectWallet';

function OwnedNfts() {
    const { address } = useContext(SignerContext)
    const GET_NFT_TRANSFERS = gql`
        query {
            nfttransfers(where: {to:"${address}"}, first: 5) {
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
    {!data && <ConnectWallet/>}
    {data?.nfttransfers.length === 0 && <p>No NFTs minted </p>}
    {data?.nfttransfers.map((nft)=>{
        return <NFTItem tokenURI={nft.tokenURI} key={nft.id}/>
    })}
    </div>
  )
}

export default OwnedNfts
