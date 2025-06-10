import * as uploadService from "../services/uploadService.js"
import * as encrypt from "../utils/encryption.js";
import * as dbService from "../services/dbService.js"



export const userLogin = async (req,res) => {
    const userLoginDetails = req.body;
    const user = await dbService.getUser(userLoginDetails.email)
    if(user) {
        console.log(user, userLoginDetails, "details-login")
        const passwordCheck = await encrypt.comparePassword(userLoginDetails.password, user.user_password)
        if (passwordCheck) {
            req.session.user = {
                username: user.user_name,
                useremail: user.user_email,
                usermobile: user.user_mobile,
                userId: user.user_id,
                house: {
                    houseCreationInitialised: false
                }
            }
            console.log(req.sessionID, req.session)
            res.json({message: "user successfully logged in", login: true, user: req.session.user})
            console.log("user logged in successfully")
            
        } else {
            res.json({message: "Incorrect password", login: false, passwordError: true})
            console.log("incorrect password")
        }
    } else {
        console.log("user not found")
        res.json({message: "User not found", login: false, emailError: true})
    }
}



export const userSignUp = async (req, res) => {
    const userSignUpDetails = req.body;
    console.log(userSignUpDetails)
    const hashedPassword = await encrypt.createHash(userSignUpDetails.password)
    const user = await dbService.createUser(userSignUpDetails.username, userSignUpDetails.email, userSignUpDetails.mobile, hashedPassword)
    if(user) {
        req.session.user = {
            useremail: user.user_email,
            username: user.user_name,
            usermobile: user.user_mobile,
            userId: user.user_id,
            house: {
                houseCreationInitialised: false
            }
        }
        res.json({message: "user successfully registered & logged in", login: true, user: req.session.user})
        console.log("registered successfully")
    } else {
        console.log("not registered")
        res.json({message: "user not registered", displayError: "something went wrong", login: false})
        
    }
}
export const checkAuthentication = async (req, res) => {
    if(req.session.user) {
        console.log(req.session.user)
        res.json({login: true, user: req.session.user})
    } else {
        res.json({login: false})
    }
}


export const userLogout = async (req, res) => {
    req.session.destroy(async (error) => {
        if(error) {
            res.json({logoutStatus: false})
            console.log("logout failed", error)
        } else {
            res.json({logoutStatus: true})
            console.log("logout success")
        }
    })
}


export const addToWishList = async (req, res) => {
    const userId = req.session.user.userId;
    console.log(req.session, "successfully sent request to add to wish list")
    try {
        const addToWishListResult = await dbService.addToWishListService(userId, req.body.houseId)
        console.log(addToWishListResult)
        res.send({status: 200, data: addToWishListResult})
    } catch (error) {
        res.send(error); console.log(error);
    }
}


export const removeFromWishList = async (req, res) => {
    const userId = req.session.user.userId;
    try {
        const removeFromWishListResult = await dbService.removeFromWishListService(userId, req.body.houseId)
        res.send({status: 200, removed: removeFromWishListResult})
    } catch (error) {
        res.send(error); console.log(error);
    }
}


export const checkWishlist = async (req, res) => {
    const userId = req.session.user.userId
    try {
        const result = await dbService.checkWishlistService(userId, req.body.houseId)
        res.send({status: 200, exist: result})
    } catch (error) {
        res.send(error); console.log(error);
    }
}


export const getWishList = async (req, res) => {
    const userId = req.session.user.userId;
    try {
        console.log(userId)
        const getWishList = await dbService.getWishListIdService(userId)
        console.log(getWishList, "wishlist")
        res.send({wishList: getWishList, isEmpty: getWishList.length === 0})
    } catch (error) {
        res.send(error); console.log(error);
    }
}


export const getUserPostedPropertiesIds = async (req, res) => {
    const userId = req.session.user.userId;
    try {
        const getOwnerPropertyIds = await dbService.getOwnerPropertiesHouseIds(userId)
        console.log(getOwnerPropertyIds, "results rows")
        res.send({propertiesIds: getOwnerPropertyIds, isEmpty: getOwnerPropertyIds.length === 0})
    } catch (error) {
        res.send(error); console.log(error);
    }
}


export const removeUserProperty = async (req, res) => {
    const userId = req.session.user.userId;
    const houseId = req.body.houseId;
    try {
        const removePropertyResult = await dbService.removeProperty(userId, houseId)
        console.log("success")
        res.send({status: removePropertyResult ? 200 : 424})
    } catch (error) {
        res.send(error); console.log(error);
    }
}