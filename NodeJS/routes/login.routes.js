var loginController  = require('../controllers/login.controller');

module.exports = function(app) {

  //Login API

  app.route('/login')
    .post(loginController.login);

};
