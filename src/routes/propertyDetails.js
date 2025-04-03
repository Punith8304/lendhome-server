import express from "express"
import { getCompletedPropertyList, createNewHouseItem } from "../controllers/currentPropertyController.js"
import { getPropertiesIds, getDisplayPropertyResult, getFullHouseDetails, getImage } from "../controllers/resultsController.js"
const router = express.Router()



router.get("/completed-properties-list", getCompletedPropertyList)
router.get("/create-new-house-item", createNewHouseItem)
router.post("/get-house-ids", getPropertiesIds)
router.post("/get-display-properties", getDisplayPropertyResult)
router.post("/get-full-house-details", getFullHouseDetails)
router.get("/images/:id", getImage)
export default router