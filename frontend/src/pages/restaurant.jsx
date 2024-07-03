import React, {useState, useEffect } from 'react'
import RestaurantDataService from '../services/restaurant.js'
import { useParams, Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';

//social media icons
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

//restaurant website icon
import { CgWebsite } from "react-icons/cg";

const Restaurant = () => {
    //getting restuarant id and initializing inital state
    const { id } = useParams()

    //creating an initial state 
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        images: {
            StreetView: {
                Data: null,
            },
            OtherMedia: [{
                Data: null,
            }]
        },
        links: {
            site: "none",
            insta: "none",
            x: "none",
            fb: "none"
        }
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
                            <p className='cuisine-box'><strong>Cuisine Type: </strong>{restaurant.cuisine}</p>
                            <p className='description-box'><strong>Description: </strong> {restaurant.description} </p>
                        </div>
                        
                        <div className="image-gallery">
                            {otherMediaImgs.map((img, index) => (
                                <img key={index} src={`data:image/png;base64,${img}`} alt={`Other Media ${index + 1}`} className="gallery-image"/>
                            ))}
                        </div>
                        <div className='restaurant-links'>
                            <div className='social-icons'>
                                {restaurant.links.site !== "none" ? (
                                    <Link to={restaurant.links.site}><CgWebsite/></Link>
                                ) : (
                                    <span><CgWebsite/></span>
                                )}
                                {restaurant.links.insta !== "none" ? (
                                    <Link to={restaurant.links.insta}><FaInstagram/></Link>
                                ) : (
                                    <span><FaInstagram/></span>
                                )}
                                
                                {restaurant.links.x !== "none" ? (
                                    <Link to={restaurant.links.x}><FaXTwitter/></Link>
                                ) : (
                                    <span><FaXTwitter/></span>
                                )}
                                {restaurant.links.fb !== "none" ? (
                                    <Link to={restaurant.links.fb}><FaFacebook/></Link>
                                ) : (
                                    <span><FaFacebook /></span>
                                )}
                            </div>
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
