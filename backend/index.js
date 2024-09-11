import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import restaurantsRoute from './routes/restaurantRoute.js';
import restaurantUploadPagesRoute from './routes/restaurantUploadPagesRoute.js';

//==================================================================================
//getting resources from .env file
dotenv.config();
const port = process.env.PORT || 8000;
const url = process.env.MONGODBURL;

//inializing app and handling middleware
const app = express();

// CORS configuration
app.use(cors({
    origin: 'https://nyccheapeats.vercel.app',
    methods: ['GET'],
    credentials: true,
}));

app.use(express.json());
app.set('view engine', 'ejs');

//routes==================================================================================
app.use('/restaurants', restaurantsRoute);

//these routes are excluded in prod
//app.use('/restaurantUpload', restaurantUploadPagesRoute);

app.get('/', (request, response) => {
    console.log(request);
    return response.status(450).send('hello we are up and running');
});

//==================================================================================
//connecting to database and running the server
mongoose
    .connect(url)
    .then(() => {
        console.log('App connected to database');

        //only run the server if we can connect to the database
        app.listen(port, () => {
            console.log(`app is listening on port ${port}`);
        });
        
    })
    .catch((error) => {
        console.log(error);
    });

export default app;