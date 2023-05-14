import React, { useEffect, useState } from 'react'
import { extractTokenURI } from '../../utills'

function NFTItem( { tokenURI } ) {
    const [data, setData] = useState(null)

   const getData = async()=>{
    const Data = await extractTokenURI(tokenURI);
    setData(Data)
   }

   useEffect(()=>{
    getData()
   },[])

if(data)
  return (
    <>
    <div className='nft-item'>
      <img src={data.image}/>
      <div>
        <h3>{data.name}</h3>
        <p>{data.description?.length > 40 ? `${data.description.substr(0, 39)}...` : data.description}</p>
      </div>
      <button className='btn nft-view'>View</button>
    </div>
    </>
  )
}

export default NFTItem
