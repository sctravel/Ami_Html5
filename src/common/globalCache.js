/**
 * Created by xitu on 1/21/2017.
 */
var testsUtil = require('../db/testsDBLoader');
var constants = require('./constants');
var _ = require('underscore');
var memoryCache = require('memory-cache');

exports.globalCache = {
    getFromCacheOrDB : function (key, fromDBFunc, callback) {
        var value = memoryCache.get(key);
        if(value!=null) {
            callback(null, value);
        } else {
            fromDBFunc(function(err, dbValue){
                if(err) {
                    logger.error("fromDBFunc() for key: " + key + "failed: " + err);
                    callback(err, null);
                    return;
                }
                memoryCache.put(key, dbValue);
                callback(null, dbValue);
            });
        }
    },

    get : function(key) {
        return memoryCache.get(key);
    },

    loadCache : function () {
        logger.info("Start loading memory cache");

        testsUtil.getTestCountFromDB(function(err, count){
            if(err) {
                logger.error("initCache failed at getTestCountFromDB: " + err);
                return;
            }
            memoryCache.put(constants.cache.TEST_COUNT, count);
        });

        testsUtil.getAllBaseTestsFromDB(function(err, tests){
            if(err) {
                logger.error("initCache failed at getAllBaseTestsFromDB: " + err);
                return;
            }
            var testIds = _.uniq(_.pluck(_.flatten(tests), "test"));//_.uniq(tests, function(test) { return test.test; });
            memoryCache.put(constants.cache.TEST_IDS, testIds);
            testIds.forEach(function(testId){
                var testItems = _.filter(tests, function(testItem) {
                    return testItem.test == testId;
                })
                memoryCache.put(testId, testItems);
                console.log("testId- " + testId);
                //console.dir(this.get(testId)[0]);
            })

        })
    },

    initCache : function() {
        var CronJob = require('cron').CronJob;
        var job = new CronJob({
            cronTime: '00 01 00 * * *', //Refresh the cache every midnight at 12:01 a.m.
            onTick: this.loadCache,
            start: false,
            timeZone: 'America/Los_Angeles'
        });
        job.start();
        this.loadCache();
    }
};
