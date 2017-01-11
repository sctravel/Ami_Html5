var dbPool = require('../db/createDBConnectionPool');
var _ = require('underscore');


exports.getTests = function (callback) {



    console.dir("select test items");
    var sqlgetTests = 'select *, i.audio,i.video, t.name AS testName, "" AS wordsBlob, ' +
        ' "" AS namefacePicBlob, "" AS namefaceNameBlob, "" AS namefaceNamePicked, "" AS namefacePicPicked ' +
        ' from testitems ti inner join items i inner join tests t inner join types ty '+
        ' ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type and t.test=? order by seq'

    var sqlTestCounts = 'select count(*) AS counts from tests'
    var sqlQuicklits = 'select * from quicklits ORDER BY RAND() limit 6';
    var sqlNameFacePictures = 'select subjectid, filename, feeling from photoes';
    var sqlNameFaceNames = 'SELECT name, gender, nameset FROM names';

    dbPool.runQueryWithParams(sqlTestCounts,function (err, results) {
        if(err) {
            console.error(err);
            callback(err,null);
            return;
        }
        testNum = Math.floor(results[0].counts*Math.random())+1
        console.dir(Math.floor(results[0].counts*Math.random()));
        dbPool.runQueryWithParams(sqlQuicklits,function (err, results) {
            if(err) {
                console.error(err);
                callback(err,null);
                return;
            }

            total_word_count = Math.random()*6+1
            var random_results =  results.slice(0,total_word_count)
            words_json = JSON.stringify(random_results);

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

                    console.log("picResults");
                    console.dir(picResults);
                    var femalePicPicked = _.filter(picResults, function(photo){
                        return photo.subjectid == femaleSubjectId;
                    })[maleRandIndex]; //use maleRandIndex here to increase random
                    var malePicPicked = _.filter(picResults, function(photo){
                        return photo.subjectid == maleSubjectId;
                    })[femaleRandIndex];//use femaleRandIndex here to increase random
                    console.log('##############femalePicPicked')
                    console.dir(femalePicPicked)
                    console.log('##############malePicPicked')
                    console.dir(malePicPicked)
                    dbPool.runQueryWithParams(sqlgetTests,[testNum],function (err, results) {
                        if(err) {
                            console.error(err);
                            callback(err,null);
                            return;
                        }

                        for (var i = 0; i < results.length; i++) {
                            if(results[i].type == 2064)
                                results[i].wordsBlob = words_json;
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
        });
    });
}