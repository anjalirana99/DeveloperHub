const express = require("express")
const app = express()
const {adminAuth} = require("./middleware/auth")

//Multiple routeHandler for one route 
app.get("/user",(req,res,next)=>{
    console.log("Hi from1")
        res.send("User FOund1")
            next();


})
app.get("/user",(req,res,next)=>{
    console.log("hi from2")
})

//MiddleWare for Admin Authorization
app.use("/admin",adminAuth)

app.use("/admin/getData",(req,res,next)=>{
    res.send("Data collected")
})
app.use("/admin/DeleteUser",(req,res,next)=>{
    res.send("User is Deleted Succesfully!!!")
})


// Error Handling
// 1- uding try catch block in handler 
//2- using wildcard handler with err 

app.get("/user/login",(req,res)=>{
    try{
        throw new Error()
        res.send("Loggein Succesfully!!!")
    }
    catch(err){
        res.status(500).send("Error in Login Service....")
    }
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something Went Wrong")
    }
})


app.listen(7777,()=>{
    console.log("Server Started Succesfully at Port 7777.....")
})