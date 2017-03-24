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
        logger.error("entering endSession func()" );
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

                console.log("Uploading session xml in for local server finished, now upload file to s3");
                
                //upload files from server side directly
                var AWS = require('aws-sdk');

                AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY})
                var s3 = new AWS.S3();
                console.log('Start getting presigned URL: ', xmlFileName);
                const util = require('util')
                // Tried with and without this. Since s3 is not region-specific, I don't
                // think it should be necessary.
                // AWS.config.update({region: 'us-west-2'})
                const myBucket = 'amipaces'
                // call S3 to retrieve upload file to specified bucket
                var uploadParams = {Bucket: myBucket, Key: '', Body: ''};
                var file = xmlFileName;

                var fileStream = fs.createReadStream(file);
                fileStream.on('error', function(err) {
                console.log('File Error', err);
                });
                uploadParams.Body = fileStream;

                var path = require('path');
                uploadParams.Key = "amipace/" + req.user.sessionId + "/session.xml";

                // call S3 to retrieve upload file to specified bucket
                s3.upload (uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    console.log("Upload Success", data.Location);
                }
                });

                /////////////upload log files//////////
                logfilename = 'logs/client/'+req.user.sessionId+'.log';
                var fileStream = fs.createReadStream(logfilename);
                fileStream.on('error', function(err) {
                console.log('log file File Error', err);
                });
                uploadParams.Body = fileStream;

                var path = require('path');
                uploadParams.Key = "amipace/logs/" + req.user.sessionId + ".log";

                // call S3 to retrieve upload file to specified bucket
                s3.upload (uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    console.log("Upload Success", data.Location);
                }
                });

                //S3 upload method from frontend UI
                /* //path.basename(file);
                var parts = [
                    new Blob([xmlString], {type: 'text/plain'}),
                    ' Same way as you do with blob',
                    new Uint16Array([33])
                ];
                var file = new File([parts], 'amipace/'+req.user.sessionId+'/'+xmlFileName, {
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
                });*/
                    res.send(constants.services.CALLBACK_SUCCESS);
                })
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

