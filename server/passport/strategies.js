let passport = require("passport");
let GitHubStrategy = require('passport-github2').Strategy;
let SlackStrategy = require("passport-slack").Strategy;
let GoogleStrategy = require('passport-google-oauth20').Strategy;

let dbModels = require("../models/index.js");



/////////////////////////////////////////////////////





var stratFunc = function(profile, done){       
    
    //prepare a user object, which could be inserted to the database later on.
    const user = new dbModels.User({
        privilege: "user",
        status: "active",
        strategyUser : {
            identifier: profile.id,
            username: profile.username,
            email: profile.email
        },
    });

    //make sure data which is to be saved to a session is an exmpty object.
    let sessionData = {};
    
    //search database for a user which matches the profile id provided.
    dbModels.User.findOne({"strategyUser.identifier": profile.id})
    .then(userTemp => {

        if(!userTemp){
            //if user can not be found in database, save prepared user. 
            user.save()
                .then(newUser => {
                    //save this users data into sessionData, and pass it onto to be serialised.
                    sessionData = newUser;
                    return done(null, sessionData);
                })                     
                .catch(err => console.log("error saving strat user to db.", err))
        }
        else {
            //if user already exists in db, set its status to active and pass it on to be serialised.
            userTemp.status = "active";
            userTemp.save()
            .then((existingUser) => {
                sessionData = existingUser;
                return done(null, sessionData);
            })
            

        }
    })

}




///////////////////////////////////////////////////////////











passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://diagnoser.herokuapp.com/api/auth/githubSignIn"   //---production
    //callbackURL: "http://localhost:3000/api/auth/githubSignIn"            // ---dev
  },
  function(accessToken, refreshToken, profile, done) {

    //set up the profile object for this specific stategy 
    profileObj = {
        id: profile.id,
        username: profile.username,
        email: profile.emails ? profile.emails[0].value : "no email given"
    }
    
    //takes profile of person signing in and tries to match it up to existing user in db. done takes us to the serialise function.
    stratFunc(profileObj, done);
}


));





 
passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackURL: "https://diagnoser.herokuapp.com/api/auth/slackSignIn"
    //callbackURL: "http://localhost:3000/api/auth/slackSignIn"            // ---dev
}, (accessToken, refreshToken, profile, done) => {

        profileObj = {
            id: profile.user.id,
            username: profile.user.name,
            email: profile.user.email
        }

        stratFunc(profileObj, done);
    
        
    }



));









passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://diagnoser.herokuapp.com/api/auth/googleSignIn"    
  },
  function(accessToken, refreshToken, profile, done) {

    profileObj = {
        id: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
    }
    
    stratFunc(profileObj, done);
  
  }
));






passport.serializeUser(function(user, done) {
    //takes in user data from person sigining in and passes on the specific data which needs to be saved to their session.
    //console.log("serialising user: ", user)
    let sessionData = {
        userID: user._id,
        privilege: user.privilege,
        username: user.localUser.username || user.strategyUser.username,
        email: user.localUser.email || user.strategyUser.email,
        status: user.status
    }  

    done(null, sessionData);
});

passport.deserializeUser(function(user, done) {
    //console.log("deserialising user: ", user)
    done(null, user);  
});