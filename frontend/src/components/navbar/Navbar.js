import React from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'
import ConnectWallet from './ConnectWallet'

function Navbar() {
  return (
    <div className='navbar'>
        <div>
            <h1 className='logo'>NFT Market</h1>
            <div className='nav'>
                <NavLink>Home</NavLink>
                <NavLink>Buy</NavLink>
                <NavLink>Owned</NavLink>
            </div>
            <ConnectWallet/>
        </div>
    </div>
  )
}

export default Navbar
