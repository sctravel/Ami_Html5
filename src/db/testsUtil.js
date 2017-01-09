var dbPool = require('../db/createDBConnectionPool');

exports.getTests = function (callback) {

    console.dir("select test items");
    var sqlgetTests = 'select *, i.audio,i.video, "" AS wordsBlob, "" AS namefacePicBlob, "" AS namefaceNameBlob, "" AS namefacePicked ' +
        'from testitems ti inner join items i inner join tests t inner join types ty '+
        'ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type and t.test=? order by seq'

    var sqlTestCounts = 'select count(*) AS counts from tests'
    var sqlQuicklits = 'select * from quicklits ORDER BY RAND() limit 6'
    var sqlNameFacePictures = 'select * from photoes AS p inner join (select * from photos order by RAND() limit 1) AS s ON p.subjectid = s.subjectid'
    var sqlNameFaceNames = 'SELECT name FROM names as na Inner join (SELECT nameset,gender from names where gender=? ORDER BY RAND() LIMIT 1) AS n where n.nameset=na.nameset and na.gender=n.gender '

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

            dbPool.runQueryWithParams(sqlNameFacePictures,function (err, results) {
                nameface_pics_json = JSON.stringify(results);

                var gender = results[0].gender
                console.dir(gender);
                dbPool.runQueryWithParams(sqlNameFaceNames,[gender],function (err, results) {
                    if(err) {
                        console.error(err);
                        callback(err,null);
                        return;
                    }
                    var nameface_pics_names = JSON.stringify(results);
                    var index = Math.floor(results.length*Math.random())
                    var nameface_name_picked = results[index]

                    dbPool.runQueryWithParams(sqlgetTests,[testNum],function (err, results) {
                        if(err) {
                            console.error(err);
                            callback(err,null);
                            return;
                        }
                        const util = require('util');

                        // console.log(util.inspect(results, {showHidden: false, depth: null}));
                        for (var i = 0; i < results.length; i++) {
                            if(results[i].type == 2064)
                                results[i].wordsBlob = words_json;
                            if(results[i].type == 2062){
                                results[i].namefacePicBlob = nameface_pics_json;
                                results[i].namefaceNameBlob = nameface_pics_names;
                                results[i].namefacePicked = nameface_name_picked;
                            }
                        }
                        callback(err,results);
                    });
                });
            });
        });
    });
}