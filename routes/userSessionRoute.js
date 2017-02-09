/**
 * Created by tuxi1 on 1/7/2017.
 */

module.exports = function(app) {
    this.name = 'userSessionRoute';
    var constants = require('../src/common/constants');
    var userSession = require('../src/login/userSession');
    var userSessionResponse = require('../src/login/userSessionResponse');
    var xmlBuilder = require('../src/common/xmlBuilder');

    app.post('/api/session/updateSessionState', isLoggedIn, function (req, res) {
        var itemResponse = req.body.itemResponse;
        userSessionResponse.addItemResponseToSession(itemResponse, req.user.sessionId, function(err, results) {
           if(err) {
               logger.error("update session state failed with error: " + err);
               res.send(constants.services.CALLBACK_FAILED);
               return;
           }
           res.send(constants.services.CALLBACK_SUCCESS);
        });
    });

    app.post('/api/session/cameraPictureSessionData', isLoggedIn, function (req, res) {
        var picture = req.body.pictureInfo;
        userSessionResponse.addIndividualPictureResponseToSession(picture, req.user.sessionId, function(err, results) {
            if(err) {
                logger.error("post cameraPictureSessionData failed with error: " + err);
                res.send(constants.services.CALLBACK_FAILED);
                return;
            }
            res.send(constants.services.CALLBACK_SUCCESS);
        });
    });

    app.post('/api/session/endSession', isLoggedIn, function (req, res) {
        var cameraPictureResponse = req.body.cameraPictureResponse;
        userSessionResponse.addItemResponseToSession(cameraPictureResponse, req.user.sessionId, function(err, results) {
            if(err) {
                logger.error("post cameraPictureResponse failed with error: " + err);
                res.send(constants.services.CALLBACK_FAILED);
                return;
            }
            userSession.markSessionEnd(req.user, function(err, xmlString){
                if(err){
                    logger.error("markSessionEnd failed with error: " + err);
                    res.send(constants.services.CALLBACK_FAILED);
                    return;s
                }
                //TODO: write xml and upload to S3
                console.log("Uploading session xml in /api/session/endSession");
                var xmlFileName = constants.paths.UPLOAD_FOLDER + req.user.email + "_" + req.user.sessionId + "/session.xml";
                logger.info("uploading session xml - " + xmlFileName);
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

    app.get('/api/currentPictureId', isLoggedIn, function(req, res){
        userSession.getCurrentSessionPictureId(req.user.sessionId, function(err, result) {
            if(err) {
                logger.error("post cameraPictureResponse failed with error: " + err);
                res.send(constants.services.CALLBACK_FAILED);
                return;
            }
            res.send(result);
        })
    })
    /*app.get('/api/xml', function(req, res) {

        var session = {};
        session.testId=3;
        session.email='test1@ami.com';
        session.startTime = new Date('2017-01-24 17:49:32');
        session.endTime = new Date('2017-01-24 17:59:32');
        session.sessionId = '20170124-174932-70695';
        session.testName = memoryCache.get(session.testId)[0].testName;

        xmlBuilder.buildSessionXml(session, function(err, xmlString){
            if(err) {
                logger.error("Build Session XML error. " + err);
                callback(err, null);
                return;
            }
            var xmlFileName = constants.paths.UPLOAD_FOLDER + session.email+ "_" + session.sessionId + "/"+session.sessionId+"_session.xml";
            logger.info("uploading session xml - " + xmlFileName);
            fs.writeFile(xmlFileName, xmlString, function(err) {
                if(err) {
                    logger.error("Write xmlString to file failed. " + err);
                    res.send(constants.services.CALLBACK_FAILED);
                    return
                }
                res.send(constants.services.CALLBACK_SUCCESS);
            });
        });


    })*/
}

