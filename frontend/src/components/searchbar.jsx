import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleChange = event => {
        setSearchTerm(event.target.value)
    }

    const handleSearchSubmit = async () => {
        if(searchTerm != ""){
            navigate(`/search/${searchTerm}`)
        }

    }

    return (
        <div className='search-bar'>
            <input
                type="text"
                placeholder="enter keyword(s)"
                value={searchTerm}
                onChange={handleChange}
            />
            <button onClick={handleSearchSubmit}>search</button>
        </div>

    )
}

export default SearchBar