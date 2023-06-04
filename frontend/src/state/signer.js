import { createContext, useContext, useEffect, useRef, useState } from "react";
import Web3Modal from 'web3modal'
import { providers } from 'ethers'
import { client } from '../utills/client'
import { NFT_MARKET_CONTRACT_ADDRESS } from '../constants/index'
import { useQuery, gql } from '@apollo/client';

export const SignerContext = createContext()

 
const SignerProvider = (props) => {

    const [signer, setSigner] = useState()
    const [address, setAddress] = useState()
    const [loading, setLoading] = useState(false)
    const [refreash, setRefreash] =  useState(false)
    const [allevents, setAllevents] =  useState(null)
    const [tokenHistory, setTokenhistory] =  useState(null)


    const connectWallet = async () => {
        setLoading(true)
        try{
            const web3modal = new Web3Modal({
                network: "sepolia",
                disableInjectedProvider: false
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
            setSigner(signer)
        } catch (err){
            console.log(err);
        }
        setLoading(false)
    }

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
    const { data } = useQuery(GET_NFT_TRANSFERS, { client });

    const getHistory = (id) => {
        // getting data of specidied tokenID
        const eventsoFId = allevents?.filter((event)=> event.tokenID === id)

        let history = []
        // just refining data which is conserned 
        for (let i = eventsoFId?.length-1; i >= 0 ; i--) {
            let obj = {
                to : eventsoFId[i].to,
                from : eventsoFId[i].from,
                timeStamp: eventsoFId[i].timeStamp
            }
            history.push(obj)
        }

        // filter data for which token setted up for sale, just removng when contract owns the token
        history = history?.filter((event) => event.to?.toLowerCase() !== NFT_MARKET_CONTRACT_ADDRESS?.toLowerCase())

        // now refining further if user seted up for lisitng and then canceled
        let refined = [history[0]]
        for (let i = 0; i < history?.length; i++) {
            if(history[i]?.from.toLocaleLowerCase() === NFT_MARKET_CONTRACT_ADDRESS.toLocaleLowerCase()){
                if(history[i]?.to === history[i+1]?.to)
                    continue
                if(history[i+1]){
                    let obj = {
                        from : history[i]?.to,
                        to : history[i+1]?.to,
                        timeStamp : history[i+1]?.timeStamp,
                    }
                    refined.push(obj)
                }
            }
        }
        setTokenhistory(refined);
    }

    useEffect(()=>{
        if(data)
            setAllevents(data.nfttransfers)
    }, [data])

    const contextValues = { signer, address, loading, connectWallet, refreash, setRefreash, getHistory, tokenHistory}

    return <SignerContext.Provider value={contextValues}>
            {props.children}
    </SignerContext.Provider>
}

export default SignerProvider


