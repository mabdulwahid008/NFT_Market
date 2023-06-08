import React, { useContext, useState } from 'react'
import './CreateForm.css'
import img from '../../images/default.png'
import { Contract } from 'ethers'
import { NFT_MARKET_CONTRACT_ABI, NFT_MARKET_CONTRACT_ADDRESS } from '../../constants'
import { SignerContext } from '../../state/signer'

function CreateForm() {
    const { signer } = useContext(SignerContext)
    const [image, setImage] = useState(img)
    const [nftData, setNftData] = useState({image: null, name:'', description:''})
    const [loading, setLoading] = useState(false)

    const handleImage = async ( e ) => {
        nftData.image = e.target.files[0]
        const base64 = await convertBase64(e.target.files[0])
        setImage(base64)
    }

    const onChange = ( e ) => {
        setNftData({...nftData, [e.target.name]: e.target.value})
    }

    const convertBase64 = (file)=>{
        return new Promise((resolve, reject)=>{
            const reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload =()=>{
                resolve(reader.result)
            }
        })
    }

    const uploadToIPFS = async () => {
        const data = new FormData()
        data.append('name', nftData.name)
        data.append('description', nftData.description)
        data.append('image', nftData.image)

        const response = await fetch('/upload', {
            method:'POST',
            body: data
        })
        const res = await response.json()
        if(response.status === 201){
            return res.uri;
        }
        else
            console.log(res.error);
        return null;
    }

    const createNFT = async ( e ) => {
        e.preventDefault()
        setLoading(true)
        const URI = await uploadToIPFS()
        if(URI){
            console.log(URI);
            const contract = new Contract(
                NFT_MARKET_CONTRACT_ADDRESS,
                NFT_MARKET_CONTRACT_ABI,
                signer
            )
            const transaction = await contract.createNFT(URI)
            await transaction.wait()
            alert('NFT Created')
            setNftData({image: null, name:'', description:''})
            setImage(img)
            document.getElementById('name').value = ''
            document.getElementById('description').value = ''
        }
        setLoading(false)
    }

  return (
    <div className='container'>
      <h2>Create NFT</h2>
      <form className='create-form' onSubmit={createNFT}>
        <span>
        <img src={image} onClick={()=>{ document.getElementById('img').click() }} />
        <input id='img' required type='file' accept='image/jpg,image/png,image/jpeg' style={{width:50}} onChange={handleImage}/>
        </span>
        <div>
            <div>
                <label>Name</label>
                <input type='text' defaultValue={nftData.name} id='name' name='name' required onChange={onChange}/>
            </div>
            <div>
                <label>Description</label>
                <textarea name='description' id='description' defaultValue={nftData.description} onChange={onChange}></textarea>
            </div>
            <div>
                <button className='btn' disabled={loading? true : false}>{loading? 'Please Wait' : "Create NFT"}</button>
            </div>
        </div>
      </form>
    </div>
  )
}

export default CreateForm
