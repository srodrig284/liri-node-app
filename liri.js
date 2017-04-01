
// Grab the keys variable
var myKeys = require("./keys.js");

var client = myKeys.twitterKeys;

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
    var params = {screen_name: 'sandrar0218'};
    client.get('statuses/user_timeline',params, function(error, tweets, response) {
        if(error) throw error;
        console.log(tweets);  // The favorites.
    });
    
}