require("dotenv").config();
var express = require("express");
var keys = require('./keys');

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET
})

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

    spotifyApi.clientCredentialsGrant().then(
        function(data){
            accessToken = data.body.access_token
            console.log("this is the access token   " + accessToken)

            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setCredentials({
                accessToken: accessToken
            })
        })
        .catch(function(err){
            console.log(err)
        })
});

// ROUTE: Root for spotify api request
app.get("/:songname", function(req, res){
    console.log("songname" + req.params.songname)

    spotify.search({ type: 'track', query: req.params.songname},function(err, data){
        if(err){
            console.log(err)
        }
        res.send(data)
    })
});

// ROUTE: Root for spotify api request
app.get("/audioAnalysis/:ID", function(req, res){
    console.log("get request has been received")

    spotifyApi.getAudioAnalysisForTrack(req.params.ID)
        .then(function(data){
            console.log("data.body" + data.body);
            res.send(data.body);
        }, function(err){
            console.log(err);
        })
});

// Starting server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
