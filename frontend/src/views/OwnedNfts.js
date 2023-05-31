import { useQuery, gql } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react'
import  {client}  from '../utills/client'
import NFTItem from '../components/NFTItem/NFTItem';
import '../components/NFTItem/NFTItem.css'
import { SignerContext } from '../state/signer';
import ConnectWallet from '../components/navbar/ConnectWallet';

function OwnedNfts() {
    const { address } = useContext(SignerContext)
    const [refienedData, setRefienedData] = useState(null)
    const GET_NFT_TRANSFERS = gql`
        query {
            nfttransfers(orderBy: timeStamp, orderDirection: desc,) {
            id
            tokenID
            from
            to
            tokenURI
            price
            timeStamp
            }
        }
        `;
        const { loading, error, data } = useQuery(GET_NFT_TRANSFERS, { client });


    const refieneDate = () => {
        if(!data)
            return;
        let Data = []
        const allEvents = data?.nfttransfers

        // 1. need to filter events where 'to' or 'from' === address (conneccted user)
        //      a). 'to' means token is directly belong to address
        //      b). 'from' means token belongs to address via contract
        const ownedEvents = data?.nfttransfers.filter((event) => (event.to.toLowerCase() === address?.toLowerCase() || event.from.toLowerCase() === address?.toLowerCase()))

       


        // 2. Then filter the events of same tokenID
        for (let i = 0; i < ownedEvents.length; i++) {
            const owendEventsOfSameTokenID = ownedEvents.filter((event) => event.tokenID === ownedEvents[0].tokenID)
            const allEventsOfSameTokenID = allEvents.filter((event) => event.tokenID === ownedEvents[0].tokenID)
            // console.log(owendEventsOfSameTokenID);
            // console.log(allEventsOfSameTokenID);
            if(allEventsOfSameTokenID[0].timeStamp > owendEventsOfSameTokenID[0].timeStamp){
                continue;
            }
            // 3. then pushing latest event of tokenID
                // check before pushing that this event is already in array 
            const check = Data.some((event) => event = owendEventsOfSameTokenID[0])
            if(!check)
                Data.push(owendEventsOfSameTokenID[0])
        }
        console.log(Data);
        // 4. thats refiend data
        setRefienedData(Data)


    }

    useEffect(()=>{
        refieneDate()
    }, [data])
        
    if(address){
        if (loading) 
            return <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>Loading...</div>

        return (
            <div className='owned'>
            {refienedData?.length === 0 && <div style={{display:'flex', justifyContent: 'center', alignItems:'center'}}>No NFTs minted </div>}
            {refienedData?.map((nft)=>{
                return <NFTItem nft={nft} key={nft.id} link="/nft/view"/>
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
