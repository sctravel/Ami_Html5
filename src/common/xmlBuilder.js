/**
 * Created by xitu on 1/3/2017.
 */
// https://www.npmjs.com/package/xmlbuilder
var xmlbuilder = require('xmlbuilder');
var userSession = require('../login/userLogin');
var dbPool = require("../db/createDBConnectionPool");
var _=require('underscore');
var stringUtil = require('./stringUtil');


function getSessionStates(sessionId, callback) {
    var sqlGetSessionStates = "select sessionId, testId, type, item, itemType, startTime, endTime, afilename, score," +
        " status, subresponses, snrDB " +
        " from sessionstates where sessionId = ? and type is not null order by endTime";
    dbPool.runQueryWithParams(sqlGetSessionStates, [sessionId], function (err, results) {
        if (err) {
            logger.error("getSessionStates() failed for sessionId: " + sessionId);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}


var buildSessionXml = function(session, callback) {
    var root = xmlbuilder.begin().ele('session',
        {
            'id': session.sessionId,
            'name':session.testName==null ? 'Unknown' : session.testName,
            'startTime':stringUtil.toUTCDateTimeString(session.startTime),
            'endTime':stringUtil.toUTCDateTimeString(session.endTime),
            'status':'COMPLETED'
        },
        '');
    root.ele('device')
            .ele('uid',{},'00000000-0000-0000-0000-000000000000')
            .insertAfter('model',{},'Html5')
            .insertAfter('name',{},'Html5')
            .insertAfter('systemName',{},'dummy')
            .insertAfter('systemVersion',{},'0.0.0')
    root.ele('app')
            .ele('buildTime',{}, stringUtil.toUTCDateTimeString(new Date()))
    root.ele('location')
            .ele('latitude',{},'0.000000')
            .insertAfter('longitude',{},'0.000000')
            .insertAfter('altitude',{},'0.000000')
    root.ele('email',{},session.email)
    root.ele('pindex',{},1)
    var responses = root.ele('responses');
    console.log('build XML - start get session states');
    getSessionStates(session.sessionId, function(err, results){
        if(err) {
            console.log('build XML - getSessionStates failed');
            logger.error('getSessionStates failed ' + err);
            callback(err, null);
            return;
        }
        var waiting = results.length;
        var finish = function(){
            waiting--;
            console.log('waiting: '+ waiting);
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

        //array.forEach is synchronous and so is the function insde, so you can simply put your callback after your call to foreach:
        results.forEach(function(result) {
            var responseElement = responses.ele('response', {'type': result.type, 'item': result.item,
                'itemType': result.itemType==null ? "Missing" :result.itemType, 'status': result.status,
                'startTime': stringUtil.toUTCDateTimeString(result.startTime), 'endTime': stringUtil.toUTCDateTimeString(result.endTime)},
                '');
            if(result.afilename!=null && result.afilename!="") responseElement.ele('afilename',{}, result.afilename);
            if(result.subresponses!=null && result.subresponses!="") {
                var subresponses = JSON.parse(result.subresponses);
                for (var idx in subresponses) {
                    responseElement.ele('subresponse', subresponses[idx],'');
                }
            }
            if(result.snrDB!=null && result.snrDB!="") {
                responseElement.ele('snrDB', JSON.parse(result.snrDB),'');
            }
            if(result.score!=null && result.score!=-999) responseElement.ele('score',{}, result.score);
            console.log('build XML - result foreach ongoing');

            addExtraResponsesInfoAsync(result, responseElement, finish); //call finish after each entry
        });

        function addExtraResponsesInfoAsync(result, responseElement, callback) {
            if(result.type  == 2064) {
                var sqlGetQuickLitResponse = "select sessionId, testId, type, item, word, isWord, " +
                    " isUsed, level, duration, isTouched, touchTimeStamp, wordIndex, isCorrect " +
                    " from sessionstates_quicklit where sessionId = ? and item = ? "
                dbPool.runQueryWithParams(sqlGetQuickLitResponse, [session.sessionId, result.item], function(err, words){
                    if(err) {
                        logger.error("sqlGetQuickLitResponse failed! " + err);
                        return;
                    }
                    var wordsElement = responseElement.ele('words');
                    var sequencesElement = responseElement.ele('sequence');

                    words.forEach(function(wordItem){
                        wordsElement.ele('flash', {'word': wordItem.word, 'real': wordItem.isWord,'level': wordItem.level+'', 'duration': wordItem.duration+''},'');
                        if(wordItem.isTouched!=null && wordItem.isTouched == 'Y') {
                            sequencesElement.ele('touch',{
                                'timestamp': stringUtil.toUTCDateTimeString(wordItem.touchTimeStamp),
                                'index': wordItem.wordIndex,
                                'correct' : wordItem.isCorrect=='Y' ? 'YES' : 'NO'
                            },'');
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
                    taps.forEach(function(tap){
                        actionsElement.ele('action',{'latency': tap.latency+'', 'distance': tap.distance+''},'');
                        sum += tap.latency;
                    })
                    responseElement.ele('latency', {}, Math.round(sum/taps.length));
                    callback();
                })
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
                    pictures.forEach(function(picture){
                        picturesElement.ele('picture',{
                            'takenTime': stringUtil.toUTCDateTimeString(picture.takenTime),
                            'elapsedTime': picture.elapseTime + '',
                            'type': picture.takenType + '',
                            'item': picture.takenItem + '',
                            'pngFileName': picture.pngFileName
                        },'');
                    })
                    callback();
                })
            } else {
                callback();
            }
        }



    })

}

/*
 var session={}
 session.sessionId = '20170120-015740-66604'
 session.email = 'tx3@gmail.com'
 session.startTime = new Date('2017-01-20 01:57:40')
 session.endTime = new Date('2017-01-20 02:06:30')
 session.testName = 'MinProduct'

buildSessionXml(session, function(err, xmlString){
    if(err) {
        console.error(err);
        return;
    }
    fs.writeFile('logs/'+session.sessionId+"_session.xml", xmlString, function(err) {
        if(err) {
            logger.error("Write xmlString to file failed. " + err);
            //res.send(constants.services.CALLBACK_FAILED);
            return
        }
        //res.send(constants.services.CALLBACK_SUCCESS);
    });
});*/

exports.buildSessionXml = buildSessionXml;
/**
 <?xml version="1.0"?>
 <root>
 <xmlbuilder>
 <repo type="git">git://github.com/oozcitak/xmlbuilder-js.git</repo>
 </xmlbuilder>
 </root>

 */