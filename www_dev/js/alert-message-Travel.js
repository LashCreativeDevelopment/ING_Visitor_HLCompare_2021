
/* ING-alert-message */

var expireDay = 30;
var alertMessage = {
    version: "20200324",
    messages: [
        {
            type: "alert",
            text: "As of 18 March 2020, ING is temporarily ceasing to issue new domestic and international Travel Insurance policies based on the advice of the Australian Government not to travel overseas. Under the new national plan, the Department of Foreign Affairs Trade (DFAT) travel advice on <a target=\"_blank\" href=\"https://www.smartraveller.gov.au\">www.smartraveller.gov.au</a> for Australians has been upgraded to 'Do Not Travel' (Level 4) for for overseas travel across the entire world. Existing policies remain in effect, and our travel insurance team is ready to help. <br>We're experiencing a high volume of calls, so our wait times are longer than usual. We apologise for this and thank you for your patience. If you need to make a claim, you can save time by lodging it online <a target=\"_blank\" href=\"https://forms.claims-travel.com.au/ing/travelclaim\">here</a>. For more information please see our <a target=\"_blank\" href=\"https://www.ing.com.au/help-and-support/coronavirus-covid-19.html#ING-content-6\">FAQs</a>."
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

