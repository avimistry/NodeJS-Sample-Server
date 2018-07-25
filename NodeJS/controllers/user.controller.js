'use strict';

var User          = require('../models/user.model'),
    AuthUser        = require('../models/authentication.model'),
    config        = require('../../config'),
    errorTrans    = require('../utility/errorTranslator'),
    mailer        = require('../utility/mailer'),
    _               = require('lodash')

/**
* @apiDefine ServicesHeader Header
* The required header for the request
* @apiHeader {String} x-access-token This token is used for authentication.
**/

/**
@apiDefine user
User Data
@apiSuccess {String}user._id The id of the user(auto generated).
@apiSuccess {String}user.email The email of the user.
@apiSuccess {String}user.password The password of the user.
@apiSuccess {Date} user.updatedDate The last update date for the user.
@apiSuccess {Date} user.createdDate The created date of the user.
@apiSuccess {Boolean} user.isDeleted The user is deleted or not.
@apiSuccess {Number}user.__v Auto generated
*/

/**
@apiDefine envelope
Return Envelope
@apiSuccess {Boolean="true","false"} success Indicator to determine whether the operation succeeded or failed.
@apiSuccess {Object} data The data to be returned.
*/

/**
@apiDefine UserError
@apiError {Boolean=true,false} success Indicator to determine whether the operation succeeded or failed.
@apiError {Object[]} error The errors object array
@apiErrorExample {json} Error-Response
{
  "success": false,
  "error": [
    {
      "message": "Error Message"
    }
  ]
}
**/

  /**
  * @api {get} /user/:page  Get a list of all users pagewise
  * @apiVersion 0.0.1
  * @apiName userController.listwithpage
  * @apiGroup User
  *
  * @apiUse ServicesHeader
  *
  * @apiSuccess {envelope} data The return envelope.
  * @apiUse user
  * @apiUse envelope
  *
  *
  * @apiExample {curl} Get a list of all users pagewise
  *
  * curl -X GET -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ODNmYjNmNzg2MWI1YjExNmQzY2JhN2IiLCJpYXQiOjE0ODEwMDg3NzF9.MY4zek9tzyHyjlRJlZd_az_0AVaskRhGy7f8nCdC5Gw"
  *  -H "Cache-Control: no-cache" "http://localhost:8080/user/1"
  *
  *
  * @apiSuccessExample {json} Success-Response
      {
        "success": true,
        "data": {
        "users": [
          {
            "_id": "583eaa454428428741fb9b52",
            "firstname": "super",
            "lastname": "admin",
            "email": "user712.8908791277054@any.com",
            "password": "$2a$08$MqIN2U45Nt/rd5fg4hdfg4/In0EPpCJbxDpbFQ4p8SvkmGs6U4I.",
            "createdDate": "2017-11-30T10:11:29.027Z",
            "isDeleted": false
            },
            {
            "_id": "583fb2ce115593107f2da038",
            "firstname": "super",
            "lastname": "admin",
            "email": "user713.8908791277054@any.com",
            "password": "$2a$08$MqIN2U45Nt/rdqHbpOdQEO4/In0EPpCJbxDpbFQ4p8SvkmGs6U4I.",
            "createdDate": "2017-12-01T05:19:10.181Z",
            "isDeleted": false
            }
          ]
        }
      }
  *
  * @apiUse UserError
  *
  */
exports.listwithpage = function(req, res) {
  User.find({isDeleted: false})
    .limit(config.pagelimit)
    .skip((req.params.page-1)*config.pagelimit)
    .exec(function(err, docs){
      if(err) {
          // Error Log Here
          req.log.error('Error in List Users!');
          return res.status(500).json({success:false, error:errorTrans.resolve(err)});
      }
      var totalUserCount = 0;
      User.find({isDeleted:false}).count(function(err,totalcount){
        if(err) {
            // Error Log Here
            req.log.error('Error in List Users count!');
            return res.status(500).json({success:false, error:errorTrans.resolve(err)});
        }
        totalUserCount = totalcount;
        req.log.info('Get All Users!');
        return res.status(200).json({success:true, users:docs, totalusercount:totalUserCount});
      });
    });
};

