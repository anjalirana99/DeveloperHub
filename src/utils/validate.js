const validateSignUp = (userInfo)=>{
   const  {firstName, lastName, email,password} = userInfo
   if(!firstName) throw new Error("First Name should not be Empty!!!1")
}

module.exports = {validateSignUp}