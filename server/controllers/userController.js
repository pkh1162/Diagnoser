let dbModels = require("../models/index.js");
let expressValidator = require("express-validator");
let bodyParser = require("body-parser");
let cookieParser = require('cookie-parser')
const passport = require("passport");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {
}


/*
//Not used but can be used to get all users

userController.get = (req, res) => {
    dbModels.User.find({})
         .then(users => {
            return res.status(200).json({
                success: true,
                usersData: users
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}

*/

/*
//Could be modified later on to save diagnosis to database, but I doubt I will go down this route
userController.saveDiagnosis = (req, res) => {
    console.log("the userID is: ", req.session)
    res.status(400).json({});
}
*/

userController.post = (req, res, next) => {
    /*
        Triggered when user sends form data when signing up. Checks to see if form input is valid
        and if so, sign them up and encrypt their password. If not, or if user data already exists,
        send back an error.
    */
        
    req.body = JSON.parse(Object.keys(req.body)[0]);     
    const {username, email, password, passwordMatch} = req.body;

    //Error validation tests the results can be retrieved through req.getValidationResults 
    req.checkBody("username", "Username field cannot be empty.").notEmpty();
    req.checkBody("username", "Username must be between 4 and 15 characters.").len(4, 15);
    req.checkBody("email", "Email entered is not a valid email address.").isEmail();
    req.checkBody("email", "Email must be between 4 and 100 characters.").len(4, 100);
    req.checkBody("password", "Password field must be between 8 and 100 characters.").len(8, 100);    
    req.checkBody("passwordMatch", "Password field must be between 8 and 100 characters.").len(8, 100);
    req.assert("passwordMatch", "Passwords do not match.").equals(password);
    //////////////////////////////////////////////////////////////////////////////////////
    
    let errors = req.getValidationResult();

    errors.then(result => {
        if (!result.isEmpty()) {
            //If there are validations errors, send them back to client to be rendered.
            res.status(200).json({
                msg: "There have been some server side validation errors",
                errors: result.mapped()
            })
        }
        else {
            //If there are no validations errors, check db to see if user exists or sign them up.

            const user = new dbModels.User({
                privilege: "user",
                status: "active",
                localUser : {
                    username,
                    email
                }   
            });
          
            dbModels.User.find().byUsernameOrEmail(username, email).exec()
            .then(userTemp => {

                if(!userTemp){
                    bcrypt.hash(password, saltRounds)
                    .then(hash => {
                        user.localUser.password = hash;
                        user.status  = "active";
                        user.save()
                        .then(newUser => {                                    
                            req.login(newUser, (err) => {
                                next();
                            })                                    
                        })
                    })                    
                }
                else {
                    res.status(200).json({
                        success: true,
                        errors: {
                            userExists: {
                                msg: "username or password already exist"
                            }        
                        }
                    })
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



userController.getDoctors = (req, res) => {
    /*
        Finds and returns all users which are doctors
    */

    dbModels.User.find({privilege: "doctor"})
        .then(doctors => {
            let docArr = doctors.map((doctor, i) => {
                let data = doctor.localUser ? doctor.localUser : doctor.strategyUser;
                return {
                    username: data.username,
                    id: doctor._id,
                    status: doctor.status
                }
            })
             
            res.status(200).json({
                success: true,
                data: docArr
            })
        })
        .catch(err => console.log("problem retrieving doctor list"))

    }


module.exports  = userController;








        
        