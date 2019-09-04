var express = require("express");
var fs = require("fs");
var keys = require('./keys');
var Spotify = require('node-spotify-api');
// var spotify = new Spotify(keys.spotify);
var logger = require("morgan");
var path = require("path");

var PORT = process.env.PORT || 8080;

var app = express();

//CONFIGURE MIDDLEWARE
// Parse request body as JSON
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// ROUTES: Root route to grab contents of home.html
app.get("/", function(req, res){
    console.log("hitting this")
    res.sendFile(path.join(__dirname + "/public/tunnel.html"))
});

// Starting server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
