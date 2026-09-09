const express = require('express')
const { userAuth } = require('../middleware/auth')
const { ChatModel } = require('../models/chat')
const chatRouter = express.Router()


chatRouter.get("/:targetId" , userAuth, async (req,res)=>{
    try{
        const {targetId}  = req.params
        const userId = req.user._id // by userAuth 
        let chat = await ChatModel.findOne({
            participants :{$all: [userId, targetId]}
        }).populate({
            path : "messages.senderId",
            select : "firstName lastName"
        })
        if(!chat){ // if chat not exist first time create a empty chat with participants and save it and return 
            chat = new ChatModel({
                participants : [userId, targetId],
                messages : []
            })
        }
        await chat.save()
        res.json({
            message : "Your Chat is Here",
            results : chat
        })
    }
    catch(err){
        res.status(500).send("Something went wrong : " + err.message)

    }
})

module.exports = {chatRouter}