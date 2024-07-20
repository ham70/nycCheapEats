import React from 'react'
import Searchresults from '../components/searchresults.jsx'
import SearchBar from '../components/searchbar.jsx'

const Search = () => {
  return (
    <div>
      <SearchBar/>
      <div>
        <Searchresults/>
      </div>
      <div className='footer' />
    </div>
  )
}

export default Search
