async function get_dist(restaurant_coords){
    const user_coords = await get_user_coords()
    const Radius = 3963//earth's radius in miles
    console.log(user_coords)

    const lat1 = user_coords.latitude
    const lng1 = user_coords.longitude

    const lat2 = restaurant_coords.lat
    const lng2 = restaurant_coords.lng

    console.log(`lat1: ${lat1}, lng1: ${lng1}, lat2: ${lat2}, lng2: ${lng2}`)

    const dLat = deg2rad(lat2 - lat1)
    const dLng = deg2rad(lng2 - lng1)

    const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return (Math.round(Radius * c * 100) / 100)
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function get_user_coords(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const {latitude, longitude} = position.coords
            resolve({latitude, longitude})
        },
        (error) => {
            reject(error)
        }
        )
    })
}

export default get_dist;