/**
* @api {get} /user  Get a list of all users
* @apiVersion 0.0.1
* @apiName userController.list
* @apiGroup User
*
* @apiUse ServicesHeader
*
* @apiSuccess {envelope} data The return envelope.
* @apiUse user
* @apiUse envelope
*
*
* @apiExample {curl} Get a list of all users
*
* curl -X GET -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ODNmYjNmNzg2MWI1YjExNmQzY2JhN2IiLCJpYXQiOjE0ODEwMDg3NzF9.MY4zek9tzyHyjlRJlZd_az_0AVaskRhGy7f8nCdC5Gw"
*  -H "Cache-Control: no-cache" "http://localhost:8080/user"
*
*
* @apiSuccessExample {json} Success-Response
    {
      "success": true,
      "data": {
        "users": [
          {
            "_id": "583eaa454428428741fb9b52",
            "firstname": "super",
            "lastname": "admin",
            "email": "user712.8908791277054@any.com",
            "password": "$2a$08$MqIN2U45Nt/rd5fg4hdfg4/In0EPpCJbxDpbFQ4p8SvkmGs6U4I.",
            "createdDate": "2017-11-30T10:11:29.027Z",
            "isDeleted": false
            },
            {
            "_id": "583fb2ce115593107f2da038",
            "firstname": "super",
            "lastname": "admin",
            "email": "user713.8908791277054@any.com",
            "password": "$2a$08$MqIN2U45Nt/rdqHbpOdQEO4/In0EPpCJbxDpbFQ4p8SvkmGs6U4I.",
            "createdDate": "2017-12-01T05:19:10.181Z",
            "isDeleted": false
            }
          ]
        }
    }
*
* @apiUse UserError
*
*/
exports.list = function(req, res) {
User.find({isDeleted: false})
  .exec(function(err, docs){
    if(err) {
        // Error Log Here
        req.log.error('Error in List Users!');
        return res.status(500).json({success:false, error:errorTrans.resolve(err)});
    }
    var totalUserCount = 0;
    User.find({isDeleted:false}).count(function(err,totalcount){
      if(err) {
          // Error Log Here
          req.log.error('Error in List Users count!');
          return res.status(500).json({success:false, error:errorTrans.resolve(err)});
      }
      totalUserCount = totalcount;
      req.log.info('Get All Users!');
      return res.status(200).json({success:true, adminusers:docs, totalusercount:totalUserCount});
    });
  });
};

  /**
  * @api {get} /user/:id  Get a user specified by id
  * @apiVersion 0.0.1
  * @apiName userController.read
  * @apiGroup User
  *
  * @apiUse ServicesHeader
  *
  * @apiSuccess {envelope} data The return envelope.
  * @apiUse user
  * @apiUse envelope
  *
  *
  * @apiExample {curl} Get a list of all users
  *
  * curl -X GET -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ODNmYjNmNzg2MWI1YjExNmQzY2JhN2IiLCJpYXQiOjE0ODEwMDg3NzF9.MY4zek9tzyHyjlRJlZd_az_0AVaskRhGy7f8nCdC5Gw"
  *  -H "Cache-Control: no-cache" "http://localhost:8080/user/583fb296115593107f2da034/"
  *
  *
  * @apiSuccessExample {json} Success-Response
      {
        "success": true,
        "data": {
        "user":
          {
            "_id": "583fb296115593107f2da034",
            "firstname": "super",
            "lastname": "admin",
            "email": "user712.8908791277054@any.com",
            "password": "$2a$08$MqIN2U45Nt/rd5fg4hdfg4/In0EPpCJbxDpbFQ4p8SvkmGs6U4I.",
            "updatedDate": "2017-11-30T10:11:29.027Z",
            "createdDate": "2017-11-30T10:11:29.027Z",
            "isDeleted": false
          }
        }
      }
  *
  * @apiUse UserError
  *
  */
