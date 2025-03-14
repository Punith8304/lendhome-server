import * as uploadService from "../services/uploadService.js"
import * as dbServices from "../services/dbService.js"
import uploadQueryMaker from "../utils/queryObjectMaker.js"

export const uploadAmenitiesDetails = async (req, res) => {
    const amenitiesDetails = req.body
    const houseId = req.session.user.house.houseId
    try {
        const {queryColumns, queryPlaceHolders, queryValues} = uploadQueryMaker(amenitiesDetails.additional_amenities)
        const additionalAmenitiesQuery = `INSERT INTO additional_amenities (${queryColumns}) VALUES (${queryPlaceHolders}) RETURNING id`
        const additionAmenitiesResult = await uploadService.createNewProperty(additionalAmenitiesQuery, queryValues)
        const additionalAmenitiesId = additionAmenitiesResult.rows[0].id;
        const amenitiesDetailsCopy = {...amenitiesDetails, additional_amenities: additionalAmenitiesId}
        try {
            const {queryColumns : columns, queryPlaceHolders : placeHolders, queryValues : values} = uploadQueryMaker(amenitiesDetailsCopy)
            const query = `INSERT INTO amenities (${columns}) VALUES (${placeHolders}) RETURNING *`
            const uploadedResult = await uploadService.createNewProperty(query, values)
            const columnValue = uploadedResult.rows[0].amenities_id;
            try {
                const result = await dbServices.updateHouse("amenities_id", columnValue, houseId)
                res.send({status: 200})
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
}