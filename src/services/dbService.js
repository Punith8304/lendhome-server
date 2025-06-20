import db from "../config/databaseConfig.js"

export const getUser = async (userEmail) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE user_email = $1', [userEmail])
        return user.rows[0]
    } catch (error) {
        console.log(error)
        return error
    }
}
export const createUser = async (userName, email, mobile, password) => {
    try {
        const user = await db.query('INSERT INTO users (user_name, user_email, user_mobile, user_password) VALUES ($1, $2, $3, $4) RETURNING *', [userName, email, mobile, password])
        console.log("success register")
        return user.rows[0]
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getCityId = async (city) => {
    try {
        const cityResult = await db.query('SELECT * FROM city WHERE city_name = $1',[city])
        console.log(cityResult.rows)
        return cityResult.rows[0].city_id;
    } catch(error) {
        console.log(error)
        return error
    }
}



export const createNewHouseItem = async (userId) => {
    try {
        const result = await db.query('INSERT INTO house (user_id) VALUES ($1) RETURNING *', [userId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
        return error
    }
}


export const updateHouse = async (columnName, columnValue, houseId) => {
    try {
        const query = `UPDATE house SET ${columnName} = $1 WHERE house_id = $2 RETURNING *`
        const result = await db.query(query, [columnValue, houseId])
        console.log(result.rows[0], query, columnName, columnValue, houseId, "update house")
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getCompletedPropertyList = async (houseId) => {
    try {
        const result = await db.query('SELECT * FROM house WHERE house_id = $1', [houseId])
        const houseRow = result.rows[0]
        console.log(houseRow, "houseRow")
        const completedList = []
        var currentProperty = false
        for (let key in houseRow) {
            if (houseRow[key]) {
                console.log(key)
                completedList.push(key.split("_")[0])
            } else if (currentProperty === false) {
                currentProperty = true
                currentProperty = key.split("_")[0]
            }
        }
        console.log(completedList.length)
        return {
            completedList: completedList,
            houseCreationInitialised: (8 === completedList.length) ? false : true,
            currentProperty: currentProperty
        }
    } catch (error) {
        console.log(error)
        return error
    }
}


export const addToWishListService = async (userId, houseId) => {
    try {
        const result = await db.query('INSERT INTO wishlist (house_id, user_id) VALUES ($1, $2) RETURNING *', [houseId, userId])
        return result.rows[0]
    } catch (error) {
        console.log(error)
        return error
    }
}



export const removeFromWishListService = async (userId, houseId) => {
    try {
        const result = await db.query('DELETE FROM wishlist WHERE user_id = $1 AND house_id = $2;', [userId, houseId])
    } catch (error) {
        console.log(error)
        return error
    }
}


export const checkWishlistService = async (userId, houseId) => {
    try {
        const result = await db.query('SELECT * FROM wishlist WHERE user_id = $1 AND house_id = $2', [userId, houseId]);
        if(result.rows.length > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

export const getWishListIdService = async (userId) => {
    try{
        const result = await db.query('SELECT * FROM wishlist WHERE user_id = $1', [userId])
        return result.rows
    } catch (error) {
        console.log(error)
        return error
    }
}


export const getOwnerPropertiesHouseIds = async (userId) => {
    try {
        const result = await db.query('SELECT * FROM house WHERE user_id = $1 AND house.* IS NOT NULL', [userId])
        console.log(result.rows, "user property result")
        const propertiesId = []
        result.rows.forEach((element) => {
            propertiesId.push(element.house_id)
        })
        return propertiesId
    } catch (error) {
        console.log(error)
        return error
    }
}


export const removeProperty = async (userId, houseId) => {
    try {
        const result = await db.query('DELETE FROM house WHERE user_id = $1 AND house_id = $2', [userId, houseId])
        return true
    } catch (error) {
        console.log(error)
        return error
    }
}