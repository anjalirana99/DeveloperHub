const express = require("express")
const {connectCluster} = require("./config/database")
const app = express()
const {userModel} = require("./models/user")

app.post("/signup", async(req,res)=>{

        try{
            const user = new userModel({
            firstName:"Pragyat",
            lastName:"Rana",
            email:"abc@gmail.com",
            password:"123",
            age:29
        })
        await user.save()
        res.send("User Stored")
        }
        catch(err){
            console.log(err)
            res.status(500).send(err)
        }
        
})


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


