import http from '../http-common.js'

class RestaurantDataService {
    find(query) {
        return http.get(`/search/${query}`)
    }

    get(id) {
        return http.get(`/id/${id}`)
    }

}

export default new RestaurantDataService();