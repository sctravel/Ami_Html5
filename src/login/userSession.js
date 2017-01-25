/**
 * Created by tuxi1 on 1/7/2017.
 */
var stringUtil = require('./../common/stringUtil');
var constants = require('./../common/constants');
var emailUtil = require('./../common/emailUtil');
var Session = require("../model/Session.js")
var dbPool = require("../db/createDBConnectionPool");
var _=require('underscore');
var xmlBuilder = require('../common/xmlBuilder');

function getFinishedItemsInSession(unfinishedSessionId, callback) {
    var sqlGetFinishedItemsInSession = "select * from sessionstates where sessionId = ? order by endTime";
    dbPool.runQueryWithParams(sqlGetFinishedItemsInSession, [unfinishedSessionId], function (err, finishedItems) {
        if (err) {
            logger.error("getFinishedItemsInSession() failed for sessionId: " + unfinishedSessionId);
            callback(err, null);
            return;
        }
        logger.info("#####finished items: " + finishedItems.length);
        callback(null, finishedItems);
    });
}
//return null or empty array if there's no unFinished Item in Session
var getUnFinishedTestItemsInSession = function(sessionId, testId, callback) { // or change to sessionID
    //get status from sessionstates table to see whether there's any unfinished session
    var testItems = memoryCache.get(testId);
    console.warn("number of total items: " + testItems.length + " for sessionId: " + sessionId);
    getFinishedItemsInSession(sessionId, function(err, finishedItems) {
        if(err) {
            logger.error("getFinishedItemsInSession() failed. " + err);
            callback(err, null);
            return;
        }
        var remainingItems = testItems;
        if(finishedItems==null || finishedItems.length==0) {
            logger.info("finishedItems is null or empty");
        } else {
            logger.info("#####finished items: " + finishedItems.length);
            //TODO: filter all tests in testId by the results exception type==2000 (volumn check);
            var lastFinishedItem = finishedItems[finishedItems.length-1];
            logger.info("last finished item's seq is: " + lastFinishedItem.seq);
            remainingItems = _.filter(testItems, function(testItem) {
                return (testItem.type==2000 &&testItem.item!=2) || testItem.seq > lastFinishedItem.seq;
            })
        }

        getCompleteTestWithBaseTestItems(remainingItems, function(err, cItems) {
            if(err) {
                callback(err, null);
                return;
            }
            callback(null, cItems);
        })
    });
}
exports.getUnFinishedTestItemsInSession = getUnFinishedTestItemsInSession;




var getCompleteTestWithBaseTestItems = function (testItems, callback) {
    console.log("Entering getCompleteTestWithBaseTestItems() with testItems of " + testItems.length);
    if(testItems==null || testItems.length<1) {
        var err = "getCompleteTestWithBaseTestItems() failed. testItems is null or empty.";
        logger.error(err)
        callback(err, null);
    }

    var allWordsResults = memoryCache.get(constants.cache.QUICKLIT_WORDS);
        var wordSetIndex = 0;
        //May need to select words by level later
        var wordSet = [allWordsResults.slice(0, 4), allWordsResults.slice(4, 10),
            allWordsResults.slice(10, 16), allWordsResults.slice(16, 22)];

                var picResults=memoryCache.get(constants.cache.NAMEFACES_PHOTOES);

                var nameResults = memoryCache.get(constants.cache.NAMEFACES_NAMES);

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

                for (var i = 0; i < testItems.length; i++) {
                    var testItem = testItems[i];
                    if(testItem.type == 2064) {
                        testItem.wordsBlob = wordSet[testItem.item-1];
                    }
                    else if(testItem.type == 2062 && testItem.item==1){
                        testItem.namefacePicBlob = femaleFacesSet;
                        testItem.namefaceNameBlob = femaleNames;
                        testItem.namefaceNamePicked = femaleNamePicked;
                        testItem.namefacePicPicked = femalePicPicked;
                    } else if(testItem.type == 2062 && testItem.item==2) {
                        testItem.namefacePicBlob = maleFacesSet;
                        testItem.namefaceNameBlob = maleNames;
                        testItem.namefaceNamePicked = maleNamePicked;
                        testItem.namefacePicPicked = malePicPicked;
                    }
                }
                callback(null, testItems);
}
exports.getCompleteTestWithBaseTestItems = getCompleteTestWithBaseTestItems;

var getCompleteTestById = function(testId, callback) {
    var testItems = memoryCache.get(testId);
    getCompleteTestWithBaseTestItems(testItems, function(err, results) {
        if(err) {
            logger.err("getCompleteTestWithBaseTestItems() failed " + err);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

exports.getCompleteTestById = getCompleteTestById;


var markSessionEnd = function(userSession, callback) {
    var sqlMarkSessionEnd = 'update sessions set endtime = ? where sessionId= ? ';
    var endtime = new Date();
    userSession.endTime = endtime;
    userSession.testName = memoryCache.get(userSession.testId)[0].testName;
    dbPool.runQueryWithParams(sqlMarkSessionEnd, [userSession.endTime, userSession.sessionId], function (err, results) {
        if (err) {
            logger.error('sqlMarkSessionEnd failed for session ' + userSession.sessionId);
            callback(err, null);
            return;
        }
        console.dir(userSession);
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
