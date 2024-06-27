import React, {useState, useEffect } from 'react'
import RestaurantDataService from '../services/restaurant.js'
import { useParams } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';

//social media icons
import { FaMeta } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

//restaurant website icon
import { CgWebsite } from "react-icons/cg";

//icons array
const icons = {CgWebsite, FaInstagram, FaXTwitter, FaMeta};


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

    const [restaurantLinks, setLinks] = useState([])

    //
    const getRstaurant = id => {
        RestaurantDataService.get(id)
            .then(response => {
                console.log(response.data)
                setRestaurant(response.data.restaurant)
                setImage(response.data.streetViewImg)
                setOtherMediaImgs(response.data.otherMediaImgs)
                setLinks(response.data.restaurant.links)
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
            <div className='search-bar'>
                <SearchBar/>
            </div>
            <div className='restaurant'>
                {restaurant ? (
                    <div>
                        <h3 className='restaurant-title'>{restaurant.name}</h3>
                        <img src={`data:image/png;base64,${streetViewImg}`} className='main-image'/>
                        
                        <p>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.borough}, {restaurant.address.zipcode}</p>

                        <div className='restaurant-text'>
                            <p>Cuisine Type: {restaurant.cuisine}</p>
                            <p>Description: {restaurant.description}</p>
                        </div>
                        
                        <div className="image-gallery">
                            {otherMediaImgs.map((img, index) => (
                                <img key={index} src={`data:image/png;base64,${img}`} alt={`Other Media ${index + 1}`} className="gallery-image"/>
                            ))}
                        </div>
                        <div className='restaurant-links'>
                        </div>

                    </div>
                ) : (
                    <div>
                        <p>No restaurant found or selected</p>
                    </div>

                )}
            </div>
        </div>
    )
}

export default Restaurant
