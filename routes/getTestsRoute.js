module.exports = function(app) {
    var userSession = require('../src/login/userSession');
    var constants = require('../src/common/constants');

    // GET complete test listing.
    app.get('/api/test', isLoggedIn, function(req, res) {
        logger.info("Start retrieving tests for " + req.user.email);
        userSession.getCompleteTestById(req.user.testId, function (err, results) {
                if (err) {
                    logger.error("end calling /api/test: "+err);
                    res.send(constants.services.CALLBACK_FAILED);
                    return;
                }
                res.send(results);
        });
    });

    // GET the unfinished test items in the session and continue
    app.get('/api/remainingTest', isLoggedIn, function(req, res) {
        logger.info("Start retrieving tests for " + req.user.email);
        userSession.getUnFinishedTestItemsInSession(req.user.sessionId, req.user.testId, function (err, results) {
            if (err) {
                logger.error("end calling /api/remainingTest: "+err);
                res.send(constants.services.CALLBACK_FAILED);
                return;
            }
            res.send(results);
        });
    });
}

