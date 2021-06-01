// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var fileUpload = require('express-fileupload');
const database = require('./database.js');
const socketIo = require("socket.io");
const http = require("http");

var staticData = require('./constants/staticData');

//var swStats = require('swagger-stats');

database.connect().then(() => console.log('Connected to Db'))
  .catch((err) => console.log(err));


// Create our Express application
var app = express();

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

app.use(fileUpload());

// Set view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 1000000, // experiment with this parameter and tweak
    limit: '50mb',
  })
);
// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



// Use express session support since OAuth2orize requires it
app.use(
  session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true,
  })
);

// Use the passport package in our application
app.use(passport.initialize());

var routes = require('./routes/routes'); //importing route
routes(app); //register the route


app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        response = { status: 400, message: "JSON parse error", data: [] };
        res.status(400).json(response);
    } else {
        next();
    }
});

app.use(function (req, res) {

  response = { status: 404, message: 'URL not found', data: [] };
  res.status(404).json(response);
});

// Start the server

const server = app.listen(staticData.port, function () {
    console.log(`Listening on port ${staticData.port}`);
    console.log(`http://localhost:${staticData.port}`);
});



const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.set('socketio', io);

/*
io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("user added", function () {
        io.emit("user added", {msg: "test"});
    });

    socket.on("disconnect", () => {
        io.emit("user disconnected");
    });
});*/

module.exports = app;


//pm2 start process.json
//npm start
//npm run start:dev