/*
 * ING Direct Popup Links JS
 */

function NumberCount(strValue) {
    var intNumberCount = 0;
    for (var i = 0; i < strValue.length; i++) {
        var chrStub = strValue.substring(i, i + 1);
        if ((chrStub >= "0") && (chrStub <= "9"))
            intNumberCount++;
    }
    return intNumberCount;
}

var strDomain = document.domain.toString().toLowerCase();

var strProtocol;
var pos;

if (strDomain.indexOf("localhost") >= 0)
    strProtocol = "http://";
else
    strProtocol = "https://";

if (strDomain == "ingdirect.com.au") {
    pos = document.location.toString().toLowerCase().indexOf("www");
    if (pos < 0)
        strDomain = "www." + strDomain
}
var mstrSizeParams = 'width=1011,height=709';
var mstrSizeMediumParams = 'width=900,height=650';
var mstrSizeSmalMediumParams = 'width=630,height=600';
var mstrSizeSmallParams = 'width=510,height=515';
var mstrClientURL = strProtocol + strDomain + "/client/index.aspx";
var mstrClientSMURL = strProtocol + strDomain + "/client/smindex.aspx";
var mstrClientTDURL = strProtocol + strDomain + "/client/tdindex.aspx";
var mstrClientHLURL = strProtocol + strDomain + "/client/hlindex.aspx";
var mstrClientMSURL = strProtocol + strDomain + "/client/msindex.aspx";
var mstrSMURL = strProtocol + strDomain + "/oa/sm/index.aspx";
var mstrSUPERURL = strProtocol + strDomain + "/VisitorApply/Superannuation/Intro.aspx";
var mstrSUPERTABLEURL = strProtocol + strDomain + "/super_and_retirement/living_super_table.htm";
var mstrFindYourSuperURL = strProtocol + strDomain + "/super_and_retirement/calculators_and_tools/find_your_super.htm";
var mstrSAURL = strProtocol + strDomain + "/oa/sa/index.aspx";
var mstrBOURL = strProtocol + strDomain + "/oa/bo/index.aspx";
var mstrMSURL = strProtocol + strDomain + "/oa/hl/index.aspx";
var mstrOAURL = strProtocol + strDomain + "/oa/hl/index.aspx";
var mstrOEURL = strProtocol + strDomain + "/oa/oe/index.aspx";
var mstrTDURL = strProtocol + strDomain + "/oa/td/index.aspx";
var mstrBTDURL = strProtocol + strDomain + "/oa/btd/index.aspx";
var mstrClientBTDURL = strProtocol + strDomain + "/oa/btd/index.aspx";
var mstrClientBOURL = strProtocol + strDomain + "/oa/bo/index.aspx";
var mstrEmailURL = strProtocol + strDomain + "/secure/email/email.aspx";
var mstrInfoEmailURL = strProtocol + strDomain + "/secure/email/infoemail.aspx";
var mstrHLEmailURL = strProtocol + strDomain + "/secure/email/hlemail.aspx";
var mstrRequestInfoURL = strProtocol + strDomain + "/secure/index.aspx?product=";
var mstrComparisonRatesURL = strProtocol + strDomain + "/oa/hl/ComparisonRate.aspx";
var mstrRateSearchURL = "http://" + strDomain + "/applications/ratesearch.aspx?product=";
var mstrSTDTBInfoURL = "http://" + strDomain + "/TrueBlue.htm";
var mstrSTDARInfoURL = "http://" + strDomain + "/AllRound.htm";
var mstrRateToOtherBanks = "http://ingskin.au.infochoice.com.au/PL-299/ing-direct-home-loan-comparison.aspx";
var mstrEssentialGuide = strProtocol + strDomain + "/Secure/guide/essential_guide.aspx";
var mstrPreApproval = strProtocol + strDomain + "/Secure/homeloan/PAIntro.aspx";
var mstrSavingEmailForm = strProtocol + strDomain + "/Secure/forms/saving_enquiry.aspx";
var mstrClientMSURL = strProtocol + strDomain + "/oa/hl/index.aspx";
var mstrApply = "http://" + strDomain + "/home_loans/home_loan_apply.htm";
var mstrBlank = "http://" + strDomain + "/home_loans/Blank.htm";
var mstrDebtIssuanceProgram = "http://" + strDomain + "/dlDebt_Issuance_Program.htm";
var mstrSecuritisation = "http://" + strDomain + "/dlSecuritisation.htm";
var mstrCallBack = strProtocol + strDomain + "/Secure/Forms/callback.aspx";
var mstrIntelliResponseForm = strProtocol + strDomain + "/applications/IntelliResponse.aspx";
var mstrRetrieveAppURL = strProtocol + strDomain + "/oa/RtrvApp/index.aspx";
var mstrPickaDate = strProtocol + strDomain + "/OA/TD/TDPickADateExample.aspx?Type=PTD";
var mstrBusinessProfiler = "https://" + strDomain + "/OA/BusinessProfiler.htm";

