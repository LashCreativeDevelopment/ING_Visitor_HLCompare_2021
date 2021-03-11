
/* ING-alert-message */

var expireDay = 60;
var alertMessage = {
    version: "20200323",
    messages: [
        {
            type: "alert",
            text: "<b>Keeping our customers in the loop</b> <br>We're here to help inform how COVID-19 and financial markets are affecting our customers' superannuation. <a target=\"_blank\" href=\"https://www.ing.com.au/superannuation/tips-hints-guides/coronavirus-covid-19.html\">Learn more</a>."
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

