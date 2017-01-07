var dbPool = require('../db/createDBConnectionPool');

exports.getTests = function (callback) {

    console.dir("select test items");
    var sqlgetTests = 'select *, i.audio,i.video, "" AS wordsBlob, "" AS namefaceBlob '+
    'from testitems ti inner join items i inner join tests t inner join types ty '+
    'ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type and t.test=?'

    var sqlTestCounts = 'select count(*) AS counts from tests'
    var sqlQuicklits = 'select * from quicklits ORDER BY RAND() limit 6'
    var sqlNameFace = 'select * from photoes AS p inner join (select * from photos order by RAND() limit 1) AS s ON p.subjectid = s.subjectid'

    testId = 1; 

    /*dbPool.runQueryWithParams(sqlgetTests,[testId],function (err, results) {
        if(err) {
            console.error(err);
            callback(err,null);
            return;
        }

        callback(err,results);

       // callback(null,constants.services.CALLBACK_SUCCESS);
    });*/

    dbPool.runQueryWithParams(sqlTestCounts,function (err, results) {
        if(err) {
            console.error(err);
            callback(err,null);
            return;
        }
        testNum = Math.floor(results[0].counts*Math.random())
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

                    dbPool.runQueryWithParams(sqlNameFace,function (err, results) {
                            nameface_json = JSON.stringify(results);
                    
                            console.dir(words_json);
                            dbPool.runQueryWithParams(sqlgetTests,[testNum],function (err, results) {
                                    if(err) {
                                        console.error(err);
                                        callback(err,null);
                                        return;
                                    }
                                    const util = require('util');

                                    console.log(util.inspect(results, {showHidden: false, depth: null}));
                                    
                                    for (var i = 0; i < results.length; i++) {
                                        if(results[i].type == 2064)
                                        results[i].wordsBlob = words_json;
                                        if(results[i].type == 2062)
                                        results[i].namefaceBlob = nameface_json;
                                    }


                                    callback(err,results);
                            });
                    });
            });
    });
}