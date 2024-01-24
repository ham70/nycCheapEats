import axios from 'axios'

export default axios.create({
    baseURL: 'http://localhost:5555/restaurants',
    headers: {
        'Content-Type': 'application/json'
    }
})