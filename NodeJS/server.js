// =================================================================
// get required nodejs packages ========================================
// =================================================================
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var pino = require('express-pino-logger')();
var glob = require("glob");
// =================================================================
// get the packages we defined ========================================
// =================================================================
var config = require('./config'); // get our config file

var app = express();
// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || config.port ; // used to create, sign, and verify tokens

// connect to database
var databaseUrl = config.database.url;
var user = new Buffer(config.database.user, 'base64').toString();
var password = new Buffer(config.database.password, 'base64').toString();;
mongoose.connect('mongodb://'+user+':'+password+'@'+databaseUrl);

app.set('superSecret', config.secret); // secret variable
app.set('expiredTime', config.expiredTime); // Token expiredtime variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//pino logger will use for log
app.use(pino);

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
//app.all('/api/v1/*', [require('./middlewares/validateRequest')]);


glob.sync( './routes/**/*.js' ).forEach( function( routePath ) {
  // skip middlewares as it is not a routese
  if( routePath.indexOf("middlewares") == -1)
  {
      require(path.resolve(routePath))(app);
  }
});

app.listen(port);

exports = module.exports = app;

// Logging initialization
console.log('NodeJS server started on port ' + port);
