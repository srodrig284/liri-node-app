
// Grab the packages variable
var myKeys = require("./keys.js");  // for twitter
var spotify = require('spotify');   // for spotify
var request = require("request");  // for omdb
var fs = require("fs");  //grab the fs package to handle read/write

// Gets all of my twitter keys
var client = myKeys.twitterKeys;

// Only characters allowed to use as valid inputs.
var regletters = /^[A-Za-z]+$/;

// Parses the command line argument to capture the "operand" (deposits, withdrawals, or lotto purchases) and the numbers
var user_request = process.argv[2];
//var item_requested = process.argv[3];

switch (user_request)
{
    case 'my-tweets':
        getMyTweets();
        break;

    case 'spotify-this-song':
        if(process.argv.length > 3) {
            var arg = process.argv.shift(); // skip node.exe
            var arg2 = process.argv.shift();  // skip name of js file
            var aug3 = process.argv.shift(); // skip spotify-this-song

            //console.log(process.argv.join(" "));
            var song = JSON.stringify(process.argv.join(" ").replace(/\'/gi, ""));
            //console.log(song);

            spotifySong(song);
        }
        else{
            //console.log("Please enter spotify-this-song and song name");
            // else spotify the default song
            spotifySong('The Sign');
        }
        break;

    case 'movie-this':
        var movie = "Mr. Nobody"; // default movie

        if(process.argv.length > 3) {
            var arg = process.argv.shift(); // skip node.exe
            var arg2 = process.argv.shift();  // skip name of js file
            var aug3 = process.argv.shift(); // skip movie-this

            //console.log(process.argv.join(" "));
            movie = JSON.stringify(process.argv.join(" ").replace(/\'/gi, ""));
            //console.log(song);
        }
        findMovie(movie);

        break;

    case 'do-what-it-says':
        doWhatItSays();
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

        fs.appendFile("log.txt", "======================================================\n\n", function (err) {
            // If there was an error, we log it and return immediately
            if (err) {
                return console.log(err);
            }
        });
    });
} // end function getMyTweets

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
                        console.log("        " + data.tracks.items[i].artists[j].name);
                        fs.appendFile("log.txt", "        " + data.tracks.items[i].artists[j].name + "\n", function (err) {
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
                fs.appendFile("log.txt", "Preview song: " + data.tracks.items[i].preview_url + "\n\n", function (err) {
                    // If there was an error, we log it and return immediately
                    if (err) {
                        return console.log(err);
                    }
                });
            }
            fs.appendFile("log.txt", "======================================================\n\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });
        }
        else
        {
            console.log("No data found for the song '" + song + "'");
        }
    });
} // end function spotifySong


function findMovie(movie){
    // replace whitespace with '+'.
    // This will prepare the user's input to be appended to the url search string
    var formattedTitle = movie.replace(/\s/g, "+");

    request("http://www.omdbapi.com/?t=" + formattedTitle + "&y=&plot=short&tomatoes=true&r=json", function(error, response, body) {

        // If there were no errors and the response code was 200 (i.e. the request was successful)...
        if (!error && response.statusCode === 200) {

            // Title of the movie.
            console.log("Movie Title: " + JSON.parse(body).Title);
            fs.appendFile("log.txt", "Movie Title: " + JSON.parse(body).Title + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // Year the movie came out.
            console.log("Year of Release " + JSON.parse(body).Year);
            fs.appendFile("log.txt", "Year of Release " + JSON.parse(body).Year + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // IMDB Rating of the movie.
            console.log("IMDB Movie Rating: " + JSON.parse(body).imdbRating);
            fs.appendFile("log.txt", "IMDB Movie Rating: " + JSON.parse(body).imdbRating + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // Country where the movie was produced.
            console.log("Country Produced: " + JSON.parse(body).Country);
            fs.appendFile("log.txt", "Country Produced: " + JSON.parse(body).Country + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // Language of the movie.
            console.log("Movie Language: " + JSON.parse(body).Language);
            fs.appendFile("log.txt", "Movie Language: " + JSON.parse(body).Language + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // Plot of the movie.
            console.log("Movie Plot: " + JSON.parse(body).Plot);
            fs.appendFile("log.txt", "Movie Plot: " + JSON.parse(body).Plot + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // Actors in the movie.
            console.log("Actors: " + JSON.parse(body).Actors);
            fs.appendFile("log.txt", "Actors: " + JSON.parse(body).Actors + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // Rotten Tomatoes Rating, if available
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            fs.appendFile("log.txt", "Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + "\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            // Rotten Tomatoes URL.
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
            fs.appendFile("log.txt", "Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });

            fs.appendFile("log.txt", "======================================================\n\n", function (err) {
                // If there was an error, we log it and return immediately
                if (err) {
                    return console.log(err);
                }
            });
        }
    });
} // end findMovie

/**
 *
 */
function doWhatItSays()
{
    fs.readFile("random.txt", "utf8", function(error, data) {

        if(error){
            throw error;
        }

        // We will then print the contents of data
        //console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(","); // makes it an array

        // We will then re-display the content as an array for later use.
        //console.log(dataArr);
        if(dataArr.length > 0)
        {
            var action = dataArr[0];
            var request = '';

            if(dataArr.length > 1)
            {
                request = JSON.parse(dataArr[1]);
                request = JSON.stringify(request);
            }

            console.log(request);
            switch (action)
            {
                case 'my-tweets':
                    getMyTweets();
                    break;

                case 'spotify-this-song':
                    var song = 'The Sign';  // default song

                    if(request != '') {
                        song = request;
                    }
                    //console.log(song);
                    spotifySong(song);
                    break;

                case 'movie-this':
                    var movie = "Mr. Nobody"; // default movie

                    if(request != '') {
                        movie = request;
                    }
                    findMovie(movie);

                    break;

                default:
                    console.log("Invalid Entry. Please enter one of the following:");
                    console.log("1. my-tweets");
                    console.log("3. spotify-this-song and song name");
                    console.log("4. movie-this and movie name");
                    console.log("5. do-what-it-says");

                    break;
            };
        }
    });
} // end doWhatItSays