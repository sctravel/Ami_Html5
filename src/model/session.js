/**
 * Created by xitu on 1/1/2017.
 */
var stringUtil = require('../common/stringUtil');

var Session = function (userId, email) {
    this.data.userId = userId;
    this.data.email = email;
    this.data.startTime = new Date();
    this.data.sessionId = stringUtil.toDateTimeString(this.data.startTime);
}

Session.prototype.data = {}


module.exports = Session;
