import axios from 'axios'

//baseurl prod setup: 'https://nyccheapeats.onrender.com/restaurants' || 'http://localhost:5555/restaurants'
//baseurl dev setup: 'http://localhost:5555/restaurants' || 'https://nyccheapeats.onrender.com/restaurants'

export default axios.create({
    baseURL: 'https://nyc-cheap-eats-server.vercel.app' || 'http://localhost:5555/restaurants',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})