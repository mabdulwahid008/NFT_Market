import React, { useState } from 'react'
import './CreateForm.css'
import img from '../../images/default.png'

function CreateForm() {
    const [image, setImage] = useState(img)
    const [nftData, setNftData] = useState({image: null, name:'', description:''})

    const handleImage = async ( e ) => {
        nftData.image = e.target.files[0]
        const base64 = await convertBase64(e.target.files[0])
        setImage(base64)
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

  return (
    <div className='container'>
      <h2>Create NFT</h2>
      <form className='create-form'>
        <span>
        <img src={image} onClick={()=>{ document.getElementById('img').click() }} />
        <input id='img' required type='file' accept='image/jpg,image/png,image/jpeg' style={{width:50}} onChange={handleImage}/>
        </span>
        <div>
            <div>
                <label>Name</label>
                <input type='text' required />
            </div>
            <div>
                <label>Description</label>
                <textarea></textarea>
            </div>
            <div>
                <button className='btn'>Create NFT</button>
            </div>
        </div>
      </form>
    </div>
  )
}

export default CreateForm
