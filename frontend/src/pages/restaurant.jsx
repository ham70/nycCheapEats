import React, {useState, useEffect } from 'react'
import RestaurantDataService from '../services/restaurant.js'
import { useParams, Link } from 'react-router-dom'
import SearchBar from '../components/searchbar.jsx'
import Map from '../components/map.jsx'
import get_dist from '../services/distance.js'//for calculating user distance from given restaurant

//import icons for the website link and social media links
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { CgWebsite } from "react-icons/cg"

const Restaurant = () => {
    //getting restuarant id and initializing inital state
    //the id in the url so we use the useParams hook from react-router-dom
    const { id } = useParams()

    const initialRestaurantState = {//creating an initial state of the restaurant corresponding to what we expect to recieve from the api
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
    const initialCenterState = {//some coords can can be the default center
        lat: 0,
        lng: 0
    }

    const [restaurant, setRestaurant] = useState(initialRestaurantState);
    const [streetViewImg, setImage] = useState("")
    const [otherMediaImgs, setOtherMediaImgs] = useState([])
    const [isLoading, setIsLoading] = useState(false) //creating a state variable to see if the client is waiting for a response for the server
    const [center, setCenter] = useState(initialCenterState) //state variable to sotre location used for rendering google maps
    const [dist, setDist] = useState(-1) //state variable for user distance from restaurant

    //getting restaurant data from api and assigning the proper data to their respective variables
    async function getRstaurant(id){
        setIsLoading(true)
        try{
            const response = await RestaurantDataService.get(id)
            const restaurantCoords = response.data.coords

            setRestaurant(response.data.cleanRestaurant)
            setImage(response.data.streetViewImg)
            setOtherMediaImgs(response.data.otherMediaImgs)
            setCenter(response.data.coords)

            const distance = await get_dist(restaurantCoords)
            setDist(distance)

            setIsLoading(false)
        }catch(error){
            console.error(error)
            setIsLoading(false)
        }
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
                        <div><p>Miles away: {dist}</p></div>
                        <Map center = {center}/>
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