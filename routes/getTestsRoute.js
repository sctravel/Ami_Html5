module.exports = function(app) {

var testsUtil = require('../lib/db/testsUtil');

/* GET test listing. */
app.get('/tests', function(req, res, next) {
     console.log("########start retrieving tests");
         testsUtil.getTests(function (err, results) {
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
