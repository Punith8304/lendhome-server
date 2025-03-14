import * as uploadService from "../services/uploadService.js"
import * as dbServices from "../services/dbService.js"
import uploadQueryMaker from "../utils/queryObjectMaker.js"
export const uploadPropertyDetails = async (req, res) => {
    const propertyDetails = req.body;
    const houseId = req.session.user.house.houseId
    try {
        const {queryColumns, queryPlaceHolders, queryValues} = uploadQueryMaker(propertyDetails)
        const query = `INSERT INTO property (${queryColumns}) VALUES (${queryPlaceHolders}) RETURNING *`
        const uploadedResult = await uploadService.createNewProperty(query, queryValues)
        const columnValue = uploadedResult.rows[0].property_id;
        try {
            const result = await dbServices.updateHouse("property_id", columnValue, houseId)
            res.send({status: 200});
        } catch (error) {
            console.log(error)
        }
    }catch(error){
        console.log(error)
    }
}
