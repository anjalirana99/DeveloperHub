const {UserModel} = require("../models/user")
const jwt = require("jsonwebtoken")


const adminAuth = (req,res,next)=>{
    // const token = req.body?.token
    const token = "xyz"
    const isAdminAuthorized = token==="xyz"
    if(!isAdminAuthorized){
        res.status(401).send("UnAuthorized Access Denied!")
    }
    else{
        next()
    }
}

const userAuth = async(req,res,next)=>{
    try{
        const cookies = req.cookies
        const {accessToken} = req.cookies
        if(!accessToken) throw new Error("Token is not Present!!!") 
        const decodedData = await jwt.verify(accessToken,"SECRETKEY")
        const{_id} = decodedData
        const user = await UserModel.findById(_id)
        if(!user) throw new Error("User Not Exist....")
        else{
            req.user = user
            next()
        }
    }catch(err){
        res.status(500).send("Something Went Wrong: " + err.message)
    }
}

module.exports = {adminAuth, userAuth}