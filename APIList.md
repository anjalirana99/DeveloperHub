# API List that our DeveloperHub project will have 

## authRouter
POST/signup
POST/login
POST/logout


## profileRouter
GET/profile/view
PATCH/profile/edit
PATCH/profile/password


## connectionRequest
POST/request/send/interested/:userID
POST/request/send/ignored/:userID
POST/request/review/accepted/:requestID
POST/request/review/rejected/:requestID


## userRouter
GET/user/connection   // accepted request canbe send from loggedinuser or received to loggedinUSer 
GET/user/feed
GET/user/requests/received // all pending requests