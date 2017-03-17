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
                    return;
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

                 var file = new File([xmlString], 'amipace/'+req.user.sessionId+'/'+xmlFileName, {
                            lastModified: new Date(0), // optional - default = now
                            type: "overide/mimetype" // optional - default = ''
                        });
                        console.log(" adding audio files -- " + xmlFileName);


                $.get( "/getPresignedURL", { fileName: file.name, type: file.type}, function( dataURL ) {
                            $.ajax({
                                type : 'PUT',
                                url : dataURL,
                                data : file,
                                processData: false,  // tell jQuery not to convert to form data
                                contentType: file.type,
                                success: function(json) { postItemResponse(currentItemResponse); },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    alert('Opps, uploading audio failed! Refreshing the page and try it again. Thank you for your patient.');
                                    window.location.href = '/interview';
                                }
                            });
                        });
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
    });

}

