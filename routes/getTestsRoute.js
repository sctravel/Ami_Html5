module.exports = function(app) {
    var userSession = require('../src/login/userSession');

    /* GET test listing. */
    app.get('/test', isLoggedIn, function(req, res) {
        console.log("########start retrieving tests");
        console.dir(req.user);
        userSession.getCompleteTestById(req.user.testId, function (err, results) {
                if (err) {
                    console.error("end calling tests: "+err);
                    return;
                }
                console.dir("end calling tests: " + results);


                res.send(results);
        });
         //res.setHeader('Content-Type', 'application/json');
         //res.send(JSON.stringify(jsonObject));
    });
}

//update progress
//app.get('/tests', function(req, res, next) {
   // response.end(JSON.stringify(rows));
//});

//get progress

//update session xml results

//generate session xml results
//app.get('/tests', function(req, res, next) {
 //   response.end(JSON.stringify(rows));
//})
