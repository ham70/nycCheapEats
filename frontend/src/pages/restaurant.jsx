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
    const [streetViewImg, setImage] = useState("")

    const [otherMediaImgs, setOtherMediaImgs] = useState([])

    //
    const getRstaurant = id => {
        RestaurantDataService.get(id)
            .then(response => {
                console.log(response.data)
                setRestaurant(response.data.restaurant)
                setImage(response.data.streetViewImg)
                setOtherMediaImgs(response.data.otherMediaImgs)
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
                    <img src={`data:image/png;base64,${streetViewImg}`}/>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}</p>
                    <p>{restaurant.description}</p>
                    <div className="image-gallery">
                        {otherMediaImgs.map((img, index) => (
                            <img key={index} src={`data:image/png;base64,${img}`} alt={`Other Media ${index + 1}`} className="gallery-image"/>
                        ))}
                    </div>
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
