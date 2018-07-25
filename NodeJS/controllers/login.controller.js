'use strict';

var User            = require('../models/user.model'),
    authenticate    = require('../utility/authenticate');



/**
 @apiDefine Login
  Login Data
 @apiSuccess {String} authenticateuser web Authentication is based on web users

*/

/**
 * @api {post} /login Authenticate an User
 * @apiVersion 0.0.1
 * @apiName AuthenticateWebUser
 * @apiGroup Authentication
 *
 * @apiParam {String} email The email of the existing user.
 * @apiParam {String} password The password of the existing user.
 *
 *
 * @apiExample {curl} Authenticate an User
 * curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache"
 *'{
 *   "email":"test1@example.com",
 *   "password": "test1Pwd"
 * }' "http://localhost:8080/api/authentication/token"
 *
 * @apiSuccess {envelope} data The successful response data envelope.
 * @apiSuccess {authtoken} data The requested authtoken.
 * @apiUse Authentication
 * @apiUse envelope
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *  "success":true,
 *  "authToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NzQwNDdhZGNiMjQyZjdhMTQ1MGEwNDQifQ.OfRyarmQwPqsbUXYw1C14kIxb6JpautjTHVVv1xPf28"
 * }
 *
 * @apiErrorExample {json} Error-Response
 * {
 *  "success": false,
 *  "error": [
 *   {
 *     "message": "Authentication failed. User not found."
 *   }
 *  ]
 * }
 * @apiErrorExample {json} Error-Response
 * {
 *  "success": false,
 *  "error": [
 *   {
 *     "message":"Invalid user information."
 *   }
 *  ]
 * }

 */

exports.login = function(req, res) {
    authenticate.generateToken(req,res,User)
};