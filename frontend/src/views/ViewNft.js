import React from 'react'
import { useParams } from 'react-router-dom'
import  {client}  from '../utills/client'
import { gql, useQuery } from '@apollo/client';
import ViewNFT from '../components/ViewNFT/ViewNFT';

function ViewNft() {
    const {id} = useParams()
    const GET_NFT_TRANSFERS = gql`
    query {
        nfttransfers(where: {id:"${id}"}) {
        id
        tokenID
        from
        to
        tokenURI
        }
    }
    `;
    const { loading, error, data } = useQuery(GET_NFT_TRANSFERS, { client });
    if(loading){
        return <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>Loading...</div>
    }
    if(data)
    return (
        <ViewNFT nft = {data?.nfttransfers[0]}/>
    )
}

export default ViewNft
