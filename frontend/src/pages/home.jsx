import React from 'react'
import SearchBar from '../components/searchbar'
import logo from '../assets/nycCheapEats_logo500x500.png' 

//
const Home = () => {
  return (
    <div className='Home'>
      <img className = 'logoImg' src={logo} alt='App logo'/>
      <div className='header-text'>
        <h2>Welcome! Search by: location, cuisine, and more!</h2>
      </div>
      <div className='search-bar'>
        <SearchBar/>
      </div>
    </div>
  )
}

export default Home