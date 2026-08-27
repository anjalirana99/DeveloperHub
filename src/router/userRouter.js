const { userAuth } = require("../middleware/auth")
const { ConnectionRequestModel } = require("../models/connectionRequest")

const express = require("express")
const userRouter = express.Router()

userRouter.get("/request/received",userAuth, async(req,res)=>{

    try{
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequestModel.find({
        toUserId: loggedInUser._id,
        status : "interested"
        }).populate("fromUserId",["firstName","lastName"])
        if(connectionRequest.length === 0){
            res.status(404).send("No Connection Requests...")
            
        }

        res.json({
            message: "Connection Requests Found for "+ loggedInUser.firstName,
            data : connectionRequest
        })
    }
    catch(err){
        res.status(500).send("Something went wrong : " + err.message)
    }
    
})

userRouter.get("/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUserID = req.user._id
        const connections = await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUserID , status: "accepted"},
                {toUserId : loggedInUserID, status:"accepted"}
            ]
        })
        .populate("fromUserId", ["firstName", "lastName"])
        .populate("toUserId", ["firstName", "lastName"])

        if(connections.length === 0){
            res.status(404).send("No connections Found")
        }
        const data = connections.map((row)=>{
            if(row.fromUserId._id === loggedInUserID) return row.toUserId
            else return  row.fromUserId
        })
        res.json({
            message : "All connections for " + req.user.firstName,
            data 
        })
    }
    catch(err){
        res.status(500).send("Something went wrong : " + err.message)
    }
})

module.exports = {userRouter}