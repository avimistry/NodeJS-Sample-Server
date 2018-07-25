var authUser = require('../../models/authentication.model'),
    jwt      = require('jsonwebtoken'),
    config   = require('../../../config')

module.exports = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  if(!token) {
    return res.sendStatus(401);
  }

  try{
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {
        //if decoded object is not undefined or null
        if(decoded){
          // if err occured in decryption of key
          if (err) {
            req.log.error('error in verify token');
            return res.status(500).json({ success: false, error:{message: 'Failed to authenticate token.' }});
          } else { // decryption of key is done Successfully
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            // check whether token has expired or not
            authUser.findOne({iss:decoded.iss},function(err,doc){
              // check for error
              if(err)
              {
                //if error occured
                req.log.error('Error in authenticate User');
                return res.status(500).json({ success: false, error: errorTrans.resolve(err) });
              }
              // check whether user is stored as Authenticated user
              if(doc==null){
                //if user is not stored as authenticated user
                req.log.error('user login expired or user has deleted.');
                return res.status(601).json({ success: false, error: { message: 'User not found. Please Login again.' } });
              }
              //check for token expiration
              if(doc.accessDateTime.setHours(doc.accessDateTime.getHours()+12) < new Date())
              {
                // token has expired then send staus 601
                req.log.error('Old Token Used');
                return res.status(601).json({ success: false, error:{ message: 'Token Expired. Please Login again...!' }});
              }
              // if everything is successfully done then go to next module of http request
              req.log.info('Authentication done Successfully');
              next();
            });
          }
        } else { //decoded object is undefined or null
          return res.status(500).json({ success: false, error:{message: 'Failed to authenticate token.' }});
        }

      });
    } else {
      // if there is no token
      // return an error
      req.log.error('No token provided. Authentication failed');
      return res.status(403).send({
        success: false,
        error:{ message: 'No token provided.'}
      });

    }
  }catch (err) {
      // if exception occured then send status 500 (Internel Server Error)
       res.sendStatus(500);
  }
};
