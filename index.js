var funcs = require("./getLyrics.js");
var fs = require("fs");

// different playlist ids for happy and sad "Happy hits"
async function getHappyLyrics() {
	fs.open('Lyrics_happy.txt','wx', function(err,file){
	});
	playlist = await funcs.getPlaylist('37i9dQZF1DX7KNKjOK0o75');
	for (key in playlist){
		data = await funcs.scrape(key,playlist[key]);
		fs.appendFile('Lyrics_happy.txt',data + '*', function(err){
			if (err) throw err;
		})
	}
	fs.close()
}

// different playlist ids for happy and sad this one is "ALl the Feels"
async function getSadLyrics() {
	fs.open('Lyrics_sad.txt','wx', function(err,file){

	});
	playlist = await funcs.getPlaylist('37i9dQZF1DX3YSRoSdA634');
	for (key in playlist){
		data = await funcs.scrape(key,playlist[key]);
		fs.appendFile('Lyrics_sad.txt',data + '*', function(err){
			if (err) throw err;
		})
	}
	fs.close()
}


getSadLyrics();
//getHappyLyrics();
