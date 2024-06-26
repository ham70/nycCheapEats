import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import RestaurantDataService from '../services/restaurant.js'

const Searchresults = () => {
  const { query } = useParams()
  console.log(query)
  const headertext = query

  const [restaurants, setRestaurants] = useState([])


  useEffect(() => { retrieveRestaurants() }, [query])



  const retrieveRestaurants = () => {
    RestaurantDataService.find(query)
      .then(response => {
        console.log(`this is the data ${response.data}`)
        console.log(response.data)
        
        // Combine the restaurants and streetviewImages arrays
        const combinedData = response.data.restaurants.map((restaurant, index) => {
          return {...restaurant, streetViewImg: response.data.streetviewImages[index].streetViewImg}
        })
  
        setRestaurants(combinedData)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const shortenName = (name) => {
    return name.length > 25 ? name.substring(0, 25) + "..." : name;
  }

  return (
    <div>
      <h1>{headertext}</h1>
      <div className='restaurant-gallery'>
        {restaurants.map((restaurant) => {
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
        })}
      </div>
    </div>
  )
}

export default Searchresults
