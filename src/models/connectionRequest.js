const mongoose = require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status:{
        type: String,
        required:true,
        enum:{
            values: ["interested","ignored","accepted","rejected"],
            message: '{VALUE} is not a Valid Staus!'
        }
    }
})

connectionRequestSchema.pre("save",function(){  //middleware run before saving the request in DB 
    const request = this
    if(request.fromUserId.equals(request.toUserId)){
        throw new Error("Cant Sent Request to Yourself")
    }
    // next() not required in pre in our version 
})

connectionRequestSchema.index({fromUserId:1,toUserId:1}) //compound Indexing 

const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports = {ConnectionRequestModel}