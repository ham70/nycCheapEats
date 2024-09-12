import express from 'express'
const router = express.Router();
import { Restaurant } from '../restaurantModel.js'
import multer from 'multer'
import bodyParser from 'body-parser'

//setting up middleware for router
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//multer
var storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (request, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
})
var upload = multer({storage: storage})

/*
BELOW ARE ALL THE API ROUTES
for the main/production branch only all non-get routes will be commented out 
this is to prevent anyone who isn't supposed to from altering any inside the database
*/

//====================================================================================================================================================================
//get routes

//route to get all restaurants from db
router.get('/', async (request, response) => {
    try {
        //recieves all restaurants from db
        const restaurants = await Restaurant.find({})

        //returns object contain all the restaurants and a count of them
        return response.status(200).json(
            {
                count: restaurants.length,
                data: restaurants
            }
        )
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

//route to get details of one restaurant using ID
router.get('/id/:id', async (request, response) => {
    try {
        const { id } = request.params

        //recieves restaurant from db
        const restaurant = await Restaurant.findById(id)

        //creating base64 string for restaurant streetview image
        const streetViewImg = Buffer.from(restaurant.images.StreetView.Data).toString('base64')

        //creating an array of base64 strings for otherMedia images
        const otherMediaImgs = restaurant.images.OtherMedia.map(img => Buffer.from(img.Data).toString('base64'))

        //returns restaurant to client
        return response.status(200).json(
            {
                restaurant, 
                streetViewImg, 
                otherMediaImgs
            }
        )
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

//route to get restaurants by text search
router.get('/search/:query', async (request, response) => {
    try {
        //getting the query text and converting it to all lowercase
        let { query } = request.params
        const strSearch = query.toString().toLowerCase()

        //getting pagination params
        const page = parseInt(request.query.page) || 1
        const limit = parseInt(request.query.limit) || 6
        const skip = (page - 1) * limit

        //getting the total number of restaurants that match the search query
        const totalRestaurants = await Restaurant.countDocuments({ $text: { $search: strSearch } });

        //getting restaurants from the api with pagination
        const restaurants = await Restaurant.find({ $text: { $search: strSearch }}).select('name address images.StreetView').skip(skip).limit(limit)

        //creating ids, names, and addresses arrays to space space on response payload
        const ids = restaurants.map(restaurant => restaurant._id);
        const names = restaurants.map(restaurant => restaurant.name);
        const addresses = restaurants.map(restaurant => restaurant.address);

        const streetviewImages = restaurants.map(restaurant => {
            //we need to convert the StreetView image to a base64 buffer so it can be displayed on the wedpage
            if (restaurant.images && restaurant.images.StreetView && restaurant.images.StreetView.Data) {//checking if the image exists
                return Buffer.from(restaurant.images.StreetView.Data).toString('base64');//returning the buffer to the image
            }
            return null;//returning null if doesn't exist
        })
    
        //returning data from the restaurants and the streetviewimages as two organized but separate arrays
        //also returning metadata
        return response.status(200).json(
            {
                ids,
                names,
                addresses,
                streetviewImages,
                totalRestaurants,
                totalPages: Math.ceil(totalRestaurants / limit),
                currentPage: page
            }
        );
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})


//====================================================================================================================================================================

/*
THE FOLLOWING ROUTES WILL BE COMMENTED OUT FOR PRODUCTION FOR DATABASE SECURITY

//====================================================================================================================================================================
//Post routes

//route for creating a new restaurant without images
router.post('/', async (request, response) => {
    try {
        if (//the post must have the following before being sent to db
            !request.body.name ||
            !request.body.address ||
            !request.body.address.borough ||
            !request.body.address.building ||
            !request.body.address.street ||
            !request.body.address.zipcode ||
            !request.body.cuisine ||
            !request.body.description
        ) {
            return response.status(501).send({
                message: 'Send all required fields: Name; complete address with building, borough, street, and zipcode; cuisine; and description',
            })
        }
        //if the post has a name and address than a new restaurant object is created
        const Restaurant = {
            name: request.body.name,
            address: request.body.address,
            cuisine: request.body.cuisine,
            description: request.body.description
        }

        //the restaurant is created using the schema and added to the db
        const restaurant = await Restaurant.create(Restaurant)

        // the restaurant value is then sent back to where the request was made
        return response.status(201).send(restaurant)
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

//route for updating any non image related field of the document
router.post('/update/:id', async (request, response) => {
    const { id } = request.params
    const restaurant = await Restaurant.findById(id)

    try {
        //checking any values that may want to be updated given the request json body
        //and updating them accordingly
        //in order for any value to be updated properly then it must be included in the 
        // json body of the request, additionally it must be in the porper format which 
        //is the same as the restaurant schema

        if (request.body.name) {
            restaurant.name = request.body.name
        }
        if (request.body.address) {
            if (request.body.address.building) {
                restaurant.address.building = request.body.address.building
            }
            if (request.body.address.street) {
                restaurant.address.street = request.body.address.street
            }
            if (request.body.address.zipcode) {
                restaurant.address.zipcode = request.body.address.zipcode
            }
            if (request.body.address.borough) {
                restaurant.address.borough = request.body.address.borough
            }
        }
        if(request.body.cuisine) {
            restaurant.cuisine = request.body.cuisine
        }
        if(request.body.description) {
            restaurant.description = request.body.description
        }
        if (request.body.links) {
            if (request.body.links.site) {
                restaurant.links.site = request.body.links.site
            }
            if (request.body.links.insta) {
                restaurant.links.insta = request.body.links.insta
            }
            if (request.body.links.x) {
                restaurant.links.x = request.body.links.x
            }
            if (request.body.links.fb) {
                restaurant.links.fb = request.body.links.fb
            }
        }
        if(request.body.stars) {
            restaurant.stars = request.body.stars
        }

        //all the updated values in the restuarant document are saved
        await restaurant.save()

        // the restaurant value is then sent back to where the request was made
        return response.status(201).send(restaurant)
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})



//put and delete routes

//route to updating restaurant (no image)
router.put('/:restaurantId', async (request, response) => {
    try {
        //if request valid than find id of restaurant from request
        const { id } = request.params

        //update restaurand in db and return result
        const result = await Restaurant.findByIdAndUpdate(id, request.body)

        if(!result) {
            return response.status(404).json({ message: 'Restaurant not found'})
        }

        return response.status(200).send({ message: 'Restaurant updated successfully' })
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

//route to delete a restaurant
router.delete('/deleteRestaurant/:restaurantId', async (request, response) => {
    try {
        //get id from request
        const { restaurantId } = request.params

        //find restaurant in db and delete
        const result = await Restaurant.findByIdAndDelete(restaurantId)

        if(!result) {
            return response.status(404).json({ message: 'Restaurant not found'})
        }

        return response.status(200).send({ message: 'Restaurant deleted  successfully' })
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

//route to delete a specifc item in Other media list in a document
router.delete('/deleteImage/:restaurantId', async (request, response) => {
    try {
        //get restaurant id from request in url
        const { restaurantId } = request.params

        //get object id from request in json body
        const imageId = request.body.id

        //finding restaurant in db and deleting desired object
        const restaurant = await Restaurant.findById(restaurantId)
        restaurant.images.OtherMedia.remove(imageId)
        await restaurant.save()

        if(!restaurant) {
            return response.status(404).json({ message: 'image not found'})
        }

        return response.status(200).send({ message: 'image deleted successfully' })
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})
    */

export default router