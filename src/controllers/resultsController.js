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
    const houseId = Number(req.body.houseId.house_id)
    console.log(req.body, houseId)
    try {
        const result = await resultDBServices.getDisplayPropertyResultService(houseId)
        console.log(result, "display result")
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
            const galleryDetails = await resultDBServices.getFullHouseGalleryDetails(houseDetailsIds.gallery_id)
            console.log(userDetails)
            res.send({
                data: {
                    userDetails: userDetails,
                    propertyDetails: propertyDetails,
                    localityDetails: localityDetails,
                    rentalDetails: rentalDetails,
                    amenitiesDetails: amenitiesDetails,
                    scheduleDetails: scheduleDetails,
                    galleryDetails: galleryDetails
                }
            })
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
}