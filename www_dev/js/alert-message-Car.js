
/* ING-alert-message */

var expireDay = 30;
var alertMessage = {
    version: "2020406",
    messages: [
        {
            type: "alert",
            text: "Our ING Insurance Contact Centre operating hours are temporarily changing due to COVID-19. Our Sales, Service & Claims teams will be available for you on 1800 456 406 from 8am-5pm Mon-Fri and 8am-2pm Sat (AEST) only. Alternatively, if you need to lodge a claim you can arrange a call back using our online form, <a target=\"_blank\" href=\"https://ing.disconline.com.au/claims/new_notif.jsp?hSty=EXIG\">click here</a>."
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

