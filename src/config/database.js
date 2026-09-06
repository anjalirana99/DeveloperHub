const mongoose = require("mongoose")

const connectCluster = async()=>{
    await mongoose.connect("mongodb+srv://nodeProject_db_user:k2MtPvwL5vBWOEcn@nodeproject.jdef6oa.mongodb.net/DeveloperHub")
}

module.exports = {connectCluster}