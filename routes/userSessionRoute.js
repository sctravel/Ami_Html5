/**
 * Created by tuxi1 on 1/7/2017.
 */

module.exports = function(app) {
    this.name = 'userSessionRoute';
    var constants = require('../src/common/constants');
    var userSession = require('../src/login/userSession');

    app.post('/api/session/updateSessionState', isLoggedIn, function (req, res) {
        var itemResponse = req.body.itemResponse;
        userSession.addItemResponseToSession(itemResponse, req.user.sessionId, function(err, results) {
           if(err) {
               logger.error("update session state failed with error: " + err);
               return;
           }
           res.send(constants.services.CALLBACK_SUCCESS);
        });
    });

    app.post('/api/session/cameraPictureSessionData', isLoggedIn, function (req, res) {
        var picture = req.body.pictureInfo;
        userSession.addIndividualPictureResponseToSession(picture, req.user.sessionId, function(err, results) {
            if(err) {
                logger.error("post cameraPictureSessionData failed with error: " + err);
                return;
            }
            res.send(constants.services.CALLBACK_SUCCESS);
        });
    });

    app.post('/api/session/endSession', isLoggedIn, function (req, res) {
        var cameraPictureResponse = req.body.cameraPictureResponse;
        userSession.addItemResponseToSession(cameraPictureResponse, req.user.sessionId, function(err, results) {
            if(err) {
                logger.error("post cameraPictureResponse failed with error: " + err);
                return;
            }
            userSession.markSessionEnd(req.user, function(err, xmlString){
                if(err){
                    logger.error("markSessionEnd failed with error: " + err);
                    res.send(constants.services.CALLBACK_FAILED);
                    return;
                }
                //TODO: write xml and upload to S3
                var xmlFileName = 'logs/'+req.user.sessionId+"_session.xml";
                fs.writeFile(xmlFileName, xmlString, function(err) {
                    if(err) {
                        logger.error("Write xmlString to file failed. " + err);
                        res.send(constants.services.CALLBACK_FAILED);
                        return
                    }
                    res.send(constants.services.CALLBACK_SUCCESS);
                });
            })
        });
    });
}

