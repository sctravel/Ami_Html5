/**
 * Created by tuxi1 on 1/7/2017.
 */
var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var Session = require("../model/Session.js")
var dbPool = require("../db/createDBConnectionPool");

function addItemResponseToSession(itemResponse, sessionId, callback) {

    if(itemResponse.item.type==2000 && itemResponse.item.item==3) {
        addCameraPictureResponseToSession(itemResponse, sessionId, callback);
    } else if(itemResponse.item.type = 2032) {
        addQuickLitResponseToSession(itemResponse, sessionId,callback);
    } else if( itemResponse.item == 20) { //TODO: get the item list of SubAudioResponses
        addAudioResponseWithSubResponseToSession(itemResponse, sessionId, callback);
    } else {
        addAudioResponseToSession(itemResponse, sessionId, "AudioResponse", callback);
    }
}

var addCameraPictureResponseToSession = function(itemResponse, sessionId, callback) {
    addAudioResponseToSession(itemResponse, sessionId, "CameraPicture", function(err, results) {
        if (err) {
            logger.error("addQuickLitResponseToSession() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        var sqlAddCameraPicturesToSession = "insert into sessionstates_camerapicture " +
            " (sessionId, testId, type, item, takenTime, elapseTime, takenType, takeItem, pngFileName) " +
            " values (?,?,?,?,?,?,?,?,?)";
        var params = [sessionId, itemResponse.item.testId, itemResponse.item.type, itemResponse.item.item,
            itemResponse.picture.takenTime, itemResponse.picture.elapsedTime, itemResponse.picture.takenType,
            itemResponse.picture.takenItem, itemResponse.picture.pngFileName];

        dbPool.runQueryWithParams(sqlAddCameraPicturesToSession, params, function (err, results) {
            if (err) {
                logger.error("sqlAddCameraPicturesToSession failed for sessionId: " + sessionId);
                callback(err, null);
                return;
            }
            callback(null, constants.services.CALLBACK_SUCCESS);
        });
    });
}

var addQuickLitResponseToSession = function (itemResponse, sessionId, callback) {
    addAudioResponseToSession(itemResponse, sessionId, "QuickLitResponse", function(err, results) {
        if(err) {
            logger.error("addQuickLitResponseToSession() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }

        var sqlAddQuickLitWordsToSession = "insert into sessionstates_quicklit " +
            " (sessionId, testId, type, item, word, isWord, isUsed, level, duration, isTouched, touchTimeStamp, wordIndex, isCorrect ) " +
            " values ";
        var params = [];

        for(var i in itemResponse.words) {
            var word = itemResponse.words[i];
            if(i==itemResponse.words.length-1) {
                sqlAddQuickLitWordsToSession = sqlAddQuickLitWordsToSession + " (?,?,?,?,?,?,?,?,?,?,?,?,?)"
            } else {
                sqlAddQuickLitWordsToSession = sqlAddQuickLitWordsToSession + " (?,?,?,?,?,?,?,?,?,?,?,?,?), "
            }
            params = params.concat([sessionId, itemResponse.item.testId, itemResponse.item.type, itemResponse.item.item,
                word.word, word.isWord, word.isUsed, word.level, word.duration, word.isTouched, word.touchTimeStamp,
                word.wordIndex, word.isCorrect]);
        }
        dbPool.runQueryWithParams(sqlAddQuickLitWordsToSession, params, function (err, results) {
            if (err) {
                logger.error("sqlAddQuickLitWordsToSession failed for sessionId: " + sessionId);
                callback(err, null);
                return;
            }
            callback(null, constants.services.CALLBACK_SUCCESS);
        });
    });
};

var addAudioResponseToSession = function(itemResponse, sessionId, responseType, callback) {
    var sqlAddAudioResponseToSession = "insert into sessionstates " +
        " (sessionId, testId, type, item, itemType, startTime, endTime, afilename, status)" +
        " values (?,?,?,?,?,?,?,?) ";
    var params = [sessionId, itemResponse.item.testId, itemResponse.item.type, itemResponse.item.item, responseType, itemResponse.startTime, itemResponse.endTime, itemResponse.afilename, itemResponse.status];
    dbPool.runQueryWithParams(sqlAddAudioResponseToSession, params, function (err, results) {
        if (err) {
            logger.error("addAudioResponseToSession() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        callback(null, constants.services.CALLBACK_SUCCESS);
    });
}

var addAudioResponseWithSubResponseToSession = function(itemResponse, sessionId, callback) {
    var sqlAddMicrophoneCheckResponseToSession = "insert into sessionstates " +
        " (sessionId, testId, type, item, itemType, startTime, endTime, afilename, status, subResponses )" +
        " values (?,?,?,?,?,?,?,?,?) ";
    var subResponses = itemResponse.subResponses;
    var params = [sessionId, itemResponse.item.testId, itemResponse.item.type, itemResponse.item.item, "SubAudioResponse", itemResponse.startTime, itemResponse.endTime, itemResponse.afilename, itemResponse.status, subResponses];

    dbPool.runQueryWithParams(sqlAddMicrophoneCheckResponseToSession, params, true, function (err, results) {
        if (err) {
            logger.error("getFinishedItemsInSession() failed for sessionId: " + unfinishedSessionId);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
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
            logger.error('sqlMarkSessionEnd failed for session ' + sessionId);
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
            logger.error("sqlCreateSession failed for email-"+session.email);
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
exports.getUnfinishedSession = getUnfinishedSession;