
/* ING-alert-message */

var expireDay = 30;
var alertMessage = {
    version: "202012",
    messages: [
        {
            type: "alert",
            text: "<b>Australia Post delays</b>: Please note, whilst we are despatching our mail within 1 business day, we understand that our delivery partner ‘Australia Post’ is experiencing delivery delays due to a high volume of parcels in their network. At this time it is anticipated that your mail could be delayed for up to 10 business days. We are sorry for the inconvenience caused. For the most up to date information, please visit the Australia Post website <a target=\"_blank\" href=\"https://auspost.com.au/about-us/news-media/important-updates/coronavirus \">here</a>."
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

