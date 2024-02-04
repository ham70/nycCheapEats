import express from 'express'
const router = express.Router();
import { NewRestaurant } from '../restaurantNewModel.js'
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

//====================================================================================================================================================================
//Post routes

//route for creating a new restaurant without images
router.post('/', async (request, response) => {
    try {
        if (//the post must have a name and address before being sent to db
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
        //if the post has a name and address than a new restauran object is created
        const newRestaurant = {
            name: request.body.name,
            address: request.body.address,
        }

        //the restaurant is created using the schema and added to the db
        const restaurant = await NewRestaurant.create(newRestaurant)

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
    const restaurant = await NewRestaurant.findById(id)

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


//====================================================================================================================================================================
//get routes

//route to get all restaurants from db
router.get('/', async (request, response) => {
    try {
        //recieves all restaurants from db
        const restaurants = await NewRestaurant.find({})

        //returns object contain all the restaurants and a count of them
        return response.status(200).json({
            count: restaurants.length,
            data: restaurants
        })
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
        const restaurant = await NewRestaurant.findById(id)

        //creating base64 string for restaurant image
        const img = Buffer.from(restaurant.images.StreetView.Data).toString('base64')

        //returns restaurant to client
        return response.status(200).json({restaurant, img})
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

//route to get restaurants by text search
router.get('/search/:query', async (request, response) => {
    try {
        let { query } = request.params
        const strSearch = query.toString().toLowerCase()

        const restaurants = await NewRestaurant.find({ $text: { $search: strSearch }})
    
        return response.status(200).json({restaurants})
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})


//====================================================================================================================================================================
//put and delete routes

//route to updating restaurant (no image)
router.put('/:restaurandId', async (request, response) => {
    try {
        
        if (
            !request.body.name ||
            !request.body.address
        ) {
            return response.status(501).send({
                message: 'Send all required fields: Name, address',})
        }

        //if request valid than find id of restaurant from request
        const { id } = request.params

        //update restaurand in db and return result
        const result = await NewRestaurant.findByIdAndUpdate(id, request.body)

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
        const result = await NewRestaurant.findByIdAndDelete(restaurantId)

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
        const restaurant = await NewRestaurant.findById(restaurantId)
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

export default router