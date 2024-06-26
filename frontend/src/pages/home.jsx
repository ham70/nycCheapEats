import React from 'react'
import SearchBar from '../components/searchbar'

const Home = () => {
  return (
    <div className='Home'>
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

