import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import RestaurantDataService from '../services/restaurant.js'

//this reast component is essentially a big container to displaying all the 
//restaurant returned by the database whenever a query is made
//we will display each restaurant in a gallery format including the restaurant
//name, address, and a picture form the streetview

const Searchresults = () => {
  //retrieving the query from the url with useParams and saving it in a variable to display on the page
  const { query } = useParams()
  const headertext = query

  //creating a state variable restaurants as an empty array to later hold 
  // all the restaurants returned by the backend when a query is made
  const [restaurants, setRestaurants] = useState([])

  //creating a state variable to see if the client is waiting for a response for the server
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { retrieveRestaurants() }, [query])

  //getting the restaurants from the db
  const retrieveRestaurants = () => {
    setIsLoading(true)
    console.log('Loading started')

    RestaurantDataService.find(query)
      .then(response => {
        //we retrieve the restaurants data as mulitple arrays because of this
        // we want to Combine the restaurants and streetviewImages arrays
        //into the restaurants state variable

        const combinedData = response.data.restaurants.map((restaurant, index) => {
          return {...restaurant, streetViewImg: response.data.streetviewImages[index].streetViewImg}
        })
  
        setRestaurants(combinedData)

        setIsLoading(false)
        console.log('Loading finished')
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
          <p>Loading... This might take a while your first search</p>
        ) : restaurants.length > 0 ? (restaurants.map((restaurant) => {
          const fullAddress = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`
          return (
            <div className="restaurant-item">
              <Link to={'/restaurant/id/'+restaurant._id} className='restaurant-link'>
                <div >
                  <div className='restaurant-name'>{shortenName(restaurant.name)}</div>
                  <div>
                    <img src= {`data:image/png;base64,${restaurant.streetViewImg}`} alt={restaurant.name} className= "restaurant-street-image"/>
                  </div>
                  <h5 className='restaurant-address'>Address: {fullAddress}</h5>
                </div>                
              </Link>
            </div>
          )
        })
      ) : (<div> No results found for: {headertext}</div>)
      }
      </div>
    </div>
  )
}

export default Searchresults