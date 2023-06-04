export const minifyAddress = (address) => {
    const start = address.substr(0, 5)
    const end = address.substr(address.length - 3)
    return `${start}...${end}`
}

export const extractTokenURI = async(URI) => {
    if(!URI.startsWith('ipfs://'))
        return [null, null, null]
    
    URI = URI.replace('ipfs://', '')

    const response = await fetch(`https://ipfs.io/ipfs/${URI}`,{
        method:'GET'
    })
    if(response.status === 200){
        const res = await response.json()
        const image = `https://ipfs.io/ipfs/${res.image.replace('ipfs://', '')}`
        return {
            name: res.name, 
            description : res.description, 
            image
        }
    }
    else
        return [null, null, null]

}
