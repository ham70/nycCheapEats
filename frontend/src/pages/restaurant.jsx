import React, {useState, useEffect } from 'react'
import RestaurantDataService from '../services/restaurant.js'
import { useParams, Link } from 'react-router-dom';
import SearchBar from '../components/searchbar.jsx';

//import icons for the website link and social media links
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";


const Restaurant = () => {
    //getting restuarant id and initializing inital state
    //the id in the url so we use the useParams hook from react-router-dom
    const { id } = useParams()

    //creating an initial state of the restaurant corresponding to what we expect to recieve from the api
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        cuisine: "",
        description: "",
        links: {
            site: "none",
            insta: "none",
            x: "none",
            fb: "none"
        }
    };

    const [restaurant, setRestaurant] = useState(initialRestaurantState);
    const [streetViewImg, setImage] = useState("")
    const [otherMediaImgs, setOtherMediaImgs] = useState([])

    //creating a state variable to see if the client is waiting for a response for the server
    const [isLoading, setIsLoading] = useState(false);

    //getting restaurant data from api and assigning the proper data to their respective variables
    const getRstaurant = id => {
        setIsLoading(true)
        RestaurantDataService.get(id)
            .then(response => {
                console.log(response.data)
                setRestaurant(response.data.cleanRestaurant)
                setImage(response.data.streetViewImg)
                setOtherMediaImgs(response.data.otherMediaImgs)

                setIsLoading(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
            })
        }
    
    useEffect(() => {
        getRstaurant(id)
    }, [id])

    //returning the webpage
    return (
        <div>
            <div className='search-bar'>
                <SearchBar/>
            </div>
            <div className='restaurant'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (restaurant ? (
                    <div>
                        <h3 className='restaurant-title'>{restaurant.name}</h3>
                        <img src={`data:image/png;base64,${streetViewImg}`} className='main-image'/>
                        
                        <p>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.borough}, {restaurant.address.zipcode}</p>

                        <div className='restaurant-text'>
                            <div className='cuisine-box'><strong>Cuisine Type: </strong>{restaurant.cuisine}</div>
                        </div>
                        <div className='restaurant-text'>     
                            <div className='description-box'><strong>Description: </strong> {restaurant.description} </div>
                        </div>
                        
                        <div className="image-gallery">
                            {otherMediaImgs.map((img, index) => (
                                <img key={index} src={`data:image/png;base64,${img}`} alt={`Other Media ${index + 1}`} className="gallery-image"/>
                            ))}
                        </div>
                        <div className='restaurant-links'>
                            <div className='social-icons'>

                                {/*If the link is in the data base display the icon and link it to the url in the database 
                                otherwise the "none" will stand in the url and the icon will stil be diplayed but there will be no lin*/}
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

                ))}
            </div>
        </div>
    )
}

export default Restaurant
