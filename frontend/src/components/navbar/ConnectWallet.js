import React, { useContext } from 'react'
import { SignerContext } from '../../state/signer'
import Avatar from '../avatar/Avatar'

function ConnectWallet() {
  const { address, loading, connectWallet} = useContext(SignerContext)

  if(address) 
    return <Avatar address={address}/>
  return (
    <button className='connect-btn' onClick={connectWallet}>{loading ? "Connecting" : "Connect Wallet"}</button> 
  )
}

export default ConnectWallet
