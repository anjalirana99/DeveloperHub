const express = require("express")
const {connectCluster} = require("./config/database")
const app = express()
const {userModel} = require("./models/user")

app.use(express.json()) //middle ware to convert the json to JS object in incoming request for all routes


// store user data dynamically 
app.post("/signup", async(req,res)=>{
    const userInfo = req.body
    console.log(userInfo)
        try{
        //     const user = new userModel({
        //     firstName:"Pragyat",
        //     lastName:"Rana",
        //     email:"abc@gmail.com",
        //     password:"123",
        //     age:29
        // })
        const user = new userModel(userInfo)
        await user.save()
        res.send("User Stored")
        }
        catch(err){
            res.status(500).send("Something Went Wrong")
        }
        
})

//get one user by email
app.get("/user",async (req,res)=>{

    try{
        const userEmail = req.query.email
        const user = await userModel.find({email:userEmail})

        if(user.length !== 0){
            res.send("User Found" + user)
        }
        else{
            res.status(404).send("User Not Found!!")
        }
    }
    catch(err){
        res.status(500).send("Something Went Wrong")
    }
    
    
})

// Feed API - GEt /feed - get All User from DataBase

app.get("/feed",async(req,res)=>{
    try{
        const users = await userModel.find({})
        if(users.length !==0){
            res.send(users)
        }
        else{
            res.status(404).send("No Users Found!!")
        }
    }
    catch(err){
        res.status(500).send("Something Went Wrong")
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


