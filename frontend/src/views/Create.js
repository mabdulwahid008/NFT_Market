import React, { useContext } from 'react'
import CreateForm from '../components/createForm/CreateForm'
import { SignerContext } from '../state/signer'
import ConnectWallet from '../components/navbar/ConnectWallet'

function Create() {
  const {address} = useContext(SignerContext)
  
  if(!address)
  return <div style={{display:'flex', justifyContent: 'center', alignItems:'center', height:'100vh'}}>
    <ConnectWallet />
  </div>

  return (
    <CreateForm />
  )
}

export default Create
