/* ING-alert-message */

var expireDay = 30;
var alertMessage = {
    version: "20180705",
    messages: [
        {
            type: "alert",
            text: "Please note: Due to a high volume of applications, it's currently taking 4 business days to review Orange One Platinum applications."
        }
    ]
};


/* ING-alert-message functions */

var cookieName = "ING-alert-message";
if (typeof $.cookie(cookieName) === 'undefined') {
    showAlertMessage(alertMessage); 
} else {
    var oldMessage = JSON.parse($.cookie(cookieName));
    var oldVersion = parseInt(oldMessage.version, 10);
    var newVersion = parseInt(alertMessage.version, 10);
    if (newVersion > oldVersion) {
        showAlertMessage(alertMessage);
    }
}

function showAlertMessage(message) {

    var messageBox = $('<div/> </a>').addClass('ING-messagebox').attr('id', 'additional-info-box').css('display', 'none').prependTo('body');
    var container = $('<div/>').addClass('container').appendTo(messageBox);
    var list = $('<ul/>').appendTo(container);

    for (var index in message.messages) {
        var row = $('<li/>').appendTo(list);
        var rawMessage = message.messages[index].text;
        var oneMessage = $('<div/>').addClass('message').html('<span>' + rawMessage + '</span>');
        oneMessage.appendTo(row);
    }

    var closeButton = $('<div/>').addClass('close-button').appendTo(messageBox);
    closeButton.on('click', function() {

        $.cookie(cookieName, JSON.stringify(message), { expires: expireDay });

        messageBox.slideUp(function() {
            $(this).remove();
        });
    });

    messageBox.slideDown();
}

