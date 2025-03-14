import * as uploadService from "../services/uploadService.js"
import * as dbServices from "../services/dbService.js"
import uploadQueryMaker from "../utils/queryObjectMaker.js"


export const uploadRentalDetails = async (req, res) => {
    const rentalDetails = req.body
    const houseId = req.session.user.house.houseId
    try {
        const {queryColumns, queryPlaceHolders, queryValues} = uploadQueryMaker(rentalDetails.preferredTenants)
        const preferredTenantsQuery = `INSERT INTO preferred_tenants (${queryColumns}) VALUES (${queryPlaceHolders}) RETURNING id`
        const preferredTenantsResult = await uploadService.createNewProperty(preferredTenantsQuery, queryValues)
        const preferredTenantsId = preferredTenantsResult.rows[0].id;
        const rentalDetailsCopy = {...rentalDetails, preferred_tenants: preferredTenantsId}
        delete rentalDetailsCopy.preferredTenants
        try {
            const {queryColumns : columns, queryPlaceHolders : placeHolders, queryValues : values} = uploadQueryMaker(rentalDetailsCopy)
            const query = `INSERT INTO rental (${columns}) VALUES (${placeHolders}) RETURNING *`
            const uploadedResult = await uploadService.createNewProperty(query, values)
            const rentalId = uploadedResult.rows[0].rental_id
            try {
                const result = await dbServices.updateHouse("rental_id", rentalId, houseId)
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