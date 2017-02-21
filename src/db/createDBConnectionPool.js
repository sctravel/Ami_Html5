var mysql=require('mysql');
var config = require('config');
//parameters for connecting to DB
var dbOptions = config.get('dbOptions');
const util = require('util')
dbOptions.password = process.env.MYSQL_PASS
var pool = mysql.createPool({
    host     : dbOptions.host,
    user     : dbOptions.user,
    password :  dbOptions.password,
    database : dbOptions.database,
    waitForConnections : false
});

//exports.connection = mysql.createConnection(dbOptions);


/**
 *
 * @param sql: the sql to run
 * @param params: the values of the parameters in sql
 * @param callback: callback function to deal with the result
 */
function runQueryWithParams(sql, params, callback) {
    console.log("start runQueryWithParams");

    pool.getConnection(function(err,conn){
        if(err){
            logger.error("Get connection from pool failed in runQueryWithParams." + err);
            callback(err,null);
            return;
        }
        conn.query(sql, params, function(err,results){
            if(err){
                logger.error("Error in runQueryWithParams with SQL: "+sql+" and params: "+params + "; " + err);
                conn.release();
                callback(err,null);
                return;
            }
            conn.release();
            callback(null,results);
        })
    })
}

/**
 *
 * @param sql: the sql to run
 * @param callback: callback function to deal with the result
 */
function runQuery(sql, callback) {
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
            conn.release();
            callback(null,results);
        })
    })
}

module.exports = {
    runQueryWithParams : runQueryWithParams,
    runQuery : runQuery
}