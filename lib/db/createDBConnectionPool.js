var mysql=require('mysql');
var config = require('config');

//parameters for connecting to DB
config.dbOptions.password = process.env.MYSQL_PASS
var dbOptions = config.get('dbOptions');

const util = require('util')

dbOptions.password = process.env.MYSQL_PASS
console.dir("dbOptions.password:"+ dbOptions.password)
console.log(util.inspect(dbOptions, {showHidden: false, depth: null}))

var pool = mysql.createPool({
    host     : dbOptions.host,
    user     : dbOptions.user,
    password :  process.env.MYSQL_PASS,
    database : dbOptions.database
});

exports.connection = mysql.createConnection(dbOptions);


/**
 *
 * @param sql: the sql to run
 * @param params: the values of the parameters in sql
 * @param callback: callback function to deal with the result
 */
exports.runQueryWithParams = function(sql, params, callback) {
    var logger = require('../../app').logger;

    pool.getConnection(function(err,conn){
        if(err){
            logger.error("Get connection from pool failed in runQueryWithParams.");
            callback(err,null);
            return;
        }
        conn.query(sql, params, function(err,results){
            if(err){
                logger.error("Error in runQueryWithParams with SQL: "+sql+" and params: "+params);
                conn.release();
                callback(err,null);
                return;
            }
            callback(null,results);
            conn.release();
        })
    })
}

/**
 *
 * @param sql: the sql to run
 * @param callback: callback function to deal with the result
 */
exports.runQuery = function(sql, callback) {
    var logger = require('../../app').logger;

    pool.getConnection(function(err,conn){
        if(err){
            logger.error("Get connection from pool failed in runQuery.");
            callback(err,null);
            return;
        }
        conn.query(sql, function(err,results){
            if(err){
                logger.error(sql+" failed \n" +err);//throw err;}
                conn.release();
                callback(err,null);
                return;
            }
            callback(null,results);
            conn.release();
        })
     })
 }