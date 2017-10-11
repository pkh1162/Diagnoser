let routes = require("./routes.js");
let express = require("express");
let mongoose = require("mongoose");
let app = express();
require('dotenv').config()
let PORT = process.env.PORT || 3001;
let bodyParser = require("body-parser");
let cookieParser = require('cookie-parser')
let expressValidator = require("express-validator");
require("./passport/strategies.js");
let socket = require("socket.io");
let path = require("path");

//Authentication Packages
let session = require("express-session");
let passport = require("passport");

//Database setup and connection//////////////////
let db_user = process.env.DB_USER;
let db_password = process.env.DB_PASSWORD;
let db_uri = `mongodb://${db_user}:${db_password}@ds129723.mlab.com:29723/web_test2`;

mongoose.connect(db_uri, {useMongoClient: true}, () => {
    console.log("connected to mongoose database")
})

////////////////////////////////////////////////

//MongoDB session storage///////////////////////
let MongoDBStore = require('connect-mongodb-session')(session);

let store = new MongoDBStore(
    {
        uri: db_uri,
        collection: 'mySessions'
    }
);
 

store.on("error", (err) => {
    console.log("there has been an error with the mongoose session connection");
})
/////////////////////////////////////////////////




//Logger middleware function////////////

let logger = (req, res, next) => {
   // console.log("logging: ");
    next();
}
////////////////////////////////////////////////////////////////////


//Socket setup///////////////////////////////
const server = require("http").createServer(app);
let io = socket(server);
require("./socket.js").getIO(io);
require("./socket.js").ioConfig(io);


////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares! 

//app.set('trust proxy', 1);

//Tell app to save session, and to use the mongoDB store to do it///////////////
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  store: store,
  //cookie: { maxAge: 2628000000 },
  cookie: { maxAge: 86400000 }, //1 day
  saveUninitialized: false,
  //cookie: { secure: true }
}))
/////////////////////////////////////////////////////////////////////////////////


app.use(passport.initialize());
app.use(passport.session());



app.use(logger);


app.use(express.static( __dirname + '/../dist'));
app.use(express.static( __dirname + 'dist'));

/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
*/


app.use("/api", routes);

app.get('*', (req, res)=> {
    console.log('get');
    console.log(path.join(__dirname+'/../dist/index.html'));
    res.sendFile(path.join(__dirname+'/../dist/index.html'));
  })

server.listen(PORT, () => {
    console.log("I'm listening...");
})