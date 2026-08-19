const adminAuth = (req,res,next)=>{
    // const token = req.body?.token
    const token = "xyz"
    const isAdminAuthorized = token==="xyz"
    if(!isAdminAuthorized){
        res.status(401).send("UnAuthorized Access Denied!")
    }
    else{
        next()
    }
}

module.exports = {adminAuth}