/**
 * Created by xitu on 1/3/2017.
 */
// https://www.npmjs.com/package/xmlbuilder
var xmlbuilder = require('xmlbuilder');
var userSession = require('../login/userLogin');
var dbPool = require("../db/createDBConnectionPool");

exports.buildSessionXml = function(session, callback) {
    var root = xmlbuilder.begin().ele('root', {'id': session.sessionId, 'name':session.testName, 'startTime':session.startTime, 'endTime':session.endTime, 'status':'COMPLETED'});
    root.ele('device')
            .ele('uid',{},'00000000-0000-0000-0000-000000000000')
            .insertAfter('model',{},'dummy')
            .insertAfter('name',{},'dummy')
            .insertAfter('systemName',{},'dummy')
            .insertAfter('systemVersion',{},'0.0.0')
    root.ele('app')
            .ele('buildTime',{}, new Date())
    root.ele('location')
            .ele('latitude',{},'0.000000')
            .insertAfter('longitude',{},'0.000000')
            .insertAfter('altitude',{},'0.000000')
    root.ele('email',{},session.email)
    root.ele('pindex',{},1)
    var responses = root.ele('responses');

    getSessionStates(session.email, function(err, results){
        if(err) {
            logger.error(err);
            callback(err, null);
            return;
        }
        var waiting = results.length;

        var finish = function(){
            waiting--;
            if (waiting==0) {
                var xmlString = root.end({
                    pretty: true,
                    indent: '  ',
                    newline: '\n',
                    allowEmpty: false
                });
                console.log(xmlString);

                callback(null, xmlString);
            }
        }

        /**
         * Hope this will fix your problem, i usually work with this when i need to execute forEach with asynchronous tasks inside.

             foo = [a,b,c,d];
             waiting = foo.length;
             foo.forEach(function(entry){
                  doAsynchronousFunction(entry,finish) //call finish after each entry
            }
             function finish(){
                  waiting--;
                  if (waiting==0) {
                      //do your Job intended to be done after forEach is completed
                  }
            }
         */
        //array.forEach is synchronous and so is the function insde, so you can simply put your callback after your call to foreach:
        results.foreach(function(result) {
            var responseElement = responses.ele('response', {'type': result.type, 'item': result.item,
                'itemType': result.itemType, 'status': result.status,
                'startTime': result.startTime.toUTCString()+" +0000", 'endTime': result.endTime.toUTCString()+" +0000"});
            if(result.afilename!=null && result.afilename!="") responseElement.ele('afilename',{}, result.afilename);
            if(result.subresponses!=null && result.subresponses!="") {
                var subresponses = JSON.parse(result.subresponses);
                for (var subresponse in subresponses) {
                    responseElement.ele('subresponse', subresponse);
                }
            }
            if(result.snrDB!=null && result.snrDB!="") {
                responseElement.ele('snrDB', JSON.parse(result.snrDB));
            }
            if(result.score!=null && result.score!=-1) responseElement.ele('score',{}, result.afilename);
            addExtraResponsesInfoAsync(result, responseElement, finish); //call finish after each entry
        });

        function addExtraResponsesInfoAsync(result, responseElement, callback) {
            if(result.type  == 2064) {
                var sqlGetQuickLitResponse = "select sessionId, testId, type, item, word, isWord, " +
                    " isUsed, level, duration, isTouched, touchTimeStamp, wordIndex, isCorrect " +
                    " from sessionstates_quicklit where sessionId = ？ "
                dbPool.runQueryWithParams(sqlGetQuickLitResponse, [session.sessionId], function(err, words){
                    if(err) {
                        logger.error("sqlGetQuickLitResponse failed! " + err);
                        return;
                    }
                    var wordsElement = responseElement.ele('words');
                    var sequencesElement = responseElement.ele('sequence');
                    words.foreach(function(wordItem){
                        wordsElement.ele('flash', {'word': wordItem.word, 'real': wordItem.isWord,'level': wordItem.level+'', 'duration': wordItem.duration+''});
                        if(wordItem.isTouched!=null && wordItem.isTouched == 'Y') {
                            sequencesElement.ele('touch',{
                                'timestamp': wordItem.touchTimeStamp.toUTCString()+' +0000',
                                'index': wordItem.wordIndex,
                                'correct' : wordItem.isCorrect=='Y' ? 'YES' : 'NO'
                            });
                        }
                    })
                    callback();
                })

            } else if(result.type == 2032){
                var sqlGetTrackTapResponse = "select latency, distance from sessionstates_tracktap where sessionId = ?";
                dbPool.runQueryWithParams(sqlGetTrackTapResponse, [session.sessionId], function(err, taps){
                    if(err) {
                        logger.error("sqlGetTrackTapResponse failed! " + err);
                        callback(err, null);
                        return;
                    }
                    var actionsElement = responseElement.ele('actions')
                    var sum = 0;
                    taps.foreach(function(tap){
                        actionsElement.ele('action',{'latency': tap.latency+'', 'distance': tap.distance+''});
                        sum += tap.latency;
                    })
                    responseElement.ele('latency', {}, Math.round(sum/tap.length));
                    callback();
                })
            } else if(result.type==2000 && result.item==2) {
                //MicrophoneAudioRespone

            } else if(result.type==2000 && result.item==3) {
                //Camera Picture Response
                var sqlGetCameraPicturesInfo = 'select sessionId, takenTime, elapseTime, takenType, ' +
                    ' takenItem, pngFileName from sessionstates_camerapicture where sessionId = ? ';
                dbPool.runQueryWithParams(sqlGetCameraPicturesInfo, [session.sessionId], function(err, pictures) {
                    if(err) {
                        logger.error("sqlGetCameraPicturesInfo failed! " + err);
                        callback(err, null);
                        return;
                    }
                    var picturesElement = responseElement.ele('pictures');
                    pictures.foreach(function(picture){
                        picturesElement.ele('picture',{
                            'takenTime': picture.takenTime.toUTCString()+' +0000',
                            'elapsedTime': picture.elapseTime + '',
                            'type': picture.takenType + '',
                            'item': picture.takenItem + '',
                            'pngFileName': picture.pngFileName
                        });
                    })
                    callback();
                })
            }
        }



    })

}


function getSessionStates(unfinishedSessionId, callback) {
    var sqlGetSessionStates = "select sessionId, testId, type, item, startTime, endTime, score, status, subresponses from sessionstates where sessionId = ? order by endTime";
    dbPool.runQueryWithParams(sqlGetSessionStates, [unfinishedSessionId], function (err, results) {
        if (err) {
            logger.error("getSessionStates() failed for sessionId: " + unfinishedSessionId);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}
/**
 <?xml version="1.0"?>
 <root>
 <xmlbuilder>
 <repo type="git">git://github.com/oozcitak/xmlbuilder-js.git</repo>
 </xmlbuilder>
 </root>

 */