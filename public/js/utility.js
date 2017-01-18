/**
 * Created by xitu on 1/17/2017.
 */
var padLeft = function(word, pad) {
    return pad.substring(0, pad.length - word.length) + word;
}

var toUTCDateTimeString = function(date) {
    //Example: 2017-01-02 15:30:55.752 +0000
    var hour = date.getUTCHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getUTCMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getUTCSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getUTCFullYear();

    var month = date.getUTCMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getUTCDate();
    day = (day < 10 ? "0" : "") + day;

    var milliSec = padLeft(date.getUTCMilliseconds()+'', '000');

    return date.getFullYear()+"-"+month+"-"+day+" "+hour+":"+min+":"+sec+"."+milliSec+" +0000";
}

