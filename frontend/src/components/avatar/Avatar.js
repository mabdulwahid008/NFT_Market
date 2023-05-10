import React, { useMemo } from 'react'
import { minifyAddress } from '../../utills'
import Blockies from 'react-blockies';

function Avatar({ address }) {

    const shortAddress = useMemo(()=>minifyAddress(address), [address])
  return (
    <div style={{display:'flex', gap:5, alignItems:'flex-end'}}>
      <Blockies seed= {address.toLowerCase()} scale={3} />
      <p style={{color:'#fff', fontSize:12}}>{shortAddress}</p>
    </div>
  )
}

export default Avatar
