require("dotenv").config();
var express = require("express");
var fs = require("fs");
var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var SpotifyWebApi = require('spotify-web-api-node');
var SpotifyApi = new SpotifyWebApi(keys.spotifyAPI)

var logger = require("morgan");
var path = require("path");

var PORT = process.env.PORT || 8080;

var app = express();

let accessToken; 

//CONFIGURE MIDDLEWARE
// Parse request body as JSON
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// ROUTE: Root route to grab contents of home.html
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/public/tunnel.html"))

    SpotifyApi.clientCredentialsGrant().then(
        function(data){
            accessToken = data.body.access_token
            console.log("this is the access token   " + accessToken)

            SpotifyApi.setAccessToken(accessToken);
        })
        .catch(function(err){
            console.log(err)
        })
});

// ROUTE: Root for spotify api request
app.get("/:songname", function(req, res){
    console.log("hello this is the songname" + req.params.songname)

    spotify.search({ type: 'track', query: req.params.songname},function(err, data){
        if(err){
            console.log(err)
        }
        res.send(data)

        let ID = data.tracks.items[0].album.id; 
        console.log(ID)

        // spotifyApi.getAudioAnalysisForTrack(ID)
        // .then(function(data){
        //     console.log(data.body);
        // }, function(err){
        //     console.log(err);
        // })
    })
});

// Starting server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
