import React, { useEffect, useState } from 'react'
import { extractTokenURI } from '../../utills'
import { Link } from 'react-router-dom'

function NFTItem( { nft } ) {
    const [data, setData] = useState(null)

   const getData = async()=>{
    const Data = await extractTokenURI(nft.tokenURI);
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
      <Link to={`/nft/view/${nft.id}`}><button className='btn nft-view'>View</button></Link>
    </div>
    </>
  )
}

export default NFTItem
