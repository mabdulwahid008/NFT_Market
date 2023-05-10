export const minifyAddress = (address) => {
    const start = address.substr(0, 5)
    const end = address.substr(address.length - 3)
    return `${start}...${end}`
}