function UnloadCallBackForm() {
    var if_MoreInfo_Callback = document.getElementById("if_MoreInfo_Callback");
    var hlApplyCallBack = document.getElementById("hlApplyCallBack");

    if (hlApplyCallBack.className.indexOf("apply_accordion_toggle_active") < 0 && if_MoreInfo_Callback.src.indexOf("/Blank.htm") < 0) {
        if_MoreInfo_Callback.src = mstrBlank;
    }
}

function ReloadCallBackFormInApply() {
    var if_MoreInfo_Callback = document.getElementById("if_MoreInfo_Callback");
    var hlApplyCallBack = document.getElementById("hlApplyCallBack");

    if (hlApplyCallBack.className.indexOf("apply_accordion_toggle_active") >= 0) {
        if_MoreInfo_Callback.src = mstrCallBack;
    }
    else {
        if_MoreInfo_Callback.src = mstrBlank;
    }
}

function reloadCallBackForm(objName, targetURL, secure) {
    var frameProtocol = (secure == null) ? strProtocol : secure ? "https://" : "http://";
    var frame = window.top.frames[objName];
    var div_MoreInfo_Callback = document.getElementById('div_MoreInfo_Callback');
    if (div_MoreInfo_Callback) { div_MoreInfo_Callback.style.display = "none"; }
    if (frame && frame.location) { frame.location.href = (targetURL.indexOf("http") != 0) ? frameProtocol + strDomain + targetURL : targetURL; }
    if ((objName == 'if_MoreInfo_Callback' || objName == 'if_MoreInfo_Email') && div_MoreInfo_Callback) { div_MoreInfo_Callback.style.display = "block"; }
}

