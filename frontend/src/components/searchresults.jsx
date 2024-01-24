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
        setRestaurants(response.data.restaurants)
      })
      .catch(e => {
        console.log(e)
      })
  }

  return (
    <div>
      <h1>{headertext}</h1>
      <div>
        {restaurants.map((restaurant) => {
          const fullAddress = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`
          return (
            <div>
              <Link to={'/restaurant/id/'+restaurant._id}>{restaurant.name}</Link>
              <h3>address: {fullAddress}</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Searchresults