exports.read = function(req, res) {
  User.findOne({ _id: req.params.id },function(err, doc) {
    if(err) {
      // Error Log Here
      req.log.error('Error in read User');
      return res.status(500).json({success:false, error:errorTrans.resolve(err)});
    }

    if(doc) {
      req.log.info('User Found!');
      return res.status(200).json({success:true, user:doc});
    } else {
      req.log.info('User Not Found!');
      return res.status(200).json({success:false, error:{message:"User not found."}});
    }

  });
};

/**
 * @api {post} /user  Create a user
 * @apiVersion 0.0.1
 * @apiName userController.create
 * @apiGroup User
 @apiParamExample {json} Request-Example:
 *{ 
    "firstname": "super",
    "lastname": "admin",
    "email": "user@any.com",
    "password": "abc1234"
  }
 *
 *
 * @apiUse ServicesHeader
 *
 * @apiSuccess {envelope} data The return envelope.
 * @apiUse user
 * @apiUse envelope
 *
 *
 * @apiExample {curl} create a user
 *
 * curl -X POST -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ODNmYjNmNzg2MWI1YjExNmQzY2JhN2IiLCJpYXQiOjE0ODEwMDg3NzF9.MY4zek9tzyHyjlRJlZd_az_0AVaskRhGy7f8nCdC5Gw"
 *  -H "Cache-Control: no-cache" "http://localhost:8080/user"
 *
 *
 * @apiSuccessExample {json} Success-Response
 *
 {
   "success": true,
   "data": {
     "user": {
       "_id": "5846a57fb310ec0cea70023f",
       "firstname": "super",
       "lastname": "admin",
       "email": "user@any.com",
       "password": "$2a$08$dPPVKhhWLmehNvZJkEIi1u1W1Cr2QEyG0VmgUki2SWPT3bq.Chlpq",
       "createdDate": "2017-12-06T11:48:15.250Z",
       "isDeleted": false
     }
   }
 }
 *
 * @apiUse UserError
 *
 */
exports.create = function(req, res) {
  
  if(!req.body.toString() || _.isEmpty(req.body)){
    req.log.error('Empty Request Found!');
    return res.status(400).json({success:false,error:"Empty request body"});
  }
  
  var password=req.body.password;
  // check if user is already in database
  User.findOne({ email: req.body.email.toLowerCase(), isDeleted: true }, function (err, doc) {
    if (err) {
      // Error Log Here
      req.log.error('Error in creating Technician');
      return res.status(500).json({ success: true, error: errorTrans.resolve(err) });
    }
    if (doc) {
      doc.firstName = req.body.firstName;
      doc.lastName = req.body.lastName;
      doc.email = req.body.email.toLowerCase();
      doc.contactNo = req.body.contactNo;
      doc.password = doc.generateHash(password);
      doc.isDeleted = false;
      doc.resetPassword = false;
      doc.updatedDate = new Date();
      doc.save(function (err, document) {
        if (err) {
          // Error Log Here
          req.log.error('Error in creating User');
          return res.status(500).json({ success: false, error: errorTrans.resolve(err) });
        }

        req.log.info('User Created Successfully!');
        return res.status(200).json({ success: true, user: document });
        
      });
    } else {
      User.findOne({ email: req.body.email.toLowerCase(), isDeleted: false }, function (err, doc) {
        if (doc) {
          req.log.info('User already exist !');
          return res.status(500).json({ success: false, error: { message: "User already exist...!" } });
        } else {
          // create user if not found in database
          var newUser = new User();
          newUser.firstName = req.body.firstName;
          newUser.lastName = req.body.lastName;
          newUser.email = req.body.email.toLowerCase();
          newUser.password = newUser.generateHash(password);
          newUser.contactNo = req.body.contactNo;
          newUser.resetPassword = false;
          newUser.createdDate = new Date();
          
          //Created new user in database
          newUser.save(function (err, document) {
            if (err) {
              // Error Log Here
              req.log.error('Error in Create User');
              return res.status(500).json({ success: false, error: errorTrans.resolve(err) });
            }

            req.log.info('User Created Successfully!');
            return res.status(200).json({ success: true, user: document });
           
          });
        }
      });
    }
  });
};

