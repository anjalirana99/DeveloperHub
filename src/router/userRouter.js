const { userAuth } = require("../middleware/auth")
const { ConnectionRequestModel } = require("../models/connectionRequest")

const express = require("express")
const { UserModel } = require("../models/user")
const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName age about skills"

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
            result : connectionRequest
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

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const page = parseInt(req.query?.page)  || 1
        let limit = parseInt(req.query?.limit)  || 10

        limit = limit>100 ? 100 : limit


        const loggedInUserID = req.user._id
        const connections = await ConnectionRequestModel.find({
            $or:[
                {fromUserId : loggedInUserID},
                {toUserId : loggedInUserID}
            ]
        }).select(["fromUserId" , "toUserId"])

        const connectionsId = new Set();
        connections.forEach((conn)=>{
            connectionsId.add(conn.toUserId)
            connectionsId.add(conn.fromUserId)
        })

        const skipcontacts = (page-1)*limit
        const feed = await UserModel.find({
            $and:[
                {_id : {$nin : Array.from(connectionsId)}},
                {_id: {$ne: loggedInUserID}}
            ]
        }).select(USER_SAFE_DATA).skip(skipcontacts).limit(limit)

        res.send({
            message : "Devs You may be interested in : ",
            result : feed
        })
    }
    catch(err){
        res.status(500).send("Something went wrong : " + err.message)
    }
})

module.exports = {userRouter}