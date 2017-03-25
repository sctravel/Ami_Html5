var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var Session = require("../model/Session.js")
var dbPool = require("../db/createDBConnectionPool");

function createUserSession(session, callback) {
    var sqlCreateSession = 'insert into sessions ( sessionId, userId, email, starttime, testId) VALUES (?, ?, ?, ?, ?)';

    var params = [session.sessionId, session.userId, session.email, session.startTime, session.testId];

    dbPool.runQueryWithParams(sqlCreateSession, params, function (err, results) {
        if (err) {
            logger.error("sqlCreateSession failed for email-"+session.email);
            callback(err, null);
            return;
        }
        callback(null, constants.services.CALLBACK_SUCCESS);
    });
};

function getUnfinishedSession(email,callback) {
    var sqlUnfinishedSession = "select sessionId, testId, email, startTime from sessions where email = ? and endtime is null order by startTime desc";
    dbPool.runQueryWithParams(sqlUnfinishedSession, [email], function (err, results) {
        if (err) {
            logger.error("sqlUnfinishedSession failed for email: " + email);
            callback(err, null);
            return;
        }
        logger.info("sqlUnfinishedSession - with results - " + results);
        console.dir(results);
        if(results==null || results.length==0) {
            callback(null, null);
        } else {
            callback(null, results[0]);
        }
    });

}

function checkEmailAndPassword(email, pass, callback) {
    var sqlCheckEmailAndPassword = 'select email from passwords where password = ? and starttime < ? and (expiretime is null or expiretime > ?)';
    var currentTime = new Date();

    dbPool.runQueryWithParams(sqlCheckEmailAndPassword, [pass, currentTime, currentTime], function(err, result){
        if(err) {
            logger.error("checkEmailAndPassword failed for email: " + email);
            callback(err, null);
            return;
        }
        if(result==null || result.length==0) {
            logger.error("can't find password for email: " + email);
            callback(err, null);
            return;
        }
        var emailInDB = result[0].email;
        if(emailInDB=='' || emailInDB==email) {
            callback(null, constants.services.CALLBACK_SUCCESS);
            return;
        } else {
            var errorMsg = 'email or passowrd is incorrect for : ' + email;
            logger.error(errorMsg);
            callback(errorMsg, constants.services.CALLBACK_FAILED);
            return;
        }
    })
}
//user login with email and password
var manualLogin = function(email, pass, callback) {
    var returnObj = {};
    returnObj.isAuthenticated = false;

    checkEmailAndPassword(email, pass, function(err, result){
        if(result!=constants.services.CALLBACK_SUCCESS) {
            logger.error("email-"+email+" logged in failed. The password is incorrect. Please try it again. ");
            returnObj.errorMessage = "Email or password is incorrect. Please try it again.";
            callback(err, returnObj);
            return;
        }
        getUnfinishedSession(email, function(err, unfinishedSession){
            if(err) {
                logger.error(err);
                callback(err, null);
                return;
            }
            returnObj.isAuthenticated = true;

            if(unfinishedSession!=null) {
                logger.info("Session for " + email + " already exists, with sessionId = " + unfinishedSession.sessionId + " and testId = " + unfinishedSession.testId);
                returnObj.session = new Session(email, email, unfinishedSession.testId);
                returnObj.session.data.sessionId = unfinishedSession.sessionId;
                callback(null, returnObj);
            } else {
                var testIndex = Math.floor(memoryCache.get(constants.cache.TEST_COUNT) * Math.random());
                var testId = memoryCache.get(constants.cache.TEST_IDS)[testIndex];
                returnObj.session = new Session(email, email, testId);
                createUserSession(returnObj.session.data, function (err, results) {
                    if (err) {
                        logger.error("createUserSession() failed for email: " + email);
                        callback(err, null);
                        return;
                    }
                    logger.info("Session for " + email + " is created at " + returnObj.session.data.startTime + " with test :" + testId);
                    callback(null, returnObj);
                });
            }
        })
    })

};

module.exports = {
    manualLogin: manualLogin
}