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

    BLANK_ICON_PATH :'/images/blank_icon.jpg'
}

exports.services = {
    CALLBACK_SUCCESS : 'success',
    CALLBACK_FAILED : 'failed'
}

exports.emails = {
    welcomeEmail : 'Hi, {FirstName}! <br> <br> Welcome to <a href=\"' +this.SITE_URL+'\">WillGive</a>.</br>' +
    '<b>WillGive is a great platform for you to show and give your love to the world!</b><br><br> The WillGive team.',

    findPasswordEmail : '',

    donationEmail : 'Hi, {FirstName}! <br> <br> Thanks for the donation for <a href=\"' +this.SITE_URL+'\">WillGive</a>.</br>' +
    '<b>WillGive is a great platform for you to show and give your love to the world! Your Confirmation Code is {ConfirmationCode}.Thanks again for your donation</b><br><br> The WillGive team.'

}

exports.strings = {
    ANONYMOUS : 'Anonymous'
}