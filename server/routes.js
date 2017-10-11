const express = require("express");
const passport = require("passport");
const routes = express();

let userController = require("./controllers/userController.js");
let authController = require("./controllers/authController.js");





routes.get("/retrieveDoctors", authenticationMiddleware(), userController.getDoctors);
routes.post("/signup", userController.post, authController.authCheck);


//Sign In Local//////////////////////////////////////////////////////////////////

routes.post("/signin", authController.post, authController.authCheck);


//End of Sign In Local//////////////////////////////////////////////////////////



////Strategy Sign In Routes//////////////////////////////////////////////////////

routes.get("/githubAuth", passport.authenticate("github", {gitSession: true}))
routes.get('/auth/githubSignIn', 
  passport.authenticate('github', { failureRedirect: '/signingIn' }),
  function(req, res, next) {
    // Successful authentication, redirect home.
    console.log("in github auth:")
    res.redirect('/')
    //res.redirect('https://diagnoser.herokuapp.com');    // ---production
    //res.redirect("/") ---dev
    //next()
  }, authController.authCheck);




// path to start the OAuth flow


routes.get('/slackAuth', passport.authenticate('slack', {session: true}));
routes.get('/auth/slackSignIn', passport.authenticate('slack', { failureRedirect: '/signingIn' }),
(req, res) => {

    res.redirect('/')
    //res.redirect('https://diagnoser.herokuapp.com')
}
);


routes.get('/googleAuth', passport.authenticate('google', {scope: ['profile', "email"], session: true}));
routes.get('/auth/googleSignIn', passport.authenticate('google', { failureRedirect: '/signingIn' }),
(req, res) => {
    res.redirect('/')
    //res.redirect('https://diagnoser.herokuapp.com')
}
);


////End of Strategy Sign In Routes//////////////////////////////////////////////////////







routes.get("/logout", authController.logout);
routes.get("/authCheck", authController.authCheck);



function authenticationMiddleware () {
    return (req, res, next) => {
        if (req.isAuthenticated()){
            return next();
        }

        res.redirect("/signingIn");
    }
}

module.exports = routes;