/**
 * @api {put} /user/:id  Update a user by specified id
 * @apiVersion 0.0.1
 * @apiName userController.update
 * @apiGroup User
 @apiParamExample {json} Request-Example:
 *
  {
    "firstname": "super",
    "lastname": "admin"
  }

 *
 *
 * @apiUse ServicesHeader
 *
 * @apiSuccess {envelope} data The return envelope.
 * @apiUse user
 * @apiUse envelope
 *
 *
 * @apiExample {curl} update a user specified by id
 *
 * curl -X POST -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ODNmYjNmNzg2MWI1YjExNmQzY2JhN2IiLCJpYXQiOjE0ODEwMDg3NzF9.MY4zek9tzyHyjlRJlZd_az_0AVaskRhGy7f8nCdC5Gw"
 *  -H "Cache-Control: no-cache" "http://localhost:8080/user/5846a57fb310ec0cea70023f"
 *
 *
 * @apiSuccessExample {json} Success-Response
 *
 {
  "success": true,
  "data": {
    "user": {
      "_id": "5846a57fb310ec0cea70023f",
      "firstname": "super",
      "lastname": "admin",
      "email": "user@any1.com",
      "password": "$2a$08$iDYqayT3xmOZ9GTjRt61ROib2Ake8cJlXRj/oJZXSIzQx.0hjBEBW",
      "updatedDate": "2017-12-06T11:56:32.252Z",
      "createdDate": "2017-12-06T11:48:15.250Z",
      "isDeleted": false
    }
  }
}
 *
 * @apiUse UserError
 *
 */
exports.update = function(req,res){
  if(!req.body.toString() || _.isEmpty(req.body)){
    req.log.error('Empty Request Found!');
    return res.status(400).json({success:false,error:"Empty request body"});
  }
  User.findOne({ _id: req.params.id }, function(err, doc) {
    if(err) {
      // Error Log Here
      req.log.error('Error in Update User');
      return res.status(500).json({success:true,error:errorTrans.resolve(err)});
    }
    if(doc){
      // update all data
      doc.firstName = req.body.firstName;
      doc.lastName = req.body.lastName;
      doc.contactNo = req.body.contactNo;
      doc.updatedDate = new Date();
      doc.save(function(err,doc) {
        if(err) {
          // Error Log Here
          req.log.error('Error in Update User');
          return res.status(500).json({success:false, error:errorTrans.resolve(err)});
        }
        req.log.info('User Updated Successfully!');
        return res.status(200).json({success:true,user:doc});
      });
    } else {
      req.log.error('User not found');
      return res.status(200).json({success:false,error:{message:"User not found."}});
    }

  });
};

/**
 * @api {delete} /user/:id  Delete a user by specified id
 * @apiVersion 0.0.1
 * @apiName userController.delete
 * @apiGroup User
 *
 *
 * @apiUse ServicesHeader
 *
 * @apiSuccess {envelope} data The return envelope.
 * @apiUse user
 * @apiUse envelope
 *
 *
 * @apiExample {curl} delete a user specified by id
 *
 * curl -X DELETE -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1ODNmYjNmNzg2MWI1YjExNmQzY2JhN2IiLCJpYXQiOjE0ODEwMDg3NzF9.MY4zek9tzyHyjlRJlZd_az_0AVaskRhGy7f8nCdC5Gw"
 *  -H "Cache-Control: no-cache" "http://localhost:8080/user/5846a57fb310ec0cea70023f"
 *
 *
 * @apiSuccessExample {json} Success-Response
 *
 {
  "success": true,
  "data": {
    "user": {
      "_id": "5846a57fb310ec0cea70023f",
      "firstname": "super",
      "lastname": "admin",
      "email": "user@any1.com",
      "password": "$2a$08$iDYqayT3xmOZ9GTjRt61ROib2Ake8cJlXRj/oJZXSIzQx.0hjBEBW",
      "updatedDate": "2017-12-06T12:01:45.470Z",
      "createdDate": "2017-12-06T11:48:15.250Z",
      "isDeleted": true
    }
  }
}
 *
 * @apiUse UserError
 *
 */
