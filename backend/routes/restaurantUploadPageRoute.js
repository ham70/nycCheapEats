import express from 'express'
const router = express.Router();
import { NewRestaurant } from '../restaurantNewModel.js'
import path from 'path'
import multer from 'multer'
import fs from 'fs'
import bodyParser from 'body-parser'
import getImageType from '../utils.js'


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
//Post routes
//route for creating a new restaurant
router.get('/', (request, response) => {
    NewRestaurant.find({})
    .then((data, error)=>{
		if(error){
			console.log(error);
		}
		response.render('restaurantuploadpage',{items: data})
    })
})
router.get('/othermedia', (request, response) => {
    NewRestaurant.find({})
    .then((data, error)=>{
		if(error){
			console.log(error);
		}
		response.render('othermediauploadpage',{items: data})
    })
})

router.post('/', upload.single('image'), (request, response, next) => {
    const buffer = fs.readFileSync(path.join(__dirname, '../uploads/', request.file.filename))

    //creating a resturant object given the uploaded information following the porper schema
    var newRestaurant = {
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
            site: request.body.links.site,
            insta: request.body.links.insta,
            x: request.body.links.x,
            fb: request.body.links.fb,
        },
        stars: 0
    }

    //creating the document 
    NewRestaurant.create(newRestaurant)
    .then(() => {
        response.send('Document upload successful')
    })
    .catch((error) => {
        console.log(error)
    })
})

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
        const updatedRestaurant = await NewRestaurant.findById(restaurantId)
        updatedRestaurant.images.OtherMedia.push(imageObject)
        await updatedRestaurant.save()

        response.send('Image uploaded successfully')
    } catch (error) {
        response.status(500).send(error)
    }
})

export default router