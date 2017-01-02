var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var logger = require('../../app').logger;
var Session = require("../model/session.js")

//user login with email and password
exports.manualLogin = function(email, pass, callback) {
    var returnObj = {};
    returnObj.isAuthenticated = false;
    if(pass == "ami_qa") {
        returnObj.isAuthenticated = true;
        returnObj.session = new Session(email, email);
        console.log("Session for " + email + " was created at " + returnObj.session.data.startTime);
        callback(null, returnObj);

    } else {
        logger.error("email-"+email+" logged in failed. The password is incorrect. Please try it again. ");
        returnObj.errorMessage = "Email or password is incorrect. Please try it again.";
        callback(null, returnObj);
    }
};