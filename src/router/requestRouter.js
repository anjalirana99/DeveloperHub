const express = require("express")
const { userAuth } = require("../middleware/auth")
const { ConnectionRequestModel } = require("../models/connectionRequest")
const { UserModel } = require("../models/user")
const requestRouter = express.Router()

requestRouter.post("/send/:status/:userId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status

        const allowedStatus = ["interested","ignored"]
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid Status ....")
        }

        const toUser = await UserModel.findById(toUserId)
        if(!toUser){
            return res.status(400).send("User Not Found ....")
        }

        const isConnectionExist = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(isConnectionExist){
            return res.status(400).send("Connection Request Already Exist...")
        }


        const requestData = new ConnectionRequestModel({
            fromUserId,toUserId,status
        })

        await requestData.save()
        res.send("Connection Request Send Successfully....")

    }
    catch(err){
        res.status(500).send("Something went wrong : " + err.message)
    }
})


module.exports = {requestRouter}