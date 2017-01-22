exports.login = {
    SESSION_HOURS : 3,  // session expires in 30 minutes
    SESSION_ID_LENGTH : 8,

    FIND_PASSWORD_VALID_MINUTES : 30, //find password link only valid for 30 minutes

    EMAIL_REX : /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/
}

//TODO change this
exports.SITE_URL = 'https://www.amipaces.org';

exports.paths = {
    RECIPIENT_FOLDER : '/public/resources/recipients/qrCode/',
    UPLOAD_FOLDER: "C:\\uploadedFiles\\",//"~/AMIPaces/uploadedFiles/",
    BLANK_ICON_PATH :'/images/blank_icon.jpg'
}

exports.services = {
    CALLBACK_SUCCESS : 'ok',
    CALLBACK_FAILED : 'failed'
}

exports.cache = {
    TEST: "TEST",
    TEST_IDS: "TEST_IDS",
    TEST_COUNT: "TEST_COUNT",
    timeoutInMilliSeconds: 86400000 // 1 day;
}

exports.responseStatus = {
    NEXT_TOUCHED: "NEXT_TOUCHED",
    INIT_TIMEOUT: "INIT_TIMEOUT",
    END_TIMEOUT:  "END_TIMEOUT",
    MAX_TIMEOUT:  "MAX_TIMEOUT",
    DONE:         "DONE",
    UNKNOWN:      "UNKNOWN"
}

exports.itemTypes = {
    "MicrophoneAudioResponse": "MicrophoneAudioResponse",
    "AudioResponse" : "AudioResponse",
    "SubAudioResponse" : "SubAudioResponse",
    "QuickLitResponse" : "QuickLitResponse",
    "TrackTapResponse" : "TrackTapResponse",
    "Polite_Request": "Polite_Request",
    "CameraPicture" : "CameraPicture"
}

exports.itemTypeNameToType = {
    "MicrophoneAudioResponse": [2000], //2000.3
    "AudioResponse" : [2071,2040, 2070, 2067, 2044, 2074, 2100],
    "SubAudioResponse" : [2072, 2073, 2062, 2023],
    "QuickLitResponse" : [2064],
    "TrackTapResponse" : [2032],
    "Polite_Request": [],
    "CameraPicture" : []
}