import * as uploadService from "../services/uploadService.js"
import * as dbServices from "../services/dbService.js"
import uploadQueryMaker from "../utils/queryObjectMaker.js"
export const uploadLocalityDetails = async (req, res) => {
    const localityDetails = req.body
    const houseId = req.session.user.house.houseId
    try {
        const {queryColumns, queryPlaceHolders, queryValues} = uploadQueryMaker(localityDetails.area)
        const query = `INSERT INTO area (${queryColumns}) VALUES (${queryPlaceHolders}) RETURNING *`
        const uploadedResult = await uploadService.createNewProperty(query, queryValues)
        const areaId = uploadedResult.rows[0].area_id;
        const cityId = await dbServices.getCityId(localityDetails.city)
        const localityDetailsCopy = {...localityDetails, area_id: areaId, city_id: cityId}
        delete localityDetailsCopy["area"]
        delete localityDetailsCopy["city"]
        console.log(localityDetailsCopy)
        try {
            const {queryColumns : columns, queryPlaceHolders : placeHolders, queryValues : values} = uploadQueryMaker(localityDetailsCopy)
            const localityQuery = `INSERT INTO locality (${columns}) VALUES (${placeHolders}) RETURNING *`
            const localityUploadedResult = await uploadService.createNewProperty(localityQuery, values) 
            const localityId = localityUploadedResult.rows[0].locality_id;
            try {
                const result = await dbServices.updateHouse("locality_id", localityId, houseId)
                res.send({status: 200})
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    } catch(error) {
        console.log(error)
    }
}