function OpenSMFromClient() {
    window.open(mstrClientMSURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenEssentialGuide() {
    window.open(mstrEssentialGuide, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenPreApproval() {
    window.open(mstrPreApproval, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenSavingEmailForm() {
    window.open(mstrSavingEmailForm, "Email", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeSmallParams)
}

function OpenDebtIssuanceProgram() {
    window.open(mstrDebtIssuanceProgram, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeMediumParams)
}

function OpendlSecuritisation() {
    window.open(mstrSecuritisation, "DlSecuritisation", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeMediumParams)
}

function GotoSavingEmailForm() {
    if (window.top)
        window.top.location.href = mstrSavingEmailForm;
    else
        document.location.href = mstrSavingEmailForm;
}

function OpenRateToOtherBanks() {
    window.open(mstrRateToOtherBanks, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0,width=780,height=710")
}

function OpenClient() {
    window.open(mstrClientURL, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenNewClient() {
    setTimeout("OpenClient()", 100);
}

function BackToClient() {
    //    window.opener.OpenNewClient();
    //    window.close();
    window.location.href = mstrClientURL;
    return false;
}

function GotoClient() {
    document.location.href = mstrClientURL;
}

function OpenClientSM() {
    window.open(mstrClientSMURL, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenClientTD() {
    window.open(mstrClientTDURL, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenClientBTD() {
    window.open(mstrClientBTDURL, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0,width=1011,height=709")
}

function OpenClientBO() {
    window.open(mstrClientBOURL, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0,width=1011,height=709")
}

function OpenClientHL() {
    window.open(mstrClientHLURL, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenClientMS() {
    window.open(mstrClientMSURL, "Client", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenSM() {
    window.open(mstrSMURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenSuper() {
    window.open(mstrSUPERURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenSuperTable() {
    window.open(mstrSUPERTABLEURL, "LivingSuperTable", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenFindYourSuper() {
    window.open(mstrFindYourSuperURL, "FindYourSuper", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenSA() {
    window.open(mstrSAURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenTD() {
    window.open(mstrTDURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenBTD() {
    window.open(mstrBTDURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}
function OpenMS() {
    window.open(mstrMSURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}
function OpenOA() {
    window.open(mstrOAURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}
function OpenOE() {
    window.open(mstrOEURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenRetrieveApp() {
    window.open(mstrRetrieveAppURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenSTDTBInfo() {
    window.open(mstrSTDTBInfoURL)
}

function OpenSTDARInfo() {
    window.open(mstrSTDARInfoURL)
}

function OpenBO() {
    window.open(mstrBOURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenBTD() {
    window.open(mstrBTDURL, "Apply", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0,width=1011,height=709")
}

function OpenRequestInfo(Product) {
    window.open(mstrRequestInfoURL + Product, "InfoPack", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenHLEmail() {
    window.open(mstrHLEmailURL, "Email", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenInfoEmail() {
    window.open(mstrInfoEmailURL, "Email", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenEmail() {
    window.open(mstrEmailURL, "Email", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeParams)
}

function OpenCompRates() {
    window.open(mstrComparisonRatesURL, "ComparisonRates", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=no,resizable=no,screenX=0,screenY=0,left=0,top=0,width=500,height=590")
}

function OpenPickaDate() {
    var left = (screen.width / 2);
    var top = (screen.height / 2) - (document.body.clientHeight / 2);
    window.open(mstrPickaDate, "PickaDate", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=no,resizable=no,screenX=0,screenY=0,top=" + top + ", left=" + left + ",width=350,height=300")
}

function LoadProfiler() {
    window.open(mstrBusinessProfiler, 'BusinessProfiler', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=550,height=600');
}

function SetRateSeatchURL(FrameName, Product) {
    try {
        document.getElementById(FrameName).location.href = mstrRateSearchURL + Product;
    }
    catch (e) {
        try {
            document.getElementById(FrameName).src = mstrRateSearchURL + Product;
        }
        catch (e) {
            try {
                frames[FrameName].location.href = mstrRateSearchURL + Product;
            }
            catch (e) {
                try {
                    frames[FrameName].src = mstrRateSearchURL + Product;
                } catch (e) { }
            }
        }
    }
}

function FilterSearchInput(e) {
    var code = window.event ? e.keyCode : e.which;
    var character = String.fromCharCode(code);
    var validchars = new RegExp("[a-zA-Z0-9, \?]", "g");

    if (code == 27) { this.blur(); return false; }

    if (!window.event && code == 0) { return true; } // Check for Non IE browser and allow function keys (i.e. Tab)

    if (character.match(validchars) != null || code == 8)
        return true;
    else
        return false;
}

function SanitiseSearchInput(question) {
    var result = question;
    var validchars = new RegExp("[a-zA-Z0-9, ]", "g");
    var sanitisedQuestion = new Array();
    var questionChar;
    if (question != null && question.length > 0) {
        for (var i = 0; i < question.length; i++) {
            questionChar = question.charAt(i);
            if (questionChar.match(validchars) != null) {
                sanitisedQuestion[i] = questionChar;
            }
            else {
                sanitisedQuestion[i] = " ";
            }
        }
        result = sanitisedQuestion.join("");
    }
    return result;
}

function OpenIR(question) {
    var whitelistQuestion = question;
    if (question != null && question.length > 0) {
        whitelistQuestion = SanitiseSearchInput(question);
    }
    window.open(mstrIntelliResponseForm + '?irquestion=' + escape(whitelistQuestion), "FAQ", "toolbar=0,status=1,location=no,menubar=no,directories=no,scrollbars=yes,resizable=yes,screenX=0,screenY=0,left=0,top=0," + mstrSizeSmalMediumParams);
    return false;
}


