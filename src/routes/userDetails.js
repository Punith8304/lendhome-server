import express from "express"
import { checkAuthentication, userLogin, userSignUp, userLogout, addToWishList, getWishList, getUserPostedPropertiesIds } from "../controllers/userController.js"

const router = express.Router()
router.post("/login", userLogin)
router.post("/signup", userSignUp)
router.get("/logout", userLogout)
router.get("/check-authentication", checkAuthentication)
router.post("/add-to-wishlist", addToWishList)
router.get("/get-wishlist", getWishList)
router.get("/get-posted-properties", getUserPostedPropertiesIds)

export default router