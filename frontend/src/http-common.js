import axios from 'axios'

//baseurl prod setup: 'https://nyc-cheap-eats-server.vercel.app/restaurants' || 'http://localhost:8000/restaurants'
//baseurl dev setup: 'http://localhost:8000/restaurants' || 'https://nyc-cheap-eats-server.vercel.app/restaurants'

export default axios.create({
    baseURL:  'https://nyc-cheap-eats-server.vercel.app/restaurants' || 'http://localhost:8000/restaurants',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})