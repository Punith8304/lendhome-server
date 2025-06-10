import dotenv from "dotenv"
dotenv.config()
import { getPlaceSuggestionsList, getPlaceFullDetails } from "../services/placeSuggestionsService.js"

export const getPlaceSuggestions = async (req, res) => {
    const parameters = {
            input: req.body.textInput,
            key: process.env.API_KEY,
            location: req.body.cityLocation,
        }
    try {
        const placeIds = await getPlaceSuggestionsList(parameters)
        try{
            const placeDetails = await getPlaceFullDetails(placeIds)
            console.log(placeDetails)
            res.send(placeDetails)
        } catch (error) {
            res.send(error); console.log(error);
        }
    } catch (error) {
        res.send(error); console.log(error);
    }
}