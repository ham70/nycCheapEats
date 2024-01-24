import React from 'react'
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='homeBttn'>
        <Link to="/">Home</Link>
      </div>
      <div className='links'>
        <Link to="/about">About</Link>
      </div>
    </div>
  )
}

export default Navbar