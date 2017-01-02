var dbPool = require('../db/createDBConnectionPool');

exports.getTests = function (callback) {

    console.dir("select test items");
    var sqlgetTests = 'select * from testitems ti inner join  items i inner join tests t inner join types ty ON ti.item = i.item and ti.type= i.type and t.test=ti.test and ty.type = i.type'

    dbPool.runQueryWithParams(sqlgetTests,function (err, results) {
        if(err) {
            console.error(err);
            callback(err,null);
            return;
        }

        callback(err,results);

       // callback(null,constants.services.CALLBACK_SUCCESS);
    });

}