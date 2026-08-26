# Developer Hub 
## Dev Community Platform to connect with other developers and make interesting projects together


process - 

Initialize the project 
install express
create instance of express server 
create request handlers and listen on port 7777
install nodemon to refresh server when saving any change

install mongoose
make DB connection 


create Schema , collections 
create APIs 
validation using validator 
password encryption using bcrypt 


## Authentication in subsequent requests from client - using JWT token and cookies 

install - cookie-parser library to read cookies at server

install jsonwebtoken library 
create JWT token send payload inside it  
read jwt token decode it and find the loggedin user profile via /profile api  


userAuth middleware in all apis except login and signup --
ex- profile and sendrequest api 
expiry set in JWT token and cookies


user schema methods instead of validating password and creating jwt token at login api gateway attach the function to user schema so that u can just simply call these methods of user instance when login 


## flow for DEVELOPER HUB APIS 
Auhentication -> Validation and Sanitization at API level -> valdation at schema level -> response cycle 

express routes- 
auth route 
profiel route to handle /profile request 

validation using 
mongoose schema pre 
enum 
logical query - $or 


