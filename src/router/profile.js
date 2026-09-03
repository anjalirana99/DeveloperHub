const express = require("express")
const { userAuth } = require("../middleware/auth")
const profileRouter = express.Router()
const validate = require("validator")
const bcrypt = require("bcrypt")
const { validateProfileUpdate } = require("../utils/validate")
const { USER_SAFE_DATA } = require("../utils/constants")
const { UserModel } = require("../models/user")

profileRouter.get("/view",userAuth,async(req,res)=>{
    try{
        const user = req.user // append in req by userAuth
        const safeUser = await UserModel
                                .findById(user._id)
                                .select(USER_SAFE_DATA);
        res.send(safeUser)
    }
    catch(err){
        res.status(500).send("Something Went Wrong: " + err.message)
    }
})

profileRouter.patch('/edit',userAuth,async(req,res)=>{

    try{
        if(!validateProfileUpdate(req)){
            throw new Error("Invalid Edit Request....")
        }
        const user = req.user
        Object.keys(req.body).forEach((key)=>(user[key] = req.body[key]))
        await user.save()  // saving updated user
        const safeUser = await UserModel
                                .findById(user._id)
                                .select(USER_SAFE_DATA);
        res.json({
            message : `${user.firstName}, your Profile updated successfuly...`,
            result : safeUser
        })
    }
    catch(err){
        res.status(500).send("Something Went Wrong: " + err.message)
    }
    
})

profileRouter.patch("/password",userAuth,async (req,res)=>{
    try{
        const user  = req.user
        const newPassword = req.body?.password
        if(!validate.isStrongPassword(newPassword)) throw new Error ("Enter a Valid Password")
        const hashPassword = await bcrypt.hash(newPassword,10)  // password Encryption 
        user.password = hashPassword
        await user.save()
        res.send(`Password Updated for the user : ${user.firstName}`)
    }
    catch(err){
        res.status(500).send("Something Went Wrong: " + err.message)
    }
})

module.exports = {profileRouter}