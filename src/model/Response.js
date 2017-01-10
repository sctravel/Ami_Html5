/**
 * Created by xitu on 1/1/2017.
 */


var Response = function (itemResponse, sessionId) {
    switch (itemResponse.item.type) {
        case 2000:
            return new MicrophoneCheckResponse(itemResponse, sessionId);
        case 2062:
            return new NameTheFacesResponse(itemResponse, sessionId);
        default:
            return new AudioResponse(itemResponse, sessionId);
    }
}

Response.prototype.addItemResponseToSession = function(){};


module.exports = Response;