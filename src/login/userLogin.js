var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var logger = require('../../app').logger;
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

//user login with email and password
exports.manualLogin = function(email, pass, callback) {
    var returnObj = {};
    returnObj.isAuthenticated = false;
    if(pass == "ami_qa") {
        returnObj.isAuthenticated = true;
        var testIndex = Math.floor(testList.length * Math.random());
        var testId = testList[testIndex];
        returnObj.session = new Session(email, email, testId);
        createUserSession(returnObj.session.data, function(err, results){
            if (err) {
                callback(err, null);
                return;
            }
            logger.info("Session for " + email + " was created at " + returnObj.session.data.startTime + " with test :"+testId);
            callback(null, returnObj);
        });
        //create session entry in session table

    } else {
        logger.error("email-"+email+" logged in failed. The password is incorrect. Please try it again. ");
        returnObj.errorMessage = "Email or password is incorrect. Please try it again.";
        callback(null, returnObj);
    }
};


exports.getUnfinishedSession = function(email,callback) {
    var unfinishedSessionId = null;
    var sqlUnfinishedSession = "select sessionId from sessions where email = ? and endtime = null order by starttime desc";
    dbPool.runQueryWithParams(sqlUnfinishedSession, [email], function (err, results) {
        if (err) {
            logger.error("getUnfinishedSession() failed for email: " + email);
            callback(err, null);
            return;
        }
        console.dir(results);
        if(results.length>0) {
            unfinishedSessionId = results[0];
        }
        callback(null, unfinishedSessionId);
    });

}

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
    getUnfinishedSession(email, function(err, unfinishedSessionId){
        if(err) {
            logger.error("getFinishedTestItemsInSession() failed for email: " + email);
            callback(err, null);
            return;
        }
        if(unfinishedSessionId==null) {
            callback(null, null);
            return;
        }
        getFinishedItemsInSession(unfinishedSessionId, function(err, results) {
            if(err) {
                callback(err, null);
                return;
            }
            if(results==null || results.length==0) {
                callback(null, results);
                return;
            }
            var testId = result[0].testId;
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