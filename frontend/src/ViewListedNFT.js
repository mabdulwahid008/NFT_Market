import React from 'react'
import { useParams } from 'react-router-dom'
import  {client}  from './utills/client'
import { gql, useQuery } from '@apollo/client';
import BuyNFT from './components/buyNFT/BuyNFT';

function ViewListedNFT() {
    const {id} = useParams()
    const GET_NFT_TRANSFERS = gql`
    query {
        nfttransfers(where: {tokenID:"${id}"}, orderBy: timeStamp, orderDirection: desc, first: 1) {
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
    if(loading){
        return <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>Loading...</div>
    }
    if(data)
    return (
        <BuyNFT nft = {data?.nfttransfers[0]}/>
    )
}

export default ViewListedNFT
