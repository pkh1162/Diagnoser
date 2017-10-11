
let bodyParser = require("body-parser");
let cookieParser = require('cookie-parser')
let dbModels = require("../models/index.js");
let doctorSockets = require("../socket.js").doctorSockets;
let ioio = require("../socket.js").exportIO;

const passport = require("passport");
let expressValidator = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const authController = {}


authController.post = (req, res, next) => {
    /*
        Triggers when user is signing in. Checks validations errors and
        signs user in if they exist in the database
    */
        
    req.body = JSON.parse(Object.keys(req.body)[0]);     
    const {usernameOrEmail, password} = req.body;

    req.checkBody("usernameOrEmail", "Username field cannot be empty.").notEmpty();
    req.checkBody("password", "Password field must not be empty.").notEmpty();    
    
    let errors = req.getValidationResult();

    errors.then(result => {
        if (!result.isEmpty()) {
            //If errors validations errors exist, send them back
            res.status(200).json({
                msg: "There have been some server side validation errors",
                errors: result.mapped()
            })
        }
        else {                    
            //If no validation errors, check db for user

            dbModels.User.find().byUsernameOrEmail(usernameOrEmail, usernameOrEmail).exec()
            .then(userTemp => {
                if(!userTemp){
                    //If no user exists, send back validation error.
                    res.status(200).json({
                        success: true,
                        errors: {
                            userExists: {
                                msg: "Invalid Credentials"
                            }
                        }
                    })
                }
                else {
                    //If user does exist, check their password.
                    bcrypt.compare(password, userTemp.localUser.password)
                    .then(function(passwordMatch) {
                        if(passwordMatch){
                
                            //if passwords match, sign the user in
                            userTemp.status = "active";
                            userTemp.save()
                            .then(
                                req.login(userTemp, (err) => {
                                next();
                                })
                            )
                            .catch(err => console.log("error setting status, local: ", err))
                        }
                        else{
                            //If password doesn't match, send back an error.
                            res.status(200).json({
                                success: true,
                                errors: {
                                    userExists: {
                                        msg: "Invalid Credentials"
                                    }
                                }
                            })      
                        }
                        
                    });
            
                }

            })
            .catch((err) => {
                res.status(500).json({
                    message: err
                })
            })
        }

    })
    

}


authController.authCheck = (req, res) => {
    /*
        Triggers when client wants to find out if user is authenticated. The user is authenticated 
        if req.isAuthenticated comes back as true, this is a function which is provided by passport
        when a user has signs in either locally or through a third party.
    */
    
    if (req.isAuthenticated()){
        
        if(req.session.passport.user.privilege === "doctor"){
            /*
                If user being authenticated is a doctor. Store their current IO cookie in the
                doctorSockets objects under their username. And emit an event to all users that
                a doctor is online and active.
            */  
            doctorSockets[req.session.passport.user.username] = req.cookies.io;
            ioio.io.sockets.emit("doctor entering");
        }
        
        //Send back user data to the client.
        res.status(200).json({
            success: true,
            userSession: true,
            userData: req.session.passport.user,
            privilege: req.session.passport.user.privilege,
            status: req.session.passport.user.status
        })

       
    }
    else {
        //If user is not authenticated, send back a false value for userSession 
        res.status(200).json({
            success: true,
            userSession: false
        })
    }
}





authController.logout = (req, res) => {

    if(req.session.passport.user.privilege === "doctor"){
        //When doctor logs out, update user sockets
        ioio.io.sockets.emit("doctor leaving")
    }
    
    /*
        Find user who wants to log out set their status to inactive and log them out.
    */
    dbModels.User.findOneAndUpdate({_id: req.session.passport.user.userID}, {$set: {status: "inactive"}})
    .then(() => {
        req.logout();
        res.status(200).json({
            success: true,
            userSession  : false,
            userData: {},
            myUser: {}
        })
    })
    .catch(err => console.log("problem logging user out: ", err))
     
}


module.exports  = authController;

