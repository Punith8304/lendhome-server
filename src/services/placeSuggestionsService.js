import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

export const getPlaceSuggestionsList = async (parameters) => {
    try {
        const result = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${parameters.input}&key=${process.env.API_KEY}&locationrestriction=${parameters.location}`)
        const placeIds = result.data.predictions.map((place) => {
            return place.place_id
        })
        console.log(placeIds)
        return placeIds
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getPlaceFullDetails = async (placeIds) => {
    try {
        const placeDetails = placeIds.map(async (placeId) => {
            const placeDetailsResult = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.API_KEY}`)
            return placeDetailsResult.data
        })
        return placeDetails
    } catch (error) {
        console.log(error)
        return error
    }
}