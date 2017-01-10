/**
 * Created by xitu on 12/27/2016.
 */
module.exports = function(app) {
    this.name = 'userLoginRoute';
    var constants = require('../src/common/constants');
    var stringUtil = require('../src/common/stringUtil');
    var isLoggedIn = require('../app').isLoggedIn;
    var logFormatter = require('../app').logFormatter;
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var config = require('config');
    var userLogin = require('../src/login/userLogin');
    var Session = require('../src/model/Session');
    var winston = require('winston');

    ///////////////////////////////////////////////////////////////////////
    // Passport - Login methods setup
    ///////////////////////////////////////////////////////////////////////
    passport.use('user', new LocalStrategy(
        function ( username, password, done) {

            userLogin.manualLogin(username, password, function(error,results){
                if(error) {
                    return done(null, false, { message: 'Login Error. Please try again.' });
                }
                if(results.isAuthenticated == true ) {
                    //create a session dir for uploading files
                    fs.mkdir(constants.paths.UPLOAD_FOLDER+results.session.data.userId+"_"+results.session.data.sessionId+"/", function(e){});
                    return done(null, {email:results.session.data.email, userId : results.session.data.userId, sessionId: results.session.data.sessionId} );
                } else {
                    return done(null, false, { message: results.errorMessage });
                }
            });
        }
    ));

    passport.serializeUser(function (user, done) {//保存user对象
        done(null, {email:user.email, userId:user.userId, sessionId:user.sessionId});//可以通过数据库方式操作
    });

    passport.deserializeUser(function (user, done) {//删除user对象
        done(null, {email:user.email, userId:user.userId, sessionId:user.sessionId});//可以通过数据库方式操作
    });


    app.post('/api/login/signin',
        passport.authenticate('user',
            { failureRedirect: '/', failureFlash: true }
        ),
        function(req,res){
            //logger.info(req.body);
            //logger.info("sign-in request");
            winston.loggers.add(req.user.sessionId, {
                file: {
                    filename: 'logs/client/'+req.user.sessionId+'.log',
                    json: false,
                    timestamp: new Date(),
                    formatter: logFormatter
                },
            });
            res.redirect("/interview");
        }
    );


    app.post('/api/login/finish', isLoggedIn, function(req, res) {
        winston.loggers.get(req.user.sessionId).close();
        userLogin.finishSession();
        //upload zip to s3;
        req.logout();
        res.redirect("/");
    });


};
