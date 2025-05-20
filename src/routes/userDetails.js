import express from "express"
import { checkAuthentication, userLogin, userSignUp, userLogout, addToWishList, getWishList, getUserPostedPropertiesIds, removeFromWishList, checkWishlist, removeUserProperty } from "../controllers/userController.js"

const router = express.Router()
router.post("/login", userLogin)
router.post("/signup", userSignUp)
router.get("/logout", userLogout)
router.get("/check-authentication", checkAuthentication)
router.post("/add-to-wishlist", addToWishList)
router.post("/remove-from-wishlist", removeFromWishList)
router.post("/check-wishlist", checkWishlist)
router.get("/get-wishlist", getWishList)
router.get("/get-posted-properties", getUserPostedPropertiesIds)
router.post("/remove-property", removeUserProperty)


export default router