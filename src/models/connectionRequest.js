const mongoose = require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
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

connectionRequestSchema.pre("save",function(next){  //middleware run before saving the request in DB 
    const request = this
    if(request.fromUserId.equals(request.toUserId)){
        throw new Error("Cant Sent Request to Yourself")
    }
    next()
})

connectionRequestSchema.index({fromUserId:1,toUserId:1}) //compound Indexing 

const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports = {ConnectionRequestModel}