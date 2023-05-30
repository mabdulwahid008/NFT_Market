import { useQuery, gql } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react'
import  {client}  from '../utills/client'
import NFTItem from '../components/NFTItem/NFTItem';
import '../components/NFTItem/NFTItem.css'
import { NFT_MARKET_CONTRACT_ADDRESS } from '../constants';

function BuyNFTs() {
    const [refinedData, setRefienedData] = useState(null)
    const GET_NFT_TRANSFERS = gql`
        query {
            nfttransfers(orderBy: timeStamp, orderDirection: desc) {
            id
            tokenID
            from
            to
            price
            tokenURI
            timeStamp
            }
        }
        `;
    const { loading, error, data } = useQuery(GET_NFT_TRANSFERS, { client });

    const refineData = () => {
        if(!data)
            return null;
        let Data = []
        const allEvents = data?.nfttransfers
        const eventListedForSale = data?.nfttransfers.filter((event) => event.to.toLowerCase() === NFT_MARKET_CONTRACT_ADDRESS.toLowerCase())
        // filtering events of smae TokenID
        for (let i = 0; i < eventListedForSale.length; i++) {
            const eventsWithSameTokrnID = data.nfttransfers.filter((event) => event.tokenID === eventListedForSale[i].tokenID)
            const check = Data?.some((event) => event === eventsWithSameTokrnID[0])
            if(!check)
                Data.push(eventsWithSameTokrnID[0])
        }
        let listed = []
        // check if that token gets bhought or canceled from listing
        for (let i = 0; i < Data.length; i++) {
            const events = allEvents.filter((data) => data.tokenID === Data[i].tokenID)
            if(events[0].price != 0){
                const check = listed?.some((event) => event === events[0])
                if(!check)
                    listed.push(events[0])
            }
        }
        console.log(listed);
        setRefienedData(listed)
    }

    useEffect(()=>{
        refineData()
    }, [data])        

    if (loading) 
        return <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height: 500}}>Loading...</div>
    if(refinedData?.length === 0)
        return <div style={{display:'flex', justifyContent: 'center', alignItems:'center',height: 500}}>No NFTs listed for sale </div>

    return (
        <div className='owned'>
        {refinedData?.map((nft)=>{
            return <NFTItem nft={nft} key={nft.id}/>
        })}
        </div>
    )
}


export default BuyNFTs
