import axios from 'axios'

export default axios.create({
    baseURL: 'https://nyccheapeats.onrender.com/restaurants' || 'http://localhost:5555/restaurants',
    headers: {
        'Content-Type': 'application/json'
    }
})