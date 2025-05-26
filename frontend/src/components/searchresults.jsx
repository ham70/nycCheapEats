import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import RestaurantDataService from '../services/restaurant.js'
import PaginationControls from './PaginationControls.jsx'

//this reast component is essentially a big container to displaying all the 
//restaurant returned by the database whenever a query is made
//we will display each restaurant in a gallery format including the restaurant
//name, address, and a picture form the streetview

const Searchresults = () => {
  //retrieving the query from the url with useParams and saving it in a variable to display on the page
  const { query } = useParams()
  const headertext = query

  //getting the page number requested
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const page = parseInt(searchParams.get('page')) || 1

  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(false)//creating a state variable to see if the client is waiting for a response for the server
  const [totalPages, setTotalPages] = useState(0)//to track the total number of pages

  useEffect(() => { retrieveRestaurants() }, [query, page])

  //getting the restaurants from the db
  const retrieveRestaurants = () => {
    setIsLoading(true)

    RestaurantDataService.find(query, page)
      .then(response => {
        //we retrieve the restaurants data as mulitple arrays because of this
        // we want to Combine the names, addresses, and streetviewImages arrays
        //into the restaurants state variable
        const { ids, names, addresses, streetviewImages } = response.data;

        const combinedData = names.map((name, index) => ({
          _id: ids[index],
          name,
          address: addresses[index],
          streetViewImg: streetviewImages[index] ? `data:image/png;base64,${streetviewImages[index]}` : null,
        }));
        setRestaurants(combinedData)
        setTotalPages(response.data.totalPages)
        setIsLoading(false)
      })
      .catch(e => {
        console.log(e)
        setIsLoading(false)
      })
  }

  //some restaurants may have names too long to display neatly
  // because of this we create a shortenName method to clean things up when needed
  const shortenName = (name) => {
    return name.length > 25 ? name.substring(0, 25) + "..." : name;
  }

  return (
    <div>
      <h1>{headertext}</h1>
      <div className='restaurant-gallery'>
        {isLoading ? (
          <p>Loading... This might take a while</p>
        ) : restaurants.length > 0 ? (restaurants.map((restaurant) => {
          const fullAddress = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`
          return (
            <div className="restaurant-item">
              <Link to={'/restaurant/id/'+restaurant._id} className='restaurant-link'>
                <div >
                  <div className='restaurant-name'>{shortenName(restaurant.name)}</div>
                  <div>
                    <img src= {restaurant.streetViewImg} alt={restaurant.name} className= "restaurant-street-image"/>
                  </div>
                  <h5 className='restaurant-address'>Address: {fullAddress}</h5>
                </div>                
              </Link>
            </div>
          )
        })
      ) : (<div> No results found for: {headertext} page {page}</div>)
      }
      </div>
      <PaginationControls query={query} currentPage={page} totalPages={totalPages} />
    </div>
  )
}

export default Searchresults