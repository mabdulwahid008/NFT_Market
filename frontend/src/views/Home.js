import React from 'react'

function Home() {
  return (
    <div style={{padding:'100px 100px'}}>
      <div>
            <h2 style={{marginBottom:5, color: '#00706F'}}>Hi There!</h2>
            <p  style={{marginBottom:20}}>Thanks for taking time to go through my project.</p>
            <p>This Project is developed for mininting, listing and buying NFTs. It shows who minted and transfership history of NFT token.</p>
            <p>The Smart Contract depolyed and verfied on Sepolia testnet of Ethereum Blockchain, <a target="BLANK" href="https://sepolia.etherscan.io/address/0x4a7D0c556CfE3251b994e076a2F156765bCEBb28#code" style={{fontSize:12, color: '#00706F'}}>Contract Address: 0x4a7D0c556CfE3251b994e076a2F156765bCEBb28</a></p>
            <div style={{padding: '10px 0px'}}>
              <p>Project Stack</p>
                <ul style={{padding: '10px 40px'}}>
                  <li>Solidity - for Smart Contract</li>
                  <li>IPFS - for metadata</li>
                  <li>GraphQL - for fetching events</li>
                  <li>React JS - for frontend</li>
                </ul>
            </div>
          <p>I didn't paid attention to designing but to the working of dAPP</p>
      </div>
    </div>
  )
}

export default Home
