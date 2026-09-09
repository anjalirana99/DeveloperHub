const socket = require('socket.io')
const crypto = require('crypto')

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
            console.log(userName + " joint the chat" + roomid)
            socket.join(roomid)
        })

        socket.on("sendMessage",({firstName,lastName,userId,targetId,text})=>{
            const roomid = getRoomId(userId, targetId)
            io.to(roomid).emit("messageReceived",{senderId : userId,firstName, lastName, text })
        })
        socket.on("disconnect",()=>{

        })
    })
}

module.exports = {initializeSocket}