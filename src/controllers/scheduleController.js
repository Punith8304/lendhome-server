import * as uploadService from "../services/uploadService.js"
import * as dbServices from "../services/dbService.js"
import uploadQueryMaker from "../utils/queryObjectMaker.js"


export const uploadScheduleDetails = async (req, res) => {
    const scheduleDetails = req.body
    const houseId = req.session.user.house.houseId
    if (scheduleDetails.available_allday === true) {
        scheduleDetails.start_time = "allday"
        scheduleDetails.end_time = "allday"
        console.log(scheduleDetails)
    }
    try {
        const { queryColumns, queryValues, queryPlaceHolders } = uploadQueryMaker(scheduleDetails)
        const query = `INSERT INTO schedule (${queryColumns}) VALUES (${queryPlaceHolders}) RETURNING *`
        const uploadedResult = await uploadService.createNewProperty(query, queryValues)
        const columnValue = uploadedResult.rows[0].schedule_id
        try {
            const result = await dbServices.updateHouse("schedule_id", columnValue, houseId)
            res.send({status: 200})
        } catch (error) {
            res.send(error); console.log(error);
        }
    } catch (error) {
        res.send(error); console.log(error);
    }
}