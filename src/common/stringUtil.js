/**
 * Created by xitu on 12/27/2016.
 */
exports.getDelimitedStringFromArray = function(array, delimiter) {

    if(array ==null || array.length==0) return null;

    var string = "";
    for(var i in array) {
        string = string + array[i] + delimiter;
    }
    //delete the last char (delimiter)
    string = string.slice(0, -1);

    return string;

}

/**
 *
 * @param string: the string to be repeated
 * @param delimiter: the delimiter between the repeated strings
 * @param num: number of times of repeatition
 * @returns the num times repeated string with delimiter
 */
exports.getDelimitedRepeatString = function(string, delimiter, num) {

    if(num<=0) {
        console.log("Number of repeated times: "+num+" is less than 1");
        return null;
    }
    var value = "";

    for(var i=0; i<num; ++i) {
        value= value + string + delimiter;
    }

    value = value.slice(0, -1);

    console.log("String: "+string+"; delimiter: "+delimiter+"; num: "+num +"; value: " + value);

    return value;

}

var padLeft = function(word, pad) {
    return pad.substring(0, pad.length - word.length) + word;
}

exports.toUTCDateTimeString = function(date) {
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

exports.toDateTimeString = function(date) {

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;


    return date.getFullYear()+month+day+"-"+hour+min+sec;
}

var letters = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N',
    'O','P','Q','R','S','T','U','V','W','X','Y','Z'];

exports.generateRandomNumbers=function(length) {
    var numbers = ['0','1','2','3','4','5','6','7','8','9'];

    function f(len) {
        var confirmationNumber="";
        for(var i=0;i<len;++i) {
            var randomNumber = Math.floor( Math.random() * 10 ); //random number between 0 and 9
            confirmationNumber = confirmationNumber + numbers[randomNumber];
        }
        return confirmationNumber;
    };

    return f(length);
}

//need to check duplicate confirmation_code
/**
 * Using Closure!
 * @len the length of the random string
 **/
exports.generateRandomString=function(length) {
    var letters = ['1','2','3','4','5','6','7','8','9','0','A','B','C','D','E','F','G','H','I','J','K','L','M','N',
        'O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    function f(len) {
        var confirmationCode="";

        for(var i=0;i<len;++i) {
            var randomNumber = Math.floor( Math.random() * 36 ); //random number between 0 and 35
            confirmationCode = confirmationCode + letters[randomNumber];
        }
        return confirmationCode;
    };

    return f(length);
}

/**
 * Use time+customerId+randomNumber to be orderID
 * @param customerId
 * @returns {string}
 */
exports.generateUniqueId = function(customerId) {

    var dateTime = new Date();
    var dateString = dateTime.getTime().toString().slice(1,10);

    return dateString+customerId+letters[Math.floor(Math.random()*10)];
}