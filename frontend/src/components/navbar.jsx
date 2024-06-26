import React from 'react'
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='homeBttn'>
        <Link to="/">Home</Link>
      </div>
      <div className='useBttn'>
        <Link to="/how-to-use">How To Use</Link>
      </div>
      <div className='aboutBttn'>
        <Link to="/about">About</Link>
      </div>
    </div>
  )
}

export default Navbar