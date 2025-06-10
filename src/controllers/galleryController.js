import * as uploadService from "../services/uploadService.js"
import * as dbServices from "../services/dbService.js"
import uploadQueryMaker from "../utils/queryObjectMaker.js"

export const uploadGalleryDetails = async (req, res) => {
    const houseId = req.session.user.house.houseId;
    console.log(req.session.user, "user details")
    const imageFiles = req.files;
    console.log(houseId)
    try {
        const query = 'INSERT INTO gallery (image, mime_type, house_id) VALUES ($1, $2, $3) RETURNING *';
        let galleryId;
        let firstResult = true
        imageFiles.map(async (element) => {
            const uploadedResult = await uploadService.createNewProperty(query, [element.buffer, element.mimetype, houseId])
            if (firstResult) {
                galleryId = uploadedResult.rows[0].images_id
                const result = await dbServices.updateHouse("gallery_id", galleryId, houseId)
                console.log(uploadedResult.rows[0].images_id, "first result")
                firstResult = false
            } else {
                const uploadedResult = await uploadService.createNewProperty(query, [element.buffer, element.mimetype, houseId])
                console.log(uploadedResult.rows[0])
            }
        })
        try {
            res.send({ status: 200 })
        } catch (error) {
            res.send(error); console.log(error);
        }
    } catch (error) {
        res.send(error); console.log(error);
    }
}