/**
 * Created by xitu on 1/1/2017.
 */


var Response = function (item, itemStatus, session, filename, subresponses) {
    this.item = item;
    this.session = session;
    this.filename = filename;
    this.subresponses = subresponses;
    this.itemStatus = itemStatus;
}

Response.prototype.serializeToDB = function(){};


module.exports = Response;