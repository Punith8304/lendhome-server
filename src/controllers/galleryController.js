import * as uploadService from "../services/uploadService.js"
import * as dbServices from "../services/dbService.js"
import uploadQueryMaker from "../utils/queryObjectMaker.js"

export const uploadGalleryDetails = async (req, res) => {
    const houseId = req.session.user.house.houseId
    const imageFiles = req.files
    try {
        const query = 'INSERT INTO images (images_array) VALUES ($1) RETURNING *';
        const uploadedResult = await uploadService.createNewProperty(query, [imageFiles])
        const galleryId = uploadedResult.rows[0].images_id
        try {
            const result = await dbServices.updateHouse("gallery_id", galleryId, houseId)
            res.send({status: 200})
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }

}