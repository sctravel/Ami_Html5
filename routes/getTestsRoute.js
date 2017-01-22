module.exports = function(app) {
    var userSession = require('../src/login/userSession');

    // GET complete test listing.
    app.get('/test', isLoggedIn, function(req, res) {
        logger.info("Start retrieving tests for " + req.user.email);
        userSession.getCompleteTestById(req.user.testId, function (err, results) {
                if (err) {
                    console.error("end calling tests: "+err);
                    return;
                }
                res.send(results);
        });
    });

    // GET the unfinished test items in the session and continue
    app.get('/remainingTest', isLoggedIn, function(req, res) {
        logger.info("Start retrieving tests for " + req.user.email);
        userSession.getCompleteTestById(req.user.testId, function (err, results) {
            if (err) {
                console.error("end calling tests: "+err);
                return;
            }
            res.send(results);
        });
    });
}

