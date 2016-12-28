/**
 * Created by xitu on 12/27/2016.
 */
module.exports = function(app) {
    this.name = 'userLoginRoute';
    var constants = require('../src/common/constants');
    var stringUtil = require('../src/common/stringUtil');
    var isLoggedIn = require('../app').isLoggedIn;
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var logger = require('../app').logger;
    var config = require('config');
    var userLogin = require('../src/user/userLogin');
    logger.info("#########app env: "+app.get('env')+". ##############");
    ///////////////////////////////////////////////////////////////////////
    // Passport - Login methods setup
    ///////////////////////////////////////////////////////////////////////
    passport.use('user', new LocalStrategy(
        function ( username, password, done) {

            userLogin.manualLogin(username, password, function(error,results){
                if(error) {
                    return done(null, false, { message: 'Login Error. Please try again' });
                }
                if(results.isAuthenticated == true ) {
                    logger.debug(results);
                    return done(null, {email:results.email, userId : results.userId, sessionId: results.sessionId} );
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


    app.post('/services/login/signin',
        passport.authenticate('user',
            { failureRedirect: '/audio', failureFlash: true }
        ),
        function(req,res){
            logger.info(req.body);
            logger.info("sign-in request");
            res.redirect("/interview");
        }
    );

};
