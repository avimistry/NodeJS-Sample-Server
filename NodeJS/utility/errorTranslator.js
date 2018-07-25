var _ = require('lodash');

exports.resolve = function(err) {
  var errors = {};
  console.log('err is ' + JSON.stringify(err));
  if(err.name === 'ValidationError') {
    errors = _.flatten(_.map(err.errors, function(items) {
          return {message: items.message };
          console.log('err msg is ' + items.message);
      }));
  }else if(err.name === 'MongoError') {
    if(err.code === 11000) {
      // this example is showing how to get the field `email` out of the err message
      var field = err.message.split('index:')[1].split('.$')[1]
      // now we have `email_1 dup key`
      field = field.split(' dup key')[0]
      field = field.substring(0, field.lastIndexOf('_')) // returns email
      errors.message = 'Duplicate '+field+' error happened.';
    }
  }else{
    errors.message =  err.message;
  }
  return errors;
};
