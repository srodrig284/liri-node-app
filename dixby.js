
// Grab the packages variable
var myKeys = require("./keys.js");
var spotify = require('spotify');

// Gets all of my twitter keys
var client = myKeys.twitterKeys;

// As always, we grab the fs package to handle read/write
var fs = require("fs");

// Only characters allowed to use as valid inputs.
var regletters = /^[A-Za-z]+$/;

// Parses the command line argument to capture the "operand" (deposits, withdrawals, or lotto purchases) and the numbers
var user_request = process.argv[2];
var item_requested = process.argv[3];

switch (user_request)
{
    case 'my-tweets':
        getMyTweets();
        break;

    case 'spotify-this-song':
        if(process.argv.length > 3) {
            var arg = process.argv.shift(); // skip node.exe
            var arg2 = process.argv.shift();  // skip name of js file
            var aug3 = process.argv.shift(); // skip name of spotify-this-song

            //console.log(process.argv.join(" "));
            var song = JSON.stringify(process.argv.join(" ").replace(/\'/gi, ""));
            //console.log(song);

            spotifySong(song);
        }
        else{
            console.log("Please enter spotify-this-song and song name");
        }
        break;

    case 'movie-this':

        break;

    case 'do-what-it-says':

        break;

    default:
        console.log("Invalid Entry. Please enter one of the following:");
        console.log("1. my-tweets");
        console.log("3. spotify-this-song and song name");
        console.log("4. movie-this and movie name");
        console.log("5. do-what-it-says");

        break;
};

function getMyTweets(){
    var params = {screen_name: 'SandraR0218'};
    client.get('statuses/user_timeline',params, function(error, tweets, response) {
        if(error) throw error;

        console.log(tweets);  // display tweets

        var todayDate = new Date();
        //console.log("Date: ",todayDate);

        fs.appendFile("log.txt", tweets[0].user.name + "'s latest tweets as of " + todayDate + "\n\n", function (err) {
            // If there was an error, we log it and return immediately
            if (err) {
                return console.log(err);
            }
        });

        if(tweets.length > 0) {
            for (i = 0; i < tweets.length; i++) {
                fs.appendFile("log.txt", JSON.stringify(tweets[i]) + "\n\n", function (err) {
                    // If there was an error, we log it and return immediately
                    if (err) {
                        return console.log(err);
                    }
                });
            }
            ;
        }
        else{
            console.log("No tweets found for " + tweets[0].user.name);
        };

        fs.appendFile("log.txt", "\n\n", function (err)
        {
            // If there was an error, we log it and return immediately
            if (err)
            {
                return console.log(err);
            }
        });
    });
};

function spotifySong(song){
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        //console.log(data.tracks);
        //console.log(data.tracks.items.length);

        if(data.tracks.items.length > 0){
            for(var i = 0; i < data.tracks.items.length; i++){
                console.log("Song Name: " + data.tracks.items[i].name);
                fs.appendFile("log.txt", "Song Name: "+ data.tracks.items[i].name + "\n", function (err) {
                    // If there was an error, we log it and return immediately
                    if (err) {
                        return console.log(err);
                    }
                });
                // loop thru the artists
                if(data.tracks.items[i].artists.length > 0){
                    console.log("Artists: ");
                    fs.appendFile("log.txt", "Artists: " + "\n", function (err) {
                        // If there was an error, we log it and return immediately
                        if (err) {
                            return console.log(err);
                        }
                    });
                    for(var j = 0; j < data.tracks.items[i].artists.length; j++){
                        console.log("    " + data.tracks.items[i].artists[j].name);
                        fs.appendFile("log.txt", "    " + data.tracks.items[i].artists[j].name + "\n", function (err) {
                            // If there was an error, we log it and return immediately
                            if (err) {
                                return console.log(err);
                            }
                        });
                    }
                }
                if(data.tracks.items[i].album.name != "") {
                    console.log("Album: " + data.tracks.items[i].album.name);
                    fs.appendFile("log.txt", "Album: " + data.tracks.items[i].album.name + "\n", function (err) {
                        // If there was an error, we log it and return immediately
                        if (err) {
                            return console.log(err);
                        }
                    });
                }

                console.log("Preview song: " + data.tracks.items[i].preview_url + "\n\n");
                fs.appendFile("Preview song: " + data.tracks.items[i].preview_url + "\n\n", function (err) {
                    // If there was an error, we log it and return immediately
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
        else
        {
            console.log("No data found for the song '" + song + "'");
        }
    });
};
