var userController  = require('../controllers/user.controller');
var jwtAuth          = require('./middlewares/jwtAuth');

module.exports = function(app) {

  'use strict';

  // user API
  app.route('/user/:page')
    .get(jwtAuth,userController.listwithpage);

  app.route('/user')
    .get(jwtAuth,userController.list);

  app.route('/user')
    .post(jwtAuth,userController.create);

  app.route('/user/:id')
    .get(jwtAuth,userController.read);

  app.route('/user/:id')
    .put(jwtAuth,userController.update);

  app.route('/user/:id')
    .delete(jwtAuth,userController.delete);

  app.route('/resetpassword')
    .post(userController.resetpassword);

  app.route('/forgotpassword')
    .post(userController.forgotpassword);
};
