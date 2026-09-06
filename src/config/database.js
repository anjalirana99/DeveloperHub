const mongoose = require("mongoose")

const connectCluster = async()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
}

module.exports = {connectCluster}