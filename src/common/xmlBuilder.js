/**
 * Created by xitu on 1/3/2017.
 */
// https://www.npmjs.com/package/xmlbuilder
var builder = require('xmlbuilder');
var xml = builder.create('root')
    .ele('xmlbuilder')
    .ele('repo', {'type': 'git'}, 'git://github.com/oozcitak/xmlbuilder-js.git')
    .end({ pretty: true});

console.log(xml);

/**
 <?xml version="1.0"?>
 <root>
 <xmlbuilder>
 <repo type="git">git://github.com/oozcitak/xmlbuilder-js.git</repo>
 </xmlbuilder>
 </root>

 */