import { createContext, useContext, useEffect, useRef, useState } from "react";
import Web3Modal from 'web3modal'
import { providers } from 'ethers'

export const SignerContext = createContext()

 
const SignerProvider = (props) => {

    const [signer, setSigner] = useState()
    const [address, setAddress] = useState()
    const [loading, setLoading] = useState(false)

    const connectWallet = async () => {
        setLoading(true)
        try{
            const web3modal = new Web3Modal({
                network: 'sepolia',
                providerOptions: {},
                disableInjectedProvider: false,
            })
            const instance = await web3modal.connect()
            const provider = new providers.Web3Provider(instance)

            const { chainId } = await provider.getNetwork();

            if(chainId !== 11155111){
                setLoading(false)
                window.alert("Change Network to Sepolia")
                throw new Error("Change Network to Sepolia")
            }
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            setAddress(address)
        } catch (err){
            console.log(err);
        }
        setLoading(false)
    }


    const contextValues = { signer, address, loading, connectWallet }

    return <SignerContext.Provider value={contextValues}>
            {props.children}
    </SignerContext.Provider>
}

export default SignerProvider


