
///////////////////////////////////////////////////////////////////////////
// Module dependencies
///////////////////////////////////////////////////////////////////////////
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var passport = require('passport');
var constants = require('./src/common/constants.js');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
global.fs = require('fs');
var _ = require("underscore");

//var busboyBodyParser = require('busboy-body-parser');

///////////////////////////////////////////////////////////////////////////
// Environments Settings
///////////////////////////////////////////////////////////////////////////
var app = express();
// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/images/icon_large.png'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('123456xyz'));
app.use(express.session({cookie: { maxAge: 3*60*60*1000}})); // Session expires in SESSION_HOURS hours
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.methodOverride());
//app.use(busboyBodyParser({ limit: '15mb' }));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));



///////////////////////////////////////////////////////////////////////////
// Log4js configuration
///////////////////////////////////////////////////////////////////////////
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/access.log',
            maxLogSize: 1024*1024*100, //100MB
            backups:3,
            "layout": {
                "type": "pattern",
                "pattern": "%m"
            },
            "category": "AMI_HTML5"
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('AMI_HTML5');
if ('development' == app.get('env')) {
    logger.setLevel('DEBUG');
    app.use(log4js.connectLogger(logger, {level:log4js.levels.DEBUG, format:':method :url'}));
} else {
    logger.setLevel('INFO');
    app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO, format:':method :url'}));
}
exports.logger=logger;

///////////////////////////////////////////////////////////////////////////
// Router / Middleware configuration
///////////////////////////////////////////////////////////////////////////
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

fs.mkdir(constants.paths.UPLOAD_FOLDER,function(e){});

var configUserLoginRoute = require('./routes/userLoginRoute');
configUserLoginRoute(app);

var getTestsRoute = require('./routes/getTestsRoute');
getTestsRoute(app);
///////////////////////////////////////////////////////////////////////////
// SSL Certification
///////////////////////////////////////////////////////////////////////////
/*var tls = require('tls');
 var fs = require('fs');
 var serverOptions = {
 key: fs.readFileSync('./my_key.pem'),
 ca:  fs.readFileSync('./intermediate.pem'),
 cert: fs.readFileSync('./my_cert.pem')
 };
*/

 //User login, need to separate from recipient login
 function isLoggedIn(req, res, next) {
     if (req.isAuthenticated()) {
         return next();
     } else {
         res.redirect("/");
     }
 }
 exports.isLoggedIn = isLoggedIn;

///////////////////////////////////////////////////////////////////////////
// Page Routing
///////////////////////////////////////////////////////////////////////////
app.get('/', function (req,res){
    console.log(req.user);
    req.session.lastPage = '/';

    res.render('index',{error: req.flash('error'), success: req.flash('success'), message:req.flash('message') });
});

app.get('/index2', function (req,res){
    console.log(req.user);
    req.session.lastPage = '/';

    res.render('index2',{error: req.flash('error'), success: req.flash('success'), message:req.flash('message') });
});

app.get('/adjustVolume', function (req,res){
    res.render('adjustVolume',{user: req.user});
});
app.get('/testMic', function (req,res){
    res.render('testMicVolumeAndNoise',{user: req.user});
});


app.get('/s3test', function (req,res){
    res.redirect('/test.html');
});

app.get('/audio', function (req,res){
    console.log(req.user);

    res.render('recorder',{user: req.user});
});

app.get('/interview', function (req,res){
    console.log(req.user);
    res.render('interview',{user: req.user});
});

app.get('/questionSet', function(req, res){
    console.info("####################")
    var questionSet = JSON.parse(fs.readFileSync('./document/questionSet.json', 'utf8'));
    // run

    //questionSet = _.where(questionSet, {test: 1});
    console.dir(questionSet);
    res.send(questionSet);
});

app.get('/game', function (req,res){
    res.render('game', {user: req.user});
});




app.post('/upload/audio/', function (req, res) {
    logger.info("########start uploading wav file");
    var id = req.body.id;
    var buf =  new Buffer(req.body.blob, 'Base64'); // decode
    var filename = constants.paths.UPLOAD_FOLDER + "/test/question_" + id + ".wav";
    if(req.user) {
        constants.paths.UPLOAD_FOLDER + req.user.userId + "_" + req.user.sessionId + "/question_" + id + ".wav"; //"+req.user+"_"+req.sessionId+"\\
    }
    fs.writeFile(filename, buf, function(err) {
        res.sendStatus(err ? 500 : 200);
        return;
    });
    logger.info("########upload wav file succeeded!");
    res.send("ok");
});






////////////////////////////////////
//Recipient Pages / Services
////////////////////////////////////

////////////////////////////////////
//Handle all uncaught exceptions
////////////////////////////////////
process.on('uncaughtException', function(err) {
    logger.error('Caught exception: ' + err);
});

///////////////////////////////////////////////////////////////////////////
// Start Server
///////////////////////////////////////////////////////////////////////////
if ('development' == app.get('env')) {
    app.set('port', process.env.PORT || 3000);
    http.createServer(app).listen(app.get('port'), function(){
        logger.info('Express server listening on port ' + app.get('port'));
    });
}else
{
    app.set('port', process.env.PORT || 443);
    https.createServer(app).listen(app.get('port'), function(){
        logger.info('Express server listening on port ' + app.get('port'));
    });
    http.createServer(app).listen(80, function(){
        logger.info('Express server listening on port 80');
    });
}


