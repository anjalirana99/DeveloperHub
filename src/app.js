const express = require("express")
require('dotenv').config()
const {connectCluster} = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const http = require('http')
const { authRouter } = require("./router/auth")
const { profileRouter } = require("./router/profile")
const { requestRouter } = require("./router/requestRouter")
const { userRouter } = require("./router/userRouter")
const { initializeSocket } = require("./utils/socket")
const { chatRouter } = require("./router/chatRouter")

app.use(cors({
    origin : "http://localhost:5173",   //allow request from this origin 
    credentials: true                    //This server allows the browser to include and receive credentials (such as cookies) in cross-origin requests 
}))
app.use(express.json()) //middle ware to convert the json to JS object in incoming request for all routes
app.use(cookieParser()) //to read incoming cookies in request 

app.use("/",authRouter) // will route all paths to authRouter if match there return from res else will go below route handleres
app.use("/profile",profileRouter)  // will route all/profile path to profileRouter
app.use("/request",requestRouter)
app.use("/user",userRouter)
app.use("/chat", chatRouter)

const server = http.createServer(app)
initializeSocket(server)


connectCluster()
.then(()=>{
    console.log("DB Connected Succesfully!!!")   // first connect to DB then listen on server require is async but connectdb was async
    server.listen(7777,()=>{
    console.log("Server Started Succesfully at Port 7777.....")
})
})
.catch((err)=>{
    console.log("Error in DB Connection...")
})


