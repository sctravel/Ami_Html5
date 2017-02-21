var dbPool = require('../db/createDBConnectionPool');
var _ = require('underscore');
var constants = require('../common/constants');

function getTestCountFromDB(callback) {
    var sqlTestCounts = 'select count(*) AS counts from tests';
    dbPool.runQueryWithParams(sqlTestCounts,function (err, results) {
        if (err) {
            logger.error("getTestCountFromDB() failed: " + err);
            callback(err, null);
            return;
        }
        callback(null, results[0].counts);
    });
}

function getAllBaseTestsFromDB(callback){
    var sqlGetTests = 'select *, i.audio,i.video, t.name AS testName, "" AS wordsBlob, ' +
        ' "" AS namefacePicBlob, "" AS namefaceNameBlob, "" AS namefaceNamePicked, "" AS namefacePicPicked ' +
        ' from testitems ti inner join items i inner join tests t inner join types ty '+
        ' ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type order by t.test, seq';

    dbPool.runQuery(sqlGetTests, function (err, testResults) {
        if (err) {
            logger.error("getAllBaseTestsFromDB() failed: " + err);
            callback(err, null);
            return;
        }
        callback(null, testResults);
    });
}


function getAllNameFaceNamesFromDB(callback) {
    var sqlGetNameFaceNames = 'SELECT name, gender, nameset FROM names';
    dbPool.runQuery(sqlGetNameFaceNames, function (err, nameFaceNames) {
        if (err) {
            logger.error("getAllNameFaceNamesFromDB() failed: " + err);
            callback(err, null);
            return;
        }
        callback(null, nameFaceNames);
    });
}

function getAllNameFacePhotoesFromDB(callback) {
    var sqlGetNameFacephotoes = 'select subjectid, filename, feeling from photoes';
    dbPool.runQuery(sqlGetNameFacephotoes, function (err, nameFacePhotoes) {
        if (err) {
            logger.error("getAllNameFacePhotoesFromDB() failed: " + err);
            callback(err, null);
            return;
        }
        callback(null, nameFacePhotoes);
    });
}

function getAllQuickLitWordsFromDB(callback) {
    var sqlGetQuickLitWords = 'select * from quicklits';
    dbPool.runQuery(sqlGetQuickLitWords, function (err, allWords) {
        if (err) {
            logger.error("getAllQuickLitWordsFromDB() failed: " + err);
            callback(err, null);
            return;
        }
        callback(null, allWords);
    });
}

module.exports = {
    getAllQuickLitWordsFromDB : getAllQuickLitWordsFromDB,
    getAllNameFacePhotoesFromDB : getAllNameFacePhotoesFromDB,
    getAllNameFaceNamesFromDB : getAllNameFaceNamesFromDB,
    getAllBaseTestsFromDB : getAllBaseTestsFromDB,
    getTestCountFromDB : getTestCountFromDB
}