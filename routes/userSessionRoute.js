/**
 * Created by tuxi1 on 1/7/2017.
 */

module.exports = function(app) {
    this.name = 'userSessionRoute';
    var constants = require('../src/common/constants');
    var stringUtil = require('../src/common/stringUtil');
    var isLoggedIn = require('../app').isLoggedIn;
    var userSession = require('../src/login/userSession');

    app.post('/api/session/updateSessionState', isLoggedIn, function (req, res) {
        var sessionState = req.body.itemResponse;
        userSession.addFinishedSessionTestItem(itemResponse, req.user.sessionId, function(err, results) {
           if(err) {
               logger.error(err);
               return;
           }
           res.send(constants.services.CALLBACK_SUCCESS);
        });
    });


}

