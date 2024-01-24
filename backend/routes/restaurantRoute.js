import express from 'express'
const router = express.Router();
import { Restaurant } from '../restaurantModel.js'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import bodyParser from 'body-parser'

//setting up middleware for router
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

//getting the __dirname
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
//route for creating a new restaurant
router.post('/', async (request, response) => {
    try {
        if (//the post must have a name and address before being sent to db
            !request.body.name ||
            !request.body.address
        ) {
            return response.status(501).send({
                message: 'Send all required fields: Name, address',
            })
        }
        //if the post has a name and address than a new restauran object is created
        const newRestaurant = {
            name: request.body.name,
            address: request.body.address,
        }

        //the restaurant is created using the schema and added to the db
        const restaurant = await Restaurant.create(newRestaurant)

        // the restaurant value is then sent back to where the request was made
        return response.status(201).send(restaurant)
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

//route for uploading an image to a restaurant document
router.post('/uploadImage/:restaurantId', upload.single("image"), async (request, response) => {
    const restaurantId = request.params.restaurantId
    const buffer = fs.readFileSync(path.join(__dirname, '../uploads/', request.file.filename))

    try {
        const restaurant = await Restaurant.findById(restaurantId)
        restaurant.img.data = buffer
        
        await restaurant.save()

        response.send('Image uploaded successfully')
    } catch (error) {
        response.status(500).send(error)
    }
})


//====================================================================================================================================================================
//get routes

//route to get all restaurants from db
router.get('/', async (request, response) => {
    try {
        //recieves all restaurants from db
        const restaurants = await Restaurant.find({})

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
        const restaurant = await Restaurant.findById(id)

        //creating base64 string for restaurant image
        const img = Buffer.from(restaurant.img.data).toString('base64')

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

        const restaurants = await Restaurant.find({ $text: { $search: strSearch }})
    
        return response.status(200).json({restaurants})
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})
/*
//route for restaurants by query with pages
router.get('/search?/:query', async (request, response) => {
    try {
        let search = request.query.search;
        const strSearch = search.toString().toLowerCase();
        console.log(strSearch);

        const limit = 10
        const page = request.query.page || 1
        const skip = (page - 1) * limit

        const restaurants = await Restaurant
            .find({ $text: { $search: strSearch }})
            .skip(skip)
            .limit(limit)
        
        return response.status(200).json({restaurants});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});
*/


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
router.delete('/:restaurandId', async (request, response) => {
    try {
        //get id from request
        const { id } = request.params

        //find restaurant in db and delete
        const result = await Book.findByIdAndDelete(id)

        if(!result) {
            return response.status(404).json({ message: 'Restaurant not found'})
        }

        return response.status(200).send({ message: 'Restaurant deleted  successfully' })
    } catch (error) {
        console.log(error.message)
        response.status(500).send({message: error.message})
    }
})

export default router