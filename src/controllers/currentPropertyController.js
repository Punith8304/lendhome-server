import db from "../config/databaseConfig.js";
import * as dbServices from "../services/dbService.js";




export const getCompletedPropertyList = async (req, res) => {
    if(req.session.user.house.houseCreationInitialised) {
        const result = await dbServices.getCompletedPropertyList(req.session.user.house.houseId)
        req.session.user.house = {
            ...req.session.user.house,
            ...result
        }
        res.send({status: 200, updateUser: req.session.user})
        console.log(req.session.user, "completed-property-list")
    }
}




export const createNewHouseItem = async (req, res) => {
    const user = await dbServices.getUser(req.session.user.useremail)
    try {
        const houseCreated = await dbServices.createNewHouseItem(user.user_id)
        req.session.user.house = {houseId: houseCreated.house_id, houseCreationInitialised: true, currentProperty: "property", completedList: []}
        res.send({status: 200, updateUser: req.session.user})
        console.log("create house item")
    } catch (error) {
        console.log(error)
    }
}