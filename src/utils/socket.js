const socket = require('socket.io')
const crypto = require('crypto')
const { ChatModel } = require('../models/chat')
const { validateBothareConnection } = require('./validate')

const getRoomId = (userId,targetId)=>{
    return crypto
        .createHash("sha256")
        .update([userId, targetId].sort().join("_"))
        .digest("hex")

}
const initializeSocket = (server)=>{
    const io = socket(server,{
        cors:{
            origin : "http://localhost:5173"
        }
    })

    io.on("connection",(socket)=>{
        socket.on("joinchat",({userName ,userId, targetId})=>{
            const roomid = getRoomId(userId, targetId)
            console.log(userName + " join the chat" + roomid)
            socket.join(roomid)
        })

        socket.on("sendMessage",async({firstName,lastName,userId,targetId,text})=>{
            try{  // save the message to DB after validation 
                const roomid = getRoomId(userId, targetId)
            const areConnected = validateBothareConnection(userId, targetId)
            if(!areConnected){
                socket.emit("messageError", {
                    message: "You can only send messages to your connections."
                });
                return;  
            }
            let chat = await ChatModel.findOne({
                participants :{$all: [userId, targetId]}
            })
            if(!chat){
                chat = new ChatModel({
                    participants : [userId, targetId],
                    messages : []
                })
                
            }
            chat.messages.push({
                senderId : userId,
                text
            })
            await chat.save()
            io.to(roomid).emit("messageReceived",{senderId : userId,firstName, lastName, text })
            }
            catch(err){
                console.log(err)
            }
            
        })
        socket.on("disconnect",()=>{

        })
    })
}

module.exports = {initializeSocket}