import express, { Router } from "express"
import { upload } from "../middlewares/multerMiddleware.js"
import { uploadPropertyDetails } from "../controllers/propertyController.js"
import { uploadRentalDetails } from "../controllers/rentalController.js"
import { uploadAmenitiesDetails } from "../controllers/amenitiesController.js"
import { uploadLocalityDetails } from "../controllers/localityController.js"
import { uploadGalleryDetails } from "../controllers/galleryController.js"
import { uploadScheduleDetails } from "../controllers/scheduleController.js"
const router = express.Router()

router.post("/property-details", uploadPropertyDetails)
router.post("/locality-details", uploadLocalityDetails)
router.post("/rental-details", uploadRentalDetails)
router.post("/amenities-details", uploadAmenitiesDetails)
router.post("/gallery-details", upload.array("files", 10), uploadGalleryDetails)
router.post("/schedule-details", uploadScheduleDetails)
export default router