/**
 * Created by tuxi1 on 1/7/2017.
 */
var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var Session = require("../model/Session.js")
var dbPool = require("../db/createDBConnectionPool");
var xmlBuilder = require('../common/xmlBuilder');
var _=require('underscore');
var memoryCache = require('memory-cache');

function addItemResponseToSession(itemResponse, sessionId, callback) {
    console.dir(itemResponse);
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

exports.addItemResponseToSession = addItemResponseToSession;

var addIndividualPictureResponseToSession = function(picture, sessionId, callback) {
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
exports.addIndividualPictureResponseToSession = addIndividualPictureResponseToSession;

var addTrackTapResponseToSession = function(itemResponse, sessionId, callback) {
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

var addQuickLitResponseToSession = function (itemResponse, sessionId, callback) {
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

var addAudioResponseToSession = function(itemResponse, sessionId, callback) {
    logger.info("Entering add AudioResponse To SessionStates Table for " + itemResponse.item.type+"."+itemResponse.item.item);

    var sqlAddAudioResponseToSession = "insert into sessionstates " +
        " (sessionId, testId, type, item, itemType, startTime, endTime, afilename, status, score)" +
        " values (?,?,?,?,?,?,?,?,?,?) ";
    var params = [sessionId, itemResponse.item.test, itemResponse.item.type, itemResponse.item.item, itemResponse.itemType, new Date(itemResponse.startTime), new Date(itemResponse.endTime), itemResponse.afilename, itemResponse.status, itemResponse.score==null ? -999 : itemResponse.score];
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

var addAudioResponseWithSubResponseToSession = function(itemResponse, sessionId, callback) {
    logger.info("Entering add SubAudioResponse To SessionStates Table for " + itemResponse.item.type+"."+itemResponse.item.item);

    var sqlAddMicrophoneCheckResponseToSession = "insert into sessionstates " +
        " (sessionId, testId, type, item, itemType, startTime, endTime, afilename, status, subResponses, snrDB )" +
        " values (?,?,?,?,?,?,?,?,?,?, ?) ";

    var params = [sessionId, itemResponse.item.test, itemResponse.item.type, itemResponse.item.item,
        "SubAudioResponse", new Date(itemResponse.startTime), new Date(itemResponse.endTime),
        itemResponse.afilename, itemResponse.status,
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


function getFinishedItemsInSession(unfinishedSessionId, callback) {
    var sqlGetFinishedItemsInSession = "select sessionId, testId, type, item, startTime, endTime, score, status, subresponses from sessionstates where sessionId = ? order by startTime";
    dbPool.runQueryWithParams(sqlGetFinishedItemsInSession, [unfinishedSessionId], function (err, results) {
        if (err) {
            logger.error("getFinishedItemsInSession() failed for sessionId: " + unfinishedSessionId);
            callback(err, null);
            return;
        }
        callback(null, results);
    });


}

var markSessionEnd = function(userSession, callback) {
    var sqlMarkSessionEnd = 'update sessions set endtime = ? where sessionId= ? ';
    var endtime = new Date();
    userSession.endTime = endtime;
    userSession.testName = globalCache.get(userSession.testId).testName;
    dbPool.runQueryWithParams(sqlMarkSessionEnd, [endtime, userSession.sessionId], function (err, results) {
        if (err) {
            logger.error('sqlMarkSessionEnd failed for session ' + userSession.sessionId);
            callback(err, null);
            return;
        }
        xmlBuilder.buildSessionXml(userSession, function(err, xmlString){
            if(err) {
                logger.error("Build Session XML error. " + err);
                callback(err, null);
                return;
            }
            callback(null, xmlString);
        });
    });
}
exports.markSessionEnd = markSessionEnd;

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

var getCompleteTestById = function (testId, callback) {

    var sqlQuicklits = 'select * from quicklits ORDER BY RAND()';
    var sqlNameFacePictures = 'select subjectid, filename, feeling from photoes';
    var sqlNameFaceNames = 'SELECT name, gender, nameset FROM names';

        dbPool.runQueryWithParams(sqlQuicklits,function (err, allWordsResults) {
            if(err) {
                console.error(err);
                callback(err,null);
                return;
            }
            var wordSetIndex = 0;
            //May need to select words by level later
            var wordSet = [allWordsResults.slice(0, 4), allWordsResults.slice(4, 10), allWordsResults.slice(10, 16), allWordsResults.slice(16, 22)];

            dbPool.runQueryWithParams(sqlNameFacePictures,function (err, picResults) {
                if(err) {
                    logger.error(err);
                    callback(err,null);
                    return;
                }

                dbPool.runQuery(sqlNameFaceNames,function (err, nameResults) {
                    if(err) {
                        logger.error(err);
                        callback(err,null);
                        return;
                    }

                    var femaleFacesSet = ["FE1_Neutral.jpg", "FE2_Neutral.jpg", "FE3_Neutral.jpg", "FE4_Neutral.jpg"];
                    var maleFacesSet = ["MA1_Neutral.jpg", "MA2_Neutral.jpg", "MA3_Neutral.jpg", "MA4_Neutral.jpg"];

                    var maleRandIndex = Math.floor(4*Math.random());
                    var femaleRandIndex = Math.floor(4*Math.random());
                    var femaleSubjectId = femaleRandIndex+1; //1-4
                    var maleSubjectId = maleRandIndex+5;  //5-8
                    console.log("maleSubjectId-"+maleSubjectId+"; femaleSubjectId-"+femaleSubjectId);
                    var maleNames = _.filter(nameResults, function(name){
                        return name.nameset == maleSubjectId;
                    });
                    var femaleNames = _.filter(nameResults, function(name){
                        return name.nameset == femaleSubjectId;
                    });
                    var maleNamePicked = maleNames[maleRandIndex];
                    var femaleNamePicked = femaleNames[femaleRandIndex];

                    var femalePicPicked = _.filter(picResults, function(photo){
                        return photo.subjectid == femaleSubjectId;
                    })[maleRandIndex]; //use maleRandIndex here to increase random
                    var malePicPicked = _.filter(picResults, function(photo){
                        return photo.subjectid == maleSubjectId;
                    })[femaleRandIndex];//use femaleRandIndex here to increase random

                    console.log('testId: '+  testId);
                    var results = memoryCache.get(testId);


                    for (var i = 0; i < results.length; i++) {
                        if(results[i].type == 2064) {
                            results[i].wordsBlob = wordSet[wordSetIndex++];
                        }
                        else if(results[i].type == 2062 && results[i].item==1){
                            results[i].namefacePicBlob = femaleFacesSet;
                            results[i].namefaceNameBlob = femaleNames;
                            results[i].namefaceNamePicked = femaleNamePicked;
                            results[i].namefacePicPicked = femalePicPicked;
                        } else if(results[i].type == 2062 && results[i].item==2) {
                            results[i].namefacePicBlob = maleFacesSet;
                            results[i].namefaceNameBlob = maleNames;
                            results[i].namefaceNamePicked = maleNamePicked;
                            results[i].namefacePicPicked = malePicPicked;
                        }
                    }
                    callback(null, results);
                });
            });
        });
}
exports.getCompleteTestById = getCompleteTestById;