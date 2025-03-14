import express from "express"
import {checkAuthentication, userLogin, userSignUp, userLogout} from "../controllers/userController.js"

const router = express.Router()
router.post("/login", userLogin)
router.post("/signup", userSignUp)
router.get("/logout", userLogout)
router.get("/check-authentication", checkAuthentication)
export default router