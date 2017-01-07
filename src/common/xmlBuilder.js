/**
 * Created by xitu on 1/3/2017.
 */
// https://www.npmjs.com/package/xmlbuilder
var xmlbuilder = require('xmlbuilder');

exports.buildSessionXml = function(session, callback) {
    var root = xmlbuilder.begin().ele('root', {'id': session.Id, 'name':session.testName, 'startTime':session.startTime, 'endTime':session.endTime, 'status':'COMPLETED'});
    root.ele('device')
            .ele('uid')
            .insertAfter('model')
            .insertAfter('name')
            .insertAfter('systemName')
            .insertAfter('systemVersion')
            .up()
        .ele('app')
            .ele('buildTime')
            .up()
        .ele('location')
            .ele('latitude')
            .ele('longitude')
            .ele('altitude')
            .up()
        .ele('email')
        .ele('pindex')
    var responses = root.ele('responses');
    for (var i = 1; i <= 3; i++) {
        // Create an XML fragment
        responses = xmlbuilder.create('person').att('id', i);
        // Import the root node of the fragment after
        // the people node of the main XML document
        peopleNode.importDocument(person);
    }
    //get states from sessionstates table

    var xmlString = root.end({
        pretty: true,
        indent: '  ',
        newline: '\n',
        allowEmpty: false
    });
    console.log(xmlString);

    callback(null, xmlString);
}



/**
 <?xml version="1.0"?>
 <root>
 <xmlbuilder>
 <repo type="git">git://github.com/oozcitak/xmlbuilder-js.git</repo>
 </xmlbuilder>
 </root>

 */