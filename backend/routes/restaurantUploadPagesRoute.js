import express from 'express'
const router = express.Router();
import { Restaurant } from '../restaurantModel.js'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import bodyParser from 'body-parser'
import getImageType from '../utils.js'

//These routes all correspond to .ejs files within the view directory
//they will not be used in prod for database security


//setting up middleware for router
router.use(bodyParser.urlencoded({ extended: true }))
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
//Get routes establishing each of the pages int he view directory
router.get('/', (request, response) => {
    Restaurant.find({})
    .then((data, error)=>{
		if(error){
			console.log(error);
		}
		response.render('restaurantuploadpage',{items: data})
    })
})
router.get('/othermedia', (request, response) => {
    Restaurant.find({})
    .then((data, error)=>{
		if(error){
			console.log(error);
		}
		response.render('othermediauploadpage',{items: data})
    })
})
router.get('/updateStreetView', (request, response) => {
    Restaurant.find({})
    .then((data, error)=>{
		if(error){
			console.log(error);
		}
		response.render('updatestreetviewpage',{items: data})
    })
})

//====================================================================================================================================================================
//Post routes

//route for creating a new restuarant without othermedie images
router.post('/', upload.single('image'), (request, response, next) => {
    const buffer = fs.readFileSync(path.join(__dirname, '../uploads/', request.file.filename))

    //creating a resturant object given the uploaded information following the porper schema
    var restaurant = {
        name: request.body.name,
        address: {
            building: request.body.address.building,
            street:  request.body.address.street,
            zipcode: request.body.address.zipcode,
            borough: request.body.address.borough,
        },
        images: {
            StreetView: {
                Data: buffer,
			    ContentType: getImageType(buffer)
            },
			OtherMedia: []
		},
        cuisine: request.body.cuisine,
        description: request.body.description,
        links: {
            site: request.body.links.site || "none",
            insta: request.body.links.insta || "none",
            x: request.body.links.x || "none",
            fb: request.body.links.fb || "none",
        },
        stars: 0
    }

    //creating the document 
    Restaurant.create(restaurant)
    .then(() => {
        response.send('Document upload successful')
    })
    .catch((error) => {
        console.log(error)
    })
})


//route for adding images to the othermedia array of a document one image at a time
router.post('/othermedia', upload.single('image'), async (request, response, next) => {
    //retrieveing the resturant id and the file uploaded
    const restaurantId = request.body.restaurantId
    const buffer = fs.readFileSync(path.join(__dirname, '../uploads/', request.file.filename))

    //creating an imageObject from the image uploaded
    var imageObject = {
        Data: buffer,
        ContentType: getImageType(buffer)
    }

    //adding the uploaded image to the OtherMedia array of the restuarant document in question
    try {
        const updatedRestaurant = await Restaurant.findById(restaurantId)
        updatedRestaurant.images.OtherMedia.push(imageObject)
        await updatedRestaurant.save()

        response.send('Image uploaded successfully')
    } catch (error) {
        response.status(500).send(error)
    }
})


//route for updatin the streetview image of a document
router.post('/updateStreetView', upload.single('image'), async (request, response, next) => {
    console.log("right route")
    //retrieveing the resturant id and the file uploaded
    const restaurantId = request.body.restaurantId
    const buffer = fs.readFileSync(path.join(__dirname, '../uploads/', request.file.filename))

    //creating an imageObject from the image uploaded
    var imageObject = {
        Data: buffer,
        ContentType: getImageType(buffer)
    }

    //adding the uploaded image to the OtherMedia array of the restuarant document in question
    try {
        const updatedRestaurant = await Restaurant.findById(restaurantId)
        updatedRestaurant.images.StreetView = imageObject
        await updatedRestaurant.save()

        response.send('Image uploaded successfully')
    } catch (error) {
        response.status(500).send(error)
    }
})

export default router