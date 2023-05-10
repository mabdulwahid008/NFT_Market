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
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/buy'>Buy</NavLink>
                <NavLink to='/owned'>Owned</NavLink>
                <NavLink to='/create'>Create</NavLink>
            </div>
            <ConnectWallet/>
        </div>
    </div>
  )
}

export default Navbar
