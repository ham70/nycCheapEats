import React, {useState, useEffect } from 'react'
import RestaurantDataService from '../services/restaurant.js'
import { useParams } from 'react-router-dom';

const Restaurant = () => {
    //getting restuarant id and initializing inital state
    const { id } = useParams()

    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        img: {}
    };
    const [restaurant, setRestaurant] = useState(initialRestaurantState);

    //image
    const [image, setImage] = useState([])

    //
    const getRstaurant = id => {
        RestaurantDataService.get(id)
            .then(response => {
                setRestaurant(response.data.restaurant)
                setImage(response.data.img)
            })
            .catch(error => {
                console.log(error)
            })
        }
    
    useEffect(() => {
        getRstaurant(id)
    }, [id])

    return (
        <div>
            {restaurant ? (
                <div>
                    <img src={`data:image/png;base64,${image}`}/>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}</p>
                </div>
            ) : (
                <div>
                    <p>No restaurant found or selected</p>
                </div>

            )}
        </div>
    )
}

export default Restaurant
