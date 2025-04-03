import db from "../config/databaseConfig.js"



export const getAllPropertiesUnderCoordinatesService = async (latitude, longitude) => {
    try {
        const query = `SELECT house.house_id 
                        FROM house 
                        INNER JOIN locality ON locality.locality_id = house.locality_id 
                        INNER JOIN area ON locality.area_id = area.area_id 
                        WHERE area.latitude < $1  AND area.latitude > $2 AND area.longitude < $3 AND area.longitude > $4
                        AND house.* IS NOT NULL`
        const result = await db.query(query, [latitude + 0.02, latitude - 0.02, longitude + 0.02, longitude - 0.02])
        if (!result.rows[0]) {
            const outerAreaResult = await db.query(query, [latitude - 0.09, latitude + 0.09, longitude - 0.09, longitude + 0.09])
            return outerAreaResult.rows
        } else {
            return result.rows
        }
    } catch (error) {
        console.log(error)
    }
}


export const getDisplayPropertyResultService = async (houseId) => {
    try {
        const query = `SELECT house.house_id, house.gallery_id, housetype.house_type, area.area_name, preferred_tenants.id, property.area_builtup, apartment.apartment_type, rental.expected_rent, rental.deposit_amount, rental.rent_negotiable, furnished.furnishedtype, preferred_tenants.*, rental.available_from
                        FROM house
                        INNER JOIN property ON house.property_id = property.property_id
                        INNER JOIN rental ON house.rental_id = rental.rental_id 
                        INNER JOIN housetype ON housetype.id = property.house_type
                        INNER JOIN apartment ON property.apartment_type = apartment.apartment_id
                        INNER JOIN furnished ON furnished.furnished_id = rental.furnished
                        INNER JOIN preferred_tenants ON preferred_tenants.id = rental.preferred_tenants
                        INNER JOIN locality ON house.locality_id = locality.locality_id
                        INNER JOIN area ON area.area_id = locality.area_id
                        WHERE house_id = $1`
        const result = await db.query(query, [houseId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const fullPropertyResultDetailsIds = async (houseId) => {
    try {
        const query = `SELECT * FROM house WHERE house_id = $1`
        const result = await db.query(query, [houseId])
        console.log(result.rows[0])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const getFullUserDetails = async (userId) => {
    try {
        const query = `SELECT user_id, user_name, user_mobile, user_email FROM users WHERE user_id = $1`
        const result = await db.query(query, [userId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const getFullHousePropertyDetails = async (propertyId) => {
    try {
        const query = `SELECT property.current_floor, property.total_floor, property.area_builtup, apartment.apartment_type, housetype.house_type, propertyage.property_age, housedirection.facing_direction 
                        FROM property
                        INNER JOIN apartment ON apartment.apartment_id = property.apartment_type
                        INNER JOIN housetype ON housetype.id = property.house_type
                        INNER JOIN propertyage ON property.property_age = propertyage.id
                        INNER JOIN housedirection ON housedirection.id = property.house_facing
                        WHERE property.property_id = $1`
        const result = await db.query(query, [propertyId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const getFullHouseLocalityDetails = async (localityId) => {
    try {
        const query = `SELECT city.city_name, area.area_name, street
                        FROM locality
                        INNER JOIN area ON area.area_id = locality.area_id
                        INNER JOIN city ON city.city_id = locality.city_id
                        WHERE locality.locality_id = $1`
        const result = await db.query(query, [localityId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const getFullHouseRentalDetails = async (rentalId) => {
    try {
        const query = `SELECT rental.*, preferred_tenants.*, furnished.furnishedtype, parking.parking_type
                        FROM rental
                        INNER JOIN preferred_tenants ON preferred_tenants.id = rental.preferred_tenants
                        INNER JOIN furnished ON furnished.furnished_id = rental.furnished
                        INNER JOIN parking ON parking.parking_id = rental.parking
                        WHERE rental.rental_id = $1`
        const result = await db.query(query, [rentalId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const getFullHouseAmenitiesDetails = async (amenitiesId) => {
    try {
        const query = `SELECT amenities.*, watersupply.supply_type, property_show.shown, additional_amenities.*
                        FROM amenities
                        INNER JOIN additional_amenities ON amenities.additional_amenities = additional_amenities.id
                        INNER JOIN watersupply ON watersupply.id = amenities.water_supply
                        INNER JOIN property_show ON property_show.id = amenities.property_show
                        WHERE amenities.amenities_id = $1`
        const result = await db.query(query, [amenitiesId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const getFullHouseScheduleDetails = async (scheduleId) => {
    try {
        const query = `SELECT schedule.*, available_day.availability
                        FROM schedule
                        INNER JOIN available_day ON schedule.available_day = available_day.id
                        WHERE schedule.schedule_id = $1`
        const result = await db.query(query, [scheduleId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}


export const getFullHouseGalleryDetails = async (houseId) => {
    try {
        const query = `SELECT images_id FROM gallery
                        WHERE house_id = $1`
        const result = await db.query(query, [houseId])
        return result.rows
    } catch (error) {
        console.log(error)
    }
}


export const getImage = async (imageId) => {
    console.log(imageId, "image id")
    try {
        const result = await db.query('SELECT * FROM gallery WHERE images_id = $1', [imageId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
    }
}