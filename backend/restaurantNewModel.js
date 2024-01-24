import mongoose from "mongoose"
const { Schema } = mongoose

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
        stars: {type: Number}
        
    }
)

restaurantNewSchema.index({
    'name': 'text',
    'address.borough': 'text',
    'address.zipcode': 'text',
    'cuisine': 'text',
})

export const NewRestaurant = mongoose.model('NewRestaurant', restaurantNewSchema)