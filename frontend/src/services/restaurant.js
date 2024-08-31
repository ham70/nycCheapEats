import http from '../http-common.js'

//this js file is responsible for making http requests to the backend api
//it uses get route searching the database for a specifc text query or document id

//the get id method will return the restaurant of the correspoing id and will be 
//used for the page viewing a signel restaurant
//the find query method will be used to find all restaurants matching that query
//which is then used to populate the search results page

class RestaurantDataService {
    find(query, page) {
        return http.get(`/search/${query}?page=${page}`)
    }

    get(id) {
        return http.get(`/id/${id}`)
    }

}

export default new RestaurantDataService();