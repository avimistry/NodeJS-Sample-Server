var nodemailer = require('nodemailer');
var config = require('../../config'); // get our config file
var fs = require('fs');
var path  = require("path");

/**
 * transporter is specifically designed for node mailer to configure some data in order to send mail.
 * host: which mail host you are using
 * port: port number at whcih host is listening
 * auth:
 *  user: email addess from which you are sending mails
 *  pass: password for above email addess
 */
var transporter = nodemailer.createTransport({
  host: config.mail_configuration.host,
  port: config.mail_configuration.port,
  //secure: true, // use SSL
  auth: {
      user: new Buffer(config.mail_configuration.user, 'base64').toString(), // Your email id
      pass: new Buffer(config.mail_configuration.password, 'base64').toString() // Your password
  }
});

/**
  * @api send mail using transporter
  * @apiVersion 0.0.0
  * @apiName sendMail
  * @apiGroup utility
  * @params:
  *   to: to whcich email addess you want to send email
  *   subject: title of email
  *   text: body of email(simple text)
  * @apiUse ServicesHeader
  *
  * @apiSuccess
  **/
exports.sendMail = function(to,subject,body) {
  var mailOptions = {
    from: config.mail_configuration.user, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    //text: text //, // plaintext body
    html: body // You can choose to send an HTML body instead
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        //res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        //res.json({yo: info.response});
    };
  });
};

exports.sendRestPassword = function(doc,password,callback){
  var file = path.resolve(__dirname) + '/template/resetPasswordTmpl.html';
  fs.readFile(file, 'utf8', function (err,data) {

    var result = data.replace(/{UserName}/g, doc.firstName)
                 .replace(/{password}/g,password)
                 .replace(/{date}/g,new Date());

    callback(err,result);
  });
}
