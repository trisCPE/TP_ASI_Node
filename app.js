'use strict'

// Gets the config from the json file, 
// including path to files and port
var CONFIG = require("./config.json");
// Makes variable available for all modules via process.env
process.env.CONFIG = JSON.stringify(CONFIG);

// point de validation 1
var express = require("express");
var http = require("http");
var path = require("path");
var defaultRoute = require("./app/routes/default.route.js");
var presRoute = require("./app/routes/presentation.route.js");
var contentRoute = require("./app/routes/content.route.js");
var bodyParser = require('body-parser')
var IOController = require("./app/controllers/io.controller.js");


// Initialize server
var app = express();
app.use( bodyParser.json() ); 

// Why ? express already creates an http server
// var server = http.createServer(app);

// First static
app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));

// Then routes
app.use(defaultRoute);
app.use(presRoute);
app.use(contentRoute);

// server will serve both http and socket connection
var server = http.createServer(app); // init the server
IOController.listen(server);

server.listen(CONFIG.port, function() {
	console.log("listening to "  + CONFIG.port);
});
//IOController.connection(server);


