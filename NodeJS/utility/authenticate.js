var mongoose        = require('mongoose'),
    config          = require('../../config'),
    authUser        = require('../models/authentication.model'),
    jwt             = require('jsonwebtoken') // used to create, sign, and verify tokens
    errorTrans      = require('./errorTranslator')

exports.generateToken = function(req,res,doc,app){

  // find whether user exists
  doc.findOne({ email: req.body.email.toLowerCase(),isDeleted:false},function(err,user){
    // check for error
    if (err){
      // Error Log Here
      req.log.error('Authentication failed.');
      return res.status(500).json({success:false,message: 'Authentication failed.'});
    }
    // check for user has found or not
    if (!user) {
      // user not found
      req.log.error('Authentication failed.User not found.');
      return res.status(401).json({ success: false, error:{message: 'Authentication failed. User not found.'}});
    }
    // check for password validation
    if(!user.validPassword(req.body.password)) {
      // password is not valid
      req.log.error('Invalid user/password information.');
      return res.status(401).json({ success: false, error:{message:'Invalid user/password information.'}});
    }

    // generate token encypted nu screte key
    var token = jwt.sign({
         iss: user.id
    }, config.secret);

    // remove from AuthUser table if that user already in the logged in
    //this below statement will remove the user from AuthUser if user already exists,
    // otherwise it will not do anything if user is not present
    authUser.remove({iss:user.id},function(err,doc){
      //check for error
      if(err)
      {
        req.log.error('Token Generation Failed');
        return res.status(401).json({ success: false, error:{message:'Token Generation Failed'}});
      }
      var auth = new authUser();
      auth.token = token;
      auth.iss = user.id;
      // save user in database
      auth.save(function(err,doc) {
      if(err) {
        // Error Log Here
        req.log.error('Error in Create new Authentication');
        return res.status(500).json({success:false, error:errorTrans.resolve(err)});
      }
        req.log.info('Token Generated Successfully');
        var data = {
          userId: user.id,
          authToken: token,
          firstName: user.firstName,
          lastName: user.lastName,
          resetPassword: user.resetPassword
        }
        return res.status(200).json({success:true,user: data});
      });

    });


  });
}
