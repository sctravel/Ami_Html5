var dbPool = require('../db/createDBConnectionPool');

exports.getTests = function (callback) {

    console.dir("select test items");
    var sqlgetTests = 'select *, i.audio,i.video '+
    'from testitems ti inner join items i inner join tests t inner join types ty ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type and t.test=?'

    var sqlTestCounts = 'select count(*) AS counts from tests'

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
        console.error(Math.floor(results[0].counts*Math.random()));
        dbPool.runQueryWithParams(sqlgetTests,[testNum],function (err, results) {
            if(err) {
                console.error(err);
                callback(err,null);
                return;
            }

            callback(err,results);

       // callback(null,constants.services.CALLBACK_SUCCESS);
        });
        
       // callback(null,constants.services.CALLBACK_SUCCESS);
    });
    
}