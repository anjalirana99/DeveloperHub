const express = require("express")
const app = express()



app.use("/test",(req,res)=>{
    res.send("Hello From Node Server Testinggg!")
})

app.use("/user",(req,res)=>{
    res.send("Code Sequence Matter use will run for get post ")
})
app.get("/user",(req,res)=>{
    res.send({firstname:"Anjali",lastname:"Rana"})
})
app.post("/user",(req,res)=>{
    res.send("Data Saved Succesfully!!!")
})
app.delete("/user",(req,res)=>{
    res.send("Data Deleted Succesfully!!!")
})

app.listen(7777,()=>{
    console.log("Server Started Succesfully at Port 7777.....")
})