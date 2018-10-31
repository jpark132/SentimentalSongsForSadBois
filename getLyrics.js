 var config = require('./config');
var rp = require('request-promise');
var cheerio = require('cheerio');
var _ = require('underscore');
var http = require('http');
var SpotifyWebApi = require('spotify-web-api-node');
var fs = require('fs');

genius_url = 'https://genius.com/';
tracks = {};
lyrics = [];

function getPlaylist(id){

	// creating the access token for the spotify api
	var spotifyAPI = new SpotifyWebApi({
		clientId: "your client id here",
		clientSecret: "your client secret key here"
	});
	return spotifyAPI.clientCredentialsGrant().then(
		function(data){
		// Save the access token so that it's used in future calls
    	spotifyAPI.setAccessToken(data.body['access_token']);
		return spotifyAPI.getPlaylistTracks(id, {
	    	offset: 1,
			limit: 66,
	    	fields: 'items'});
		}).then(function(data) {
			spotify_playlist = data.body.items;

			 var i;
			 for(i = 0; i < spotify_playlist.length; i++){
				 // populating the dictionary with track name: artist
				 tracks[spotify_playlist[i].track.name.toLowerCase()] = spotify_playlist[i].track.artists[0].name.toLowerCase();
			 }
			 //console.log(tracks);
			 return tracks;
		   },
		    function(err) {
		      console.log('Something went wrong!', err);
		    }
		 )
		.catch(function(err) {
 			console.log('Something went wrong when retrieving an access token', err);
		});
	 	}

// getting the playlist. This playlist id is set to one that I want to obtain
function Scrape(key,value){
	var song = key.trim();
	var artist = value.trim();
     song = song.replace(/\((.*?)\)/g,"").trim().replace(/[,|\.|\'|\?|\-]/g, "");
	  song = song.replace(/\s/g,"-")
     artist = artist.replace(/\s/g,"-").replace(/[,|\.|\'|\?]/g, "").replace(/&/g, "and");

     // creating the url to scrape
     url = genius_url + artist + "-" + song + "-lyrics";

	  var options = {
    		uri: url,
    		transform: function (body) {
        		return cheerio.load(body);
    		}
		};

		return rp(options).then(function($){
			var data = $('.lyrics').text().trim().toLowerCase().replace(/\n/g, ' ').replace(/[,|-|\?]/g,"");
			data = data.replace(/\[(.*?)\]/g, " ");
			//console.log(data);

			lyrics = data;
			//console.log(lyrics);
			return lyrics;
		}).catch(function (err){
			console.log(url);
			console.log(song);
		})

}
module.exports = {
	getPlaylist: getPlaylist,
	scrape: Scrape
};
