/**
 * Created by xitu on 1/3/2017.
 */
// https://www.npmjs.com/package/xmlbuilder
var xmlbuilder = require('xmlbuilder');
var userSession = require('../login/userLogin');

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
            .ele('latitude',{},"0.000000")
            .insertAfter('longitude',{},"0.000000")
            .insertAfter('altitude',{},"0.000000")
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
            addResponsesAsync(result, finish); //call finish after each entry
        });
        function addResponsesAsync(result, callback) {
            if(result.type in (2062)) {
                //get subresponses from DB

            } else {
                // do the adding
                callback();
            }
        }
        function finish(){
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

    })



}



/**
 <?xml version="1.0"?>
 <root>
 <xmlbuilder>
 <repo type="git">git://github.com/oozcitak/xmlbuilder-js.git</repo>
 </xmlbuilder>
 </root>

 */