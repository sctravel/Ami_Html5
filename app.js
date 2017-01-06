
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
var _ = require("underscore");
global.fs = require('fs');
var JL = require('jsnlog').JL;
var winston = require('winston');

var logFormatter = function(options) {
    return (new Date()).toISOString() +' ['+ (options.meta && Object.keys(options.meta).length ? options.meta.loggerName : '' )+'] ' +'['+ options.level.toUpperCase() +'] '+ (options.message ? options.message : '') ;
};

exports.logFormatter = logFormatter;

winston.loggers.add('server', {
    file: {
        filename: 'logs/server.log',
        maxsize: 15000000,
        json: false,
        timestamp: new Date(),
        formatter: logFormatter
    }
});

global.logger = winston.loggers.get('server');

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
// Router / Middleware configuration
///////////////////////////////////////////////////////////////////////////
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//User login, need to separate from recipient login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/");
    }
}
exports.isLoggedIn = isLoggedIn;
fs.mkdir(constants.paths.UPLOAD_FOLDER,function(e){});

var configUserLoginRoute = require('./routes/userLoginRoute');
configUserLoginRoute(app);

var getTestsRoute = require('./routes/getTestsRoute');
getTestsRoute(app);

var s3Route = require('./routes/s3Route');
s3Route(app);
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

app.get('/interview', isLoggedIn, function (req,res){
    console.log(req.user);
    res.render('interview',{user: req.user});
});

app.get('/questionSet', function(req, res){
    console.info("####################")
    var questionSet = JSON.parse(fs.readFileSync('./document/questionSet.json', 'utf8'));
    //questionSet = _.where(questionSet, {test: 1});
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



// jsnlog.js on the client by default sends log messages to /jsnlog.logger, using POST.
app.post('*.logger', isLoggedIn, function (req, res) {
    //var logger = JL('client');
    //clientLogger.info(req.body);
    console.dir(req.body);
    console.dir(req.body.lg);
    var clientLog = req.body.lg;
    for(var i in clientLog) {
        var line = clientLog[i];
        winston.loggers.get(req.user.sessionId).info(line.t+": " + line.m);
    }
    // Send empty response. This is ok, because client side jsnlog does not use response from server.
    res.send('');
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


