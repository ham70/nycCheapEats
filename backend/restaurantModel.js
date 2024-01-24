import mongoose from "mongoose"
const { Schema } = mongoose

const restaurantSchema = new Schema(
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
        img: {
            data: Buffer
        }
    }
)

restaurantSchema.index({
    'name': 'text',
    'address.borough': 'text',
    'address.street': 'text',
    'address.zipcode': 'text',
    'address.borough': 'text',
})


export const Restaurant = mongoose.model('Restaurant', restaurantSchema)