exports.delete = function(req,res){
  User.findOne({ _id: req.params.id }, function(err, doc) {
    if(err) {
      // Error Log Here
      req.log.error('Error in Delete User');
      return res.status(500).json({success:true,error:errorTrans.resolve(err)});
    }
    if(doc) {
      doc.isDeleted = true;
      doc.updatedDate = new Date();
      doc.save();

      AuthUser.findOneAndRemove({iss: req.params.id},function (err, result) {
      if(err) {
        // Error Log Here
        req.log.error('Error in deleting token for admin...!');
      }
      });

      req.log.info('User Delete Successfully!');
      return res.status(200).json({success:true,user:doc});
    } else {
      req.log.info('User Not Found!');
      return res.status(200).json({success:false,error:{message:"User not found."}});
    }

  });
};


/**
* Reset password
* update user passord once validate email id.
**/
exports.resetpassword = function(req,res){
  if(!req.body.toString()){
    req.log.error('Empty Request Found!');
    return res.status(500).json({success:false,error:"Empty request body"});
  }
  User.findOne({ email:req.body.email.toLowerCase()}, function(err, doc) {
    if(err) {
      // Error Log Here
      req.log.error('Error in update password!');
      return res.status(500).json({success:true,error:errorTrans.resolve(err)});
    }
    if (!doc) {
      // Error Log Here
      req.log.error('email is not valid');
      return res.status(401).json({ success: false, error:{message: 'No email found...!'}});
    }

    if(!doc.validPassword(req.body.temppassword)) {
      // Error Log Here
      req.log.error('Invalid user information.');
      return res.status(401).json({ success: false, error:{message:'Not a vaild temporary password.'}});
    }
    var updateUser = new User();
    doc.password = updateUser.generateHash(req.body.password);
    doc.resetPassword = false;
    doc.updatedDate = new Date();
    doc.save(function(err,doc) {
      if(err) {
        // Error Log Here
        req.log.error('Error in update password!');
        return res.status(500).json({success:false, error:errorTrans.resolve(err)});
      }
      req.log.info('User Password Updated Successfully!');
      return res.status(200).json({success:true,user:doc});
    });
  });
};


/**
* forget password
* request for new password generation.
* validate user email and if vaild email address found reset password link sent to
  register email address.
**/
exports.forgotpassword = function(req,res){
  var password = "";
  User.findOne({ email: req.body.email,isDeleted:false }, function(err, doc) {
    if(err) {
      // Error Log Here
      req.log.error('Error in forget password!');
      return res.status(500).json({success:true,error:errorTrans.resolve(err)});
    }

    if (!doc) {
      // Error Log Here
      req.log.error('username is not valid');
      return res.status(401).json({ success: false, error:{message: 'Username doesn\'t exist...!'}});
    }

    utility.getSimplePassword(8,function(data){
        password = data;
    });

    var newUser = new User();
    doc.password = newUser.generateHash(password);
    doc.updatedDate = new Date();
    doc.resetPassword = true;
    doc.save(function(err,doc) {
      if(err) {
        // Error Log Here
        req.log.error('Error in update password!');
        return res.status(500).json({success:false, error:errorTrans.resolve(err)});
      }

      mailer.sendRestPassword(doc,password,function(err,result){
        if(err) {
          req.log.error('Error in email template generation!');
          return res.status(500).json({success:false, error:errorTrans.resolve(err)});
        }
        mailer.sendMail(doc.email,'NodeJS - Reset Password',result);
        req.log.info('forget password mail sent Successfully!');
        return res.status(200).json({success:true,message:'Please check your email and \
        follow the instructions to reset the password '});
      });
    });
  });
};
