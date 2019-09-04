require("dotenv").config();

var express = require("express");
var fs = require("fs");
var keys = require('../keys');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// let search = document.getElementById('search')

// event listener for when user clicks on search
// search.addEventListener("click", function(){
    // let searchTerms = document.querySelector('input').value
    // console.log(searchTerms)

    spotify.search({ type: 'track', query: "hello"},function(err, data){
        if(err){
            console.log(err)
        }

        console.log(data)
    })
// })