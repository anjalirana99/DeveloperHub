const express = require("express")
const {connectCluster} = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")

const { authRouter } = require("./router/auth")
const { profileRouter } = require("./router/profile")
const { requestRouter } = require("./router/requestRouter")

app.use(express.json()) //middle ware to convert the json to JS object in incoming request for all routes
app.use(cookieParser()) //to read incoming cookies in request 

app.use("/",authRouter) // will route all paths to authRouter if match there return from res else will go below route handleres
app.use("/profile",profileRouter)  // will route all/profile path to profileRouter
app.use("/request",requestRouter)


connectCluster()
.then(()=>{
    console.log("DB Connected Succesfully!!!")   // first connect to DB then listen on server require is async but connectdb was async
    app.listen(7777,()=>{
    console.log("Server Started Succesfully at Port 7777.....")
})
})
.catch((err)=>{
    console.log("Error in DB Connection...")
})


