const express = require("express")
const authRouter = express.Router()
const bcrypt = require('bcrypt');
const {UserModel} = require("../models/user")
const {validateSignUp, validateLogin} = require("../utils/validate")



authRouter.post("/signup", async(req,res)=>{
    const userInfo = req.body
        try{
        validateSignUp(userInfo)  // API level Data Sanitization and validation 
        const hashPassword = await bcrypt.hash(req.body?.password,10)  // password Encryption 
        userInfo.password = hashPassword
        const user = new UserModel(userInfo)
        await user.save()
        res.send("User Stored")
        }
        catch(err){
            res.status(500).send("Something Went Wrong: " + err.message)
        }
        
})

authRouter.post("/login",async(req,res)=>{
    try{ 
        const user = await validateLogin(req)
        if(!user) throw new Error("Invalid Creds...." )

        const jwtToken = user?.getJWT()
        res.cookie("accessToken",jwtToken,{expires : new Date(Date.now()+40*60 *1000)}) // cookie expires in 40min
        res.send("User Login Successfully")
    }
    catch(err){
            res.status(500).send("Something Went Wrong: " + err.message)
        }
    
    
})

authRouter.post("/logout",(req,res)=>{
    res.cookie("accessToken" , null, {expires: new Date(Date.now())})
    res.send("User Logout Successfully....")
})


module.exports = {authRouter}