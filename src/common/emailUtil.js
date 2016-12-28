/**
 * Created by xitu on 12/27/2016.
 */

var nodemailer = require("nodemailer");
var config = require('config');

var emailCredentials = config.get('emailCredentials');
// create reusable transport method (opens pool of SMTP connections)
// we can move the hardcoded account/password out and read it.
var smtpTransport = nodemailer.createTransport("SMTP", emailCredentials);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "WillGive <willgiveplatform@gmail.com>", // sender address
    to: "tuxi1987@gmail.com", // list of receivers
    subject: "Welcome to WillGivd", // Subject line
    text: "Node JS email test", // plaintext body
    html: "<b>Hello world ! SCTravel</b>" // html body
}

exports.sendEmail=function(mailOptions,callback) {
    smtpTransport.sendMail(mailOptions,function(error, responseStatus){
        if(!error){
            console.log(responseStatus.message); // response from the server
            console.log(responseStatus.messageId); // Message-ID value used
            callback(null,responseStatus);
        } else {
            console.error(error);
        }
    });
}
