import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import restaurantsRoute from './routes/restaurantRoute.js'
import restaurantUploadPageRoute from './routes/restaurantUploadPageRoute.js'

//==================================================================================
//getting resources from .env file
dotenv.config()
const port = process.env.PORT || 8000
const url = process.env.MONGODBURL

//inializing app and handeling middleware
const app = express();
app.use(express.json())
app.use(cors())
app.set("view engine", "ejs");

//routes==================================================================================
app.use('/restaurants', restaurantsRoute)
app.use('/restaurantUpload', restaurantUploadPageRoute)

app.get('/', (request, response) => {
    console.log(request)
    return response.status(450).send("hello we are up and running")
})


//==================================================================================
//connecting to database and running the sever
mongoose
    .connect(url)
    .then(() => {
        console.log('App connected to database')

        //only run the sever if we can connect to the database
        app.listen(port, () => {
            console.log(`app is listening on port ${port}`)
        })
        
    })
    .catch((error) => {
        console.log(error)
    })

