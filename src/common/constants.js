exports.login = {
    SESSION_HOURS : 3,  // session expires in 30 minutes

    FIND_PASSWORD_VALID_MINUTES : 30, //find password link only valid for 30 minutes
    SESSION_ID_LENGTH : 8,

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

exports.strings = {
    ANONYMOUS : 'Anonymous'
}