var generatePassword = require("password-generator");

// generate random password
exports.getSimplePassword = function (len,callback) {
  var password = "";
  password = generatePassword(len);
  callback(password);
};
