/**
 * Created by tuxi1 on 1/7/2017.
 */
var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var Session = require("../model/session.js")
var dbPool = require("../db/createDBConnectionPool");

function addFinishedSessionTestItem(itemResponse, callback) {
    switch (itemResponse.item.type) {
        case 2000:
            addMicrophoneCheckResponse(itemResponse, callback);
            break;
        case 2062:
            addNameFacesResponse(itemResponse, callback);
            break;
        case 20:
            break;
        default:
            addAudioResponse(itemResponse, callback);
            break;
    }

}

function getFinishedItemsInSession(unfinishedSessionId, callback) {
    var sqlGetFinishedItemsInSession = "select sessionId, testId, type, item, startTime, endTime, score, status from sessionstates where sessionId = ? order by startTime";
    dbPool.runQueryWithParams(sqlGetFinishedItemsInSession, [unfinishedSessionId], function (err, results) {
        if (err) {
            logger.error("getFinishedItemsInSession() failed for sessionId: " + unfinishedSessionId);
            callback(err, null);
            return;
        }
        callback(null, results);
    });


}

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

//return null or empty array if there's no unFinished Item in Session
var getUnFinishedTestItemsInSession = function(email, callback) { // or change to sessionID
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
exports.getUnFinishedTestItemsInSession = getUnFinishedTestItemsInSession;

var addFinishedSessionTestItem = function(item, sessionId, callback) {
    var sqlAddFinishedSessionTestItem = "insert into sessionstates (sessionId, testId, type, item, startTime, endTime, score, status) values (?,?,?,?,?,?,?,?)";
    var params = [sessionId, item.test, item.type, item.item, item.startTime, item.endTime, item.score, item.status];
    dbPool.runQueryWithParams(sqlAddFinishedSessionTestItem, params, function (err, results) {
        if (err) {
            logger.error("addFinishedSessionTestItem() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        callback(null, constants.services.CALLBACK_SUCCESS);
    });

}
exports.addFinishedSessionTestItem = addFinishedSessionTestItem;
var finishSession = function(email, sessionId, callback) {
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
exports.finishSession = finishSession;

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
exports.createUserSession = createUserSession;

var getUnfinishedSession = function(email,callback) {
    var sqlUnfinishedSession = "select sessionId, testId from sessions where email = ? and endtime is null order by startTime desc";
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
exports.getUnfinishedSession = getUnfinishedSession;