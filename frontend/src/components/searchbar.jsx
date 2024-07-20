import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = () => {
    //state variable representing the search term or query the user searches
    const [searchTerm, setSearchTerm] = useState('')

    //we will use the useNavigate function to navigate to the prooper url when
    // someone makes a search
    const navigate = useNavigate()

    //whenever someone types something new in the search bar we will set that as
    // the search term
    const handleChange = event => {
        setSearchTerm(event.target.value)
    }

    //calling navigate when someone clicks the search button
    const handleSearchSubmit = async () => {
        if(searchTerm != ""){//we don't want people to search for nothing
            navigate(`/search/${searchTerm}`)
        }
        if(searchTerm === 'all'){
            navigate('/search/queens%20manhattan%20bronx%20brooklyn')
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
            <button className='search-bttn' onClick={handleSearchSubmit}>
                <FaMagnifyingGlass/>
            </button>
        </div>

    )
}

export default SearchBar