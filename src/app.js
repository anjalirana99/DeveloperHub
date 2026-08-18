const express = require("express")
const app = express()



app.use("/test",(req,res)=>{
    res.send("Hello From Node Server Testinggg!")
})
app.use("/hello",(req,res)=>{
    res.send("Hello From Node Server Hellooooo!")
})
app.use("/",(req,res)=>{   //putting home route at last bcz /test -> app.use("/")-> MATCHES!->res.send(...)
    res.send("Hello From Node Server Home!")
})

app.listen(7777,()=>{
    console.log("Server Started Succesfully at Port 7777.....")
})