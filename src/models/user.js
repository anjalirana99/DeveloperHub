const mongoose = require("mongoose")
const validate = require("validator")

const UserSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required: true,
        trim: true,
        minLength: 4
    },
    lastName :{
        type: String,
        required: true,
        trim:true,
        minLength :4 
    },
    email :{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
        validate(value){
            const isValid = validate.isEmail(value)
            if(!isValid){
                throw new Error("Email is Not Valid")
            }
        }
    },
    password :{
        type: String,
        required: true,
        validate(value){
            const isValid = validate.isStrongPassword(value)
            if(!isValid){
                throw new Error("PassWord is not Strong")
            }
        }
    },
    age :{
        type: Number,
        min: 18
    },
    gender:{
        type: String,
        validate(value){
            const isAllowed = ["Male","Female","Others"]
            if(!isAllowed.includes(value)){
                throw new Error("Gender is Not Valid")
            }
        }
    },
    about:{
        type: String,
        default: "This is Default About"
    },
    skills:{
        type:[String]
    }
    
},{timestamps: true})


const userModel = mongoose.model("User",UserSchema)
module.exports = {userModel}