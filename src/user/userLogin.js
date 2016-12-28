var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var logger = require('../../app').logger;

//user login with email and password
exports.manualLogin = function(email, pass, callback) {
    logger.info("manual logging");
    var returnObj = {};
    returnObj.isAuthenticated = false;
    if(pass == "ami_qa") {
        logger.info("password correct");

        returnObj.isAuthenticated = true;
        returnObj.email = email;
        returnObj.userId = email;
        returnObj.sessionId = stringUtil.generateRandomString(constants.login.SESSION_ID_LENGTH);
        callback(null, returnObj);

    } else {
        logger.error("email-"+email+" logged in failed. The password is incorrect. Please try it again. ");
        returnObj.errorMessage = "The password is incorrect. Please use Forgot Password from the login page to retrieve account.";
        callback(null, returnObj);
    }
};