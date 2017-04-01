
// Grab the keys variable
var myKeys = require("./keys.js");

// Gets all of my twitter keys
var client = myKeys.twitterKeys;

// As always, we grab the fs package to handle read/write
var fs = require("fs");

// Parses the command line argument to capture the "operand" (deposits, withdrawals, or lotto purchases) and the numbers
var user_request = process.argv[2];
var amount = process.argv[3];

switch (user_request)
{
    case 'my-tweets':
        getMyTweets();
        break;

    case 'spotify-this-song':

        break;

    case 'movie-this':

        break;

    case 'do-what-it-says':

        break;

    default:
        console.log("Entry error");
        break;
};

function getMyTweets(){
    var params = {screen_name: 'realDonaldTrump'};
    client.get('statuses/user_timeline',params, function(error, tweets, response) {
        if(error) throw error;
        //console.log(tweets);  // display tweets

        fs.appendFile("twitter.txt", tweets[0].user.name + "'s latest tweets\n\n", function (err) {
            // If there was an error, we log it and return immediately
            if (err) {
                return console.log(err);
            }
        });

        for (i = 0; i < tweets.length; i++)
        {
            fs.appendFile("twitter.txt", "Tweet Date: " + tweets[i].created_at + "\n" + tweets[i].text + "\n\n", function (err)
            {
                // If there was an error, we log it and return immediately
                if (err)
                {
                    return console.log(err);
                }
                console.log("tweets array length: ",tweets.length);

                console.log(tweets);  // display tweets
            });
        };

        fs.appendFile("twitter.txt", "\n\n", function (err)
        {
            // If there was an error, we log it and return immediately
            if (err)
            {
                return console.log(err);
            }
        });
    });
}
