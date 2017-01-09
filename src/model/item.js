/**
 * Created by xitu on 1/1/2017.
 */
var Item = function (iType, i, tName, iTimeout, eTimeout, mTimeout, instrText) {
    this.itemType = iType;
    this.item = i;
    this.typeName = tName;
    this.initialTimeout = iTimeout;
    this.endTimeout = eTimeout;
    this.maxTimeout = mTimeout;
    this.instructionText = instrText;
}

Item.prototype.data = {}


module.exports = Item;
