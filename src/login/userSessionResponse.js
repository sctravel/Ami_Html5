/**
 * Created by xitu on 1/22/2017.
 */
var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var Session = require("../model/Session.js")
var dbPool = require("../db/createDBConnectionPool");
var _=require('underscore');

function addTrackTapResponseToSession(itemResponse, sessionId, callback) {
    addAudioResponseToSession(itemResponse, sessionId, function(err, results) {
        if(err) {
            logger.error("addQuickLitResponseToSession() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }

        var sqlAddTrackTapWordsToSession = "insert into sessionstates_tracktap " +
            " (sessionId, latency, distance ) " +
            " values ";
        var params = [];

        for(var i in itemResponse.taps) {
            var tap = itemResponse.taps[i];
            if(i==itemResponse.taps.length-1) {
                sqlAddTrackTapWordsToSession = sqlAddTrackTapWordsToSession + " (?,?,?)"
            } else {
                sqlAddTrackTapWordsToSession = sqlAddTrackTapWordsToSession + " (?,?,?), "
            }
            params = params.concat([sessionId, tap.latency, tap.distance]);
        }
        dbPool.runQueryWithParams(sqlAddTrackTapWordsToSession, params, function (err, results) {
            if (err) {
                logger.error("sqlAddTrackTapWordsToSession failed for sessionId: " + sessionId);
                callback(err, null);
                return;
            }
            callback(null, constants.services.CALLBACK_SUCCESS);
        });
    });
}

function addQuickLitResponseToSession(itemResponse, sessionId, callback) {
    addAudioResponseToSession(itemResponse, sessionId, function(err, results) {
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
                word.word, word.isWord, word.isUsed, word.level, word.duration, word.isTouched, new Date(word.touchTimeStamp),
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

function addAudioResponseToSession(itemResponse, sessionId, callback) {
    logger.info("Entering add AudioResponse To SessionStates Table for " + itemResponse.item.type+"."+itemResponse.item.item);

    var sqlAddAudioResponseToSession = "insert into sessionstates " +
        " (sessionId, testId, type, item, seq, itemType, startTime, endTime, afilename, status, score)" +
        " values (?,?,?,?,?,?,?,?,?,?,?) ";
    var params = [sessionId, itemResponse.item.test, itemResponse.item.type,
        itemResponse.item.item, itemResponse.item.seq, itemResponse.itemType,
        new Date(itemResponse.startTime), new Date(itemResponse.endTime),
        itemResponse.afilename, itemResponse.status, itemResponse.score==null ? -999 : itemResponse.score];
    dbPool.runQueryWithParams(sqlAddAudioResponseToSession, params, function (err, results) {
        if (err) {
            logger.error("addAudioResponseToSession() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        logger.info("Successfully added AudioResponse To SessionStates Table for " + itemResponse.type+"."+itemResponse.item);
        callback(null, constants.services.CALLBACK_SUCCESS);
    });
}

function addAudioResponseWithSubResponseToSession(itemResponse, sessionId, callback) {
    logger.info("Entering add SubAudioResponse To SessionStates Table for " + itemResponse.item.type+"."+itemResponse.item.item);

    var sqlAddMicrophoneCheckResponseToSession = "insert into sessionstates " +
        " (sessionId, testId, type, item, seq, itemType, startTime, endTime, afilename, status, subResponses, snrDB )" +
        " values (?,?,?,?,?,?,?,?,?,?,?,?) ";

    var params = [sessionId, itemResponse.item.test, itemResponse.item.type, itemResponse.item.item,
        itemResponse.item.seq, "SubAudioResponse", new Date(itemResponse.startTime),
        new Date(itemResponse.endTime), itemResponse.afilename, itemResponse.status,
        JSON.stringify(itemResponse.subresponses), JSON.stringify(itemResponse.snrDB)];

    dbPool.runQueryWithParams(sqlAddMicrophoneCheckResponseToSession, params, function (err, results) {
        if (err) {
            logger.error("addAudioResponseWithSubResponseToSession() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        logger.info("Successfully added SubAudioResponse To SessionStates Table for " + itemResponse.type+"."+itemResponse.item);

        callback(null, results);
    });
}

function addItemResponseToSession (itemResponse, sessionId, callback) {
    if(itemResponse.item.type == 2032) {
        addTrackTapResponseToSession(itemResponse, sessionId,callback);
    } else if(itemResponse.item.type == 2064) {
        addQuickLitResponseToSession(itemResponse, sessionId,callback);
    } else if( itemResponse.subresponses!=null && itemResponse.subresponses.length > 1) { //TODO: get the item list of SubAudioResponses
        addAudioResponseWithSubResponseToSession(itemResponse, sessionId, callback);
    } else {
        addAudioResponseToSession(itemResponse, sessionId, callback);
    }
}

function addIndividualPictureResponseToSession(picture, sessionId, callback) {
    var sqlAddCameraPicturesToSession = "insert into sessionstates_camerapicture " +
        " (sessionId, takenTime, elapseTime, takenType, takenItem, pngFileName) " +
        " values (?,?,?,?,?,?)";
    var params = [sessionId, new Date(picture.takenTime), picture.elapsedTime, picture.takenType, picture.takenItem, picture.pngFileName];

    dbPool.runQueryWithParams(sqlAddCameraPicturesToSession, params, function (err, results) {
        if (err) {
            logger.error("sqlAddCameraPicturesToSession failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        callback(null, constants.services.CALLBACK_SUCCESS);
    });
}

module.exports = {
    addItemResponseToSession : addItemResponseToSession,
    addIndividualPictureResponseToSession: addIndividualPictureResponseToSession
}