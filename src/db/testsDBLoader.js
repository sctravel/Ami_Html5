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

exports.getTestCountFromDB = getTestCountFromDB;

function getAllBaseTestsFromDB(callback){
    var sqlgetTests = 'select *, i.audio,i.video, t.name AS testName, "" AS wordsBlob, ' +
        ' "" AS namefacePicBlob, "" AS namefaceNameBlob, "" AS namefaceNamePicked, "" AS namefacePicPicked ' +
        ' from testitems ti inner join items i inner join tests t inner join types ty '+
        ' ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type order by t.test, seq';

    dbPool.runQuery(sqlgetTests, function (err, testResults) {
        if (err) {
            logger.error("getAllBaseTestsFromDB() failed: " + err);
            callback(err, null);
            return;
        }
        callback(null, testResults);
    });
}
exports.getAllBaseTestsFromDB = getAllBaseTestsFromDB;


