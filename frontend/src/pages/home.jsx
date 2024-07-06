import React from 'react'
import SearchBar from '../components/searchbar'
import logo from '../assets/NYC_Cheap_Eats_logo.png' 

//
const Home = () => {
  return (
    <div className='Home'>
      <img src={logo} alt='App logo'/>
      <div className='header-text'>
        <h1>Welcome to NYC CHEAP EATS</h1>
      </div>
      <div className='search-bar'>
        <SearchBar/>
      </div>
    </div>
  )
}

export default Home