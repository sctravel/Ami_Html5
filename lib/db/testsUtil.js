var getTests = function (userId,callback) {

    console.dir(sqlupdate);
    var sqlgetTests = ''

    dbPool.runQueryWithParams(sqlgetTests,function (err, results) {
        if(err) {
            console.error(err);
            callback(err,null);
            return;
        }

        callback(null,constants.services.CALLBACK_SUCCESS);
    });

}