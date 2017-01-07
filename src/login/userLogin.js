var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var Session = require("../model/session.js")
var dbPool = require("../db/createDBConnectionPool");

var testList = [1,2,3,4,5];

var createUserSession = function(session, callback) {
    var sqlCreateSession = 'insert into sessions ( sessionId, userId, email, starttime, testId) VALUES (?, ?, ?, ?, ?)';

    var params = [session.sessionId, session.userId, session.email, session.startTime, session.testId];

    dbPool.runQueryWithParams(sqlCreateSession, params, function (err, results) {
        if (err) {
            logger.error("create user session failed for email-"+session.email);
            callback(err, null);
            return;
        }
        callback(null, constants.services.CALLBACK_SUCCESS);
    });
};

var markSessionEnd = function(sessionId, callback) {
    var sqlMarkSessionEnd = 'update sessions set endtime = ? where sessionId= ? ';
    var endtime = new Date();
    dbPool.runQueryWithParams(sqlMarkSessionEnd, [endtime, sessionId], function (err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, constants.services.CALLBACK_SUCCESS);
    });
}

var getUnfinishedSession = function(email,callback) {
    var sqlUnfinishedSession = "select sessionId, testId from sessions where email = ? and endtime is null order by starttime desc";
    dbPool.runQueryWithParams(sqlUnfinishedSession, [email], function (err, results) {
        if (err) {
            logger.error("getUnfinishedSession() failed for email: " + email);
            callback(err, null);
            return;
        }
        logger.info("getUnfinishedSession() - with results - " + results);
        console.dir(results);
        if(results==null || results.length==0) {
            callback(null, null);
        } else {
            callback(null, results[0]);
        }
    });

}

//user login with email and password
exports.manualLogin = function(email, pass, callback) {
    var returnObj = {};
    returnObj.isAuthenticated = false;
    if(pass == "ami_qa") { //TODO: here we hard code password
        getUnfinishedSession(email, function(err, unfinishedSession){
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
            //create session entry in session table
        })


    } else {
        logger.error("email-"+email+" logged in failed. The password is incorrect. Please try it again. ");
        returnObj.errorMessage = "Email or password is incorrect. Please try it again.";
        callback(null, returnObj);
    }
};




function getFinishedItemsInSession(unfinishedSessionId, callback) {
    var sqlGetFinishedItemsInSession = "select sessionId, testId, type, item, seq, status from sessionstates where sessionId = ?";
    dbPool.runQueryWithParams(sqlGetFinishedItemsInSession, [unfinishedSessionId], function (err, results) {
        if (err) {
            logger.error("getFinishedItemsInSession() failed for sessionId: " + unfinishedSessionId);
            callback(err, null);
            return;
        }
        callback(null, results);
    });


}

//return null or empty array if there's no unFinished Item in Session
exports.getUnFinishedTestItemsInSession = function(email, callback) { // or change to sessionID
    //get status from sessionstates table to see whether there's any unfinished session
    // If so
    getUnfinishedSession(email, function(err, unfinishedSession){
        if(err) {
            logger.error("getFinishedTestItemsInSession() failed for email: " + email);
            callback(err, null);
            return;
        }
        if(unfinishedSession==null) {
            callback(null, null);
            return;
        }
        getFinishedItemsInSession(unfinishedSession.sessionId, function(err, results) {
            if(err) {
                callback(err, null);
                return;
            }
            if(results==null || results.length==0) {
                callback(null, results);
                return;
            }
            var testId = unfinishedSession[0].testId;
            //TODO: filter all tests in testId by the results exception type==2000 (volumn/speaker check);
            callback(null, results);
        });
    });
}

exports.addFinishedSessionTestItem = function(item, sessionId, callback) {
    var sqlAddFinishedSessionTestItem = "insert into sessionstates (sessionId, testId, type, item, seq, status) values (?,?,?,?,?,?)";
    var params = [sessionId, item.test, item.type, item.item, item.seq, 0];
    dbPool.runQueryWithParams(sqlAddFinishedSessionTestItem, params, function (err, results) {
        if (err) {
            logger.error("addFinishedSessionTestItem() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        callback(null, constants.services.CALLBACK_SUCCESS);
    });

}

exports.finishSession = function(email, sessionId, callback) {
    markSessionEnd(function(err, results) {
        if(err) {
            callback(err, null);
            return;
        }
        //TODO: var xml = generateSessionXML();
        //TODO: uploadXMLToS3(xml, function(err, results){
        //    callback(null, results);
        //});
        callback(null, constants.services.CALLBACK_SUCCESS);
    });

}