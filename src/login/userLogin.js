var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var Session = require("../model/session.js")
var dbPool = require("../db/createDBConnectionPool");
var userSession = require("./userSession");

var testList = [1,2,3,4,5];


//user login with email and password
exports.manualLogin = function(email, pass, callback) {
    var returnObj = {};
    returnObj.isAuthenticated = false;
    if(pass == "ami_qa") { //TODO: here we hard code password
        userSession.getUnfinishedSession(email, function(err, unfinishedSession){
            if(err) {
                logger.error(err);
                callback(err, null);
                return;
            }
            returnObj.isAuthenticated = true;

            if(unfinishedSession!=null) {
                logger.info("Session for " + email + " already exists, with sessionId = " + unfinishedSession.testId + " and testId = " + unfinishedSession.sessionId);
                returnObj.session = new Session(email, email, unfinishedSession.testId);
                returnObj.session.data.sessionId = unfinishedSession.sessionId;
                callback(null, returnObj);
            } else {
                var testIndex = Math.floor(testList.length * Math.random());
                var testId = testList[testIndex]; //TODO: use actual test list from DB or cached
                returnObj.session = new Session(email, email, testId);
                userSession.createUserSession(returnObj.session.data, function (err, results) {
                    if (err) {
                        logger.error("createUserSession() failed for email: " + email);
                        callback(err, null);
                        return;
                    }
                    logger.info("Session for " + email + " is created at " + returnObj.session.data.startTime + " with test :" + testId);
                    callback(null, returnObj);
                });
            }
            //create session entry in session table
        })


    } else {
        logger.error("email-"+email+" logged in failed. The password is incorrect. Please try it again. ");
        returnObj.errorMessage = "Email or password is incorrect. Please try it again.";
        callback(null, returnObj);
    }
};


