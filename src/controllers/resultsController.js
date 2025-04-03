import * as resultDBServices from "../services/resultDBServices.js"


export const getPropertiesIds = async (req, res) => {
    const data = req.body
    console.log(data)
    try {
        const result = await resultDBServices.getAllPropertiesUnderCoordinatesService(parseFloat(data.lat), parseFloat(data.lng))
        res.send(result)
    } catch (error) {
        console.log(error)
    }
}


export const getDisplayPropertyResult = async (req, res) => {
    const houseId = Number(req.body.houseId)
    console.log(req.body, "houseId result")
    console.log(req.body, houseId)
    try {
        const result = await resultDBServices.getDisplayPropertyResultService(houseId)
        res.send(result)
    } catch (error) {
        console.log(error)
    }
}


export const getFullHouseDetails = async (req, res) => {
    const houseId = Number(req.body.houseId)
    try {
        const houseDetailsIds = await resultDBServices.fullPropertyResultDetailsIds(houseId)
        try {
            const userDetails = await resultDBServices.getFullUserDetails(houseDetailsIds.user_id)
            const propertyDetails = await resultDBServices.getFullHousePropertyDetails(houseDetailsIds.property_id)
            const localityDetails = await resultDBServices.getFullHouseLocalityDetails(houseDetailsIds.locality_id)
            const rentalDetails = await resultDBServices.getFullHouseRentalDetails(houseDetailsIds.rental_id)
            const amenitiesDetails = await resultDBServices.getFullHouseAmenitiesDetails(houseDetailsIds.amenities_id)
            const scheduleDetails = await resultDBServices.getFullHouseScheduleDetails(houseDetailsIds.schedule_id)
            const galleryDetails = await resultDBServices.getFullHouseGalleryDetails(houseId)
            const result = {
                userDetails: userDetails,
                propertyDetails: propertyDetails,
                localityDetails: localityDetails,
                rentalDetails: rentalDetails,
                amenitiesDetails: amenitiesDetails,
                scheduleDetails: scheduleDetails,
                galleryDetails: galleryDetails
            }
            res.send({
                data: result
            })
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
}


export const getImage = async (req, res) => {
    const imageId = Number(req.params.id)
    try {
        const result = await resultDBServices.getImage(imageId)
        console.log(result, "image result")
        res.type(result.mime_type)
        res.send(result.image)
    } catch (error) {
        console.log(error)
    }
}