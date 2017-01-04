/**
 * Created by xitu on 1/3/2017.
 */

///////////////////////////////////////////////////////////////////////////
// Log4js configuration
///////////////////////////////////////////////////////////////////////////
module.exports = function(app) {
    var log4js = require('log4js');
    log4js.configure({
        appenders: [
            {type: 'console'}, //控制台输出
            {
                type: 'file', //文件输出
                filename: 'logs/access.log',
                maxLogSize: 1024 * 1024 * 100, //100MB
                backups: 3,
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
        app.use(log4js.connectLogger(logger, {level: log4js.levels.DEBUG, format: ':method :url'}));
    } else {
        logger.setLevel('INFO');
        app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO, format: ':method :url'}));
    }
    return logger;
}