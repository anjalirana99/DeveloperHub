const validate = require("validator")

const validateSignUp = (userInfo)=>{
    const  {firstName, lastName, email,password} = userInfo
    if(!firstName){
        throw new Error("First Name should not be Empty!!!1")
    } 
    else if(!validate.isEmail(email)){
        throw new Error("Email Not Valid")
    }
    else if(!validate.isStrongPassword(password)){
        throw new Error("PassWord is not Strong")
    }
}

module.exports = {validateSignUp}