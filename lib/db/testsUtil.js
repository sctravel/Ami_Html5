var dbPool = require('../db/createDBConnectionPool');

exports.getTests = function (callback) {

    console.dir("select test items");
    var sqlgetTests = 'select *, i.audio,i.video, "" AS wordsBlob '+
    'from testitems ti inner join items i inner join tests t inner join types ty '+
    'ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type and t.test=?'

    var sqlTestCounts = 'select count(*) AS counts from tests'
    var sqlQuicklits = 'select * from quicklits'

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

                    words_json = JSON.stringify(results);
              
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
                             }


                            callback(err,results);
                    });
            });
    });
}