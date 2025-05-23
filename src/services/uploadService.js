import db from "../config/databaseConfig.js"

export const createNewProperty = async (query, objectValues) => {
    try {
        const result = await db.query(query, objectValues)
        return result
    } catch (error) {
        res.send(error)
    }
}