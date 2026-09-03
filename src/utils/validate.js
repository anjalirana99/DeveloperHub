const validate = require("validator")
const { UserModel } = require("../models/user")

const validateSignUp = (userInfo)=>{
    const  {firstName, lastName, email,password} = userInfo
    if(!firstName || !lastName){
        throw new Error("Name should not be Empty!!!1")
    } 
    else if(!validate.isEmail(email)){
        throw new Error("Email Not Valid")
    }
    else if(!validate.isStrongPassword(password)){
        throw new Error("PassWord is not Strong")
    }
}

const validateLogin = async(req)=>{
    const {email,password} = req.body
        const user = await UserModel.findOne({email : email})
        if(!user) return null

        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            return null
        }
        else{
            return user
        }
}

const validateProfileUpdate = (req)=>{
    const allowedEditFields = ["firstName","lastName","photoUrl", "age","about","skills", "gender"]
    const isUpdateAllowed = Object.keys(req.body).every((key)=>allowedEditFields.includes(key))
    return isUpdateAllowed
}

module.exports = {validateSignUp, validateLogin, validateProfileUpdate}