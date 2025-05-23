import mongoose from "mongoose"
const { Schema } = mongoose

//this the schema defining what a restaurant is in our mongodb database using the 3rd party mongoose library

const restaurantNewSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            building:{type: String, required: true},
            street:  {type: String, required: true},
            zipcode: {type: String, required: true},
            borough: {type: String, required: true},
        },
        images: {
            StreetView: {
                Data: Buffer,
                ContentType: String
            },
            OtherMedia: [{
                Data: Buffer,
                ContentType: String
            }]
        },
        cuisine: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        links: {
            site: {type: String},
            insta: {type: String},
            x: {type: String},
            fb: {type: String},
        },
        stars: {type: Number},
        coords: {
            lat: {type:Number},
            lng: {type:Number}
        }
    }
)

//search indexs
//users may search the database using text in any/all of these fields
restaurantNewSchema.index({
    'name': 'text',
    'address.borough': 'text',
    'address.zipcode': 'text',
    'cuisine': 'text',
})

export const Restaurant = mongoose.model('Restaurant', restaurantNewSchema)