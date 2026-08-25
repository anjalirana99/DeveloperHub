const express = require("express")
const {connectCluster} = require("./config/database")
const app = express()
const {userModel} = require("./models/user")
const {validateSignUp} = require("./utils/validate")
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middleware/auth")

app.use(express.json()) //middle ware to convert the json to JS object in incoming request for all routes
app.use(cookieParser()) //to read incoming cookies in request 

// store user data dynamically 
app.post("/signup", async(req,res)=>{
    const userInfo = req.body
        try{
        //     const user = new userModel({
        //     firstName:"Pragyat",
        //     lastName:"Rana",
        //     email:"abc@gmail.com",
        //     password:"123",
        //     age:29
        // })
        validateSignUp(userInfo)  // API level Data Sanitization and validation 
        const hashPassword = await bcrypt.hash(req.body?.password,10)  // password Encryption 
        userInfo.password = hashPassword
        const user = new userModel(userInfo)
        await user.save()
        res.send("User Stored")
        }
        catch(err){
            res.status(500).send("Something Went Wrong: " + err.message)
        }
        
})

// login api using encrypted password 
app.post("/login",async(req,res)=>{
    try{ 
        const {email,password} = req.body
        const user = await userModel.findOne({email : email})

        if(!user)throw new Error("Invalid Creds")
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            throw new Error("Invalid Creds 222" )
        }
        const jwtToken = jwt.sign({_id: user._id},"SECRETKEY",{expiresIn:"1d"})
        res.cookie("accessToken",jwtToken,{expires : new Date(Date.now()+10000)}) // cookie expires in 10sec
        res.send("User Login Successfully")
    }
    catch(err){
            res.status(500).send("Something Went Wrong: " + err.message)
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

// get user by ID 
app.get("/user/:id",async(req,res)=>{
    try{
        const userId  = req.params.id
        const user = await userModel.findById(userId)
        if(user){
             res.send(user)
        }
        else{
            res.status(404).send("No Users Found!!")
        }

    }

    catch(err){
        res.status(500).send("Something Went Wrong")
    }
    

})

//get profile API 

app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user
        res.send(user)
    }catch(err){
        res.status(500).send("Something Went Wrong: " + err.message)
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

// post - send connection reqest api 

app.post("/sendRequest",userAuth,(req,res)=>{
    const user = req.user
    res.send(user.firstName + " sent the connect request!");
})



//delete by id api - DELETE / user -  Delete User From DB 

app.delete("/user/:id",async(req,res)=>{
    try{
        const userId  = req.params.id
        const user = await userModel.findByIdAndDelete(userId)
        if(user){
             res.send("Deleted User"+user)
        }
        else{
            res.status(404).send("User Not Found!!")
        }

    }

    catch(err){
        res.status(500).send("Something Went Wrong")
    }
})


// Update API - update User info by id 

app.patch("/user/:id",async(req,res)=>{
   
    try{
        const isAllowed = ["password","age","about","skills"]
        const isUpdateAllowed = Object.keys(req.body).every((key)=>isAllowed.includes(key))
        if(!isUpdateAllowed)throw new Error("Update not Allowed!")

        const userId = req.params.id
        const updatedData = req.body
        const user = await userModel.findByIdAndUpdate(userId,updatedData,{runValidators:true})
        if(user){
            res.send("Data Updated for the user " + user.firstName)
        }
        else{
            res.status(404).send("User Not Found!!")
        }
    }
    catch(err){
        res.status(500).send("Something Went Wrong: " + err.message)
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


