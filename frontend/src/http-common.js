import axios from 'axios'

//backend api url
const url = process.env.APIURL

export default axios.create({
    baseURL: url || 'http://localhost:5555/restaurants',
    headers: {
        'Content-Type': 'application/json'
    }
})