const express = require("express")
const {connectCluster} = require("./config/database")
const app = express()


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


