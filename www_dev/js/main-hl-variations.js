/*
 * ING DIRECT Main JS
 */


// definition of animation duration (same as css transition duration)
var animationDuration = {
	faster: 150,
	fast: 	300,
	normal: 500,
	slow: 	800,
	slower: 1000
};


// Common variables
// ----------------------------------------------
var minTablet	= 768;
var minMiddle	= 980;
var minLarge	= 1200;

var media_xs	= 0;
var media_sm	= 1;
var media_md	= 2;
var media_lg	= 3;

var mediaQuery  = -1;		// unknown device size

var durationNormal = 500;
var durationFast = 300;

// virtual hash prefix
var hashPrefix = "ING-";

// ING sticky header variables
// ----------------------------------------------

// mobile menus
var mobileMenuButton = '#main-menu-button';
var mobileMenuWrapper = '.mobile-side-wrapper';
var mobileLoginButton = '#login-menu-button';
//var mobileSearchButton = '#search-menu-button';

// header size
var headerTopHeight = 110;
var headerBottomHeight = 60;
var headerHeight = headerTopHeight + headerBottomHeight;


// home loans interim apply form
// --------------------------------------------
homeloansinterimappy = function() {


	// show/hide inputs 
	function toggleSections( no ) {
		$('.hide'+no).hide( function(){
			$('.show'+no).show();
		});
	}

	function showModal(checked){
	    var modalArray = [];
	    for (var i = 0; i < checked.length; i++) {
            modalArray.push(checked[i].value);
	    }
		if(modalArray[0] == "1" || modalArray[0] == "11" || modalArray[0] == "13" || modalArray[0] == "19") {
			showConfirmModal('#ConfirmModal1');
		}	
		else {
			showConfirmModal('#ConfirmModal2');
		}
	}

	function showConfirmModal( id ) {
		$( id ).modal( 'show' );
	}


	function pdfSelection(checked){
		var arrayValues = [];
		for (var i=0; i < checked.length; i++) {
			arrayValues.push(checked[i].value);
		}
		switch(arrayValues.join(',')) {
			case "1,21":
			case "1,21,11":
			case "1,21,12":
			case "1,21,13":
			case "1,21,13,23":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/Variation/VariationFormA.pdf')
			break;

			case "2,3":
			case "2,4":
			case "2,5":
			case "2,3,11":
			case "2,3,12":
			case "2,3,13,23":
			case "2,4,11":
			case "2,4,12":
			case "2,4,13,23":
			case "2,5,11":
			case "2,5,12":
			case "2,5,13,23":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/Variation/VariationFormB.pdf')
			break;

			case "1,21,2,3":
			case "1,21,2,4":
			case "1,21,2,5":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/Variation/VariationFormC.pdf')
			break;

			case "6,7":
			case "6,8":
			case "6,9":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/Variation/VariationFormD.pdf')
			break;
			
			case "2,3,6,7":
			case "2,3,6,8":
			case "2,3,6,9":
			case "2,4,6,7":
			case "2,4,6,8":
			case "2,4,6,9":
			case "2,5,6,7":
			case "2,5,6,8":
			case "2,5,6,9":
			case "6,7,11":
			case "6,7,12":
			case "6,7,11,12":
			case "6,7,13,23":
			case "6,8,11":
			case "6,8,12":
			case "6,8,11,12":
			case "6,8,13,23":
			case "6,9,11":
			case "6,9,12":
			case "6,9,11,12":
			case "6,9,13,23":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/Variation/VariationFormE.pdf')
			break;

			case "1,21,6,7":
			case "1,21,6,8":
			case "1,21,6,9":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/Variation/VariationFormF.pdf')
			break;

			case "11":
			case "12":
			case "11,13,23":
			case "12,13,23":
			$('#pdfLink').attr('href', '/assets/pdf/INGD%20IM263_0315.pdf')
			break;

			case "19":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/PrincipleReductionForm.pdf')
			break;

			case "13,23":
			$('#pdfLink').attr('href', '/pdf/HomeLoans/Variation/VariationFormG.pdf')
			
		}
	} 



    //collect all checked checkboxes
	function getCheckedBoxes(input) {
	    var checkboxes = document.getElementsByTagName("input");
	    var checkboxesChecked = [];
	    //loop over checkboxes
	    for (var i = 0; i < checkboxes.length; i++) {
	        if (checkboxes[i].checked) {
	            checkboxesChecked.push(checkboxes[i]);
	        }
	    }
	    return checkboxesChecked;
	}

	//show radio buttons on selection of valid checkboxes
	function extraOptions(no) {
	    var checkbox = document.getElementById("Purpose-v" + no);
		if (checkbox.checked){
		    $('.nest' + no).show();
		}
		
		else {
		    $('.nest' + no).hide();
		}
	}

	var variationFormControl = function() {
	    $('#SubmitButton').on('click', function() {
	        checked = getCheckedBoxes("inputs");
	        console.log(checked);
			showModal(checked);
	        pdfSelection(checked);
	    });

		$( '#Purpose-v1' ).on( 'click' , function() {
			extraOptions(1);
		});

		$( '#Purpose-v2' ).on( 'click' , function() {
			extraOptions(2);
		});
		$( '#Purpose-v3' ).on( 'click' , function() {
			extraOptions(3);
		});
		$( '#Purpose-v6' ).on( 'click' , function() {
			extraOptions(6);
		});
	};


	return {
		variationFormControl: variationFormControl,
	}

}();



// ING MAIN
// ----------------------------------------------
$( document ).ready( function () {
	OSDetect();

	initializeComponents();

	$(window).trigger('resize');
	$(window).trigger('scroll');

	$('.showForm').on('click', function(e) {
		console.log("clicked");
		e.preventDefault();
		if ($('.selectorForm').is(':visible')) {
			$('.selectorForm').slideUp(200, function (){
				$('html,body').animate({scrollTop: 0});
				$('.formContent').slideDown(200)
				}).empty();
		}
	});
	$('input[id=Purpose-v1]').change(function(){
		var radios = document.querySelectorAll("[id^='Purpose-v1']")

		if($(this).is(':checked'))
		{
			radios[1].checked = true;
		}
		else
		{
			for (var i = 1; i < radios.length; i++) {
				radios[i].checked = false;
			}
		}    

	});

	$('input[id=Purpose-v2]').change(function(){

		var radios = document.querySelectorAll("[id^='Purpose-v2']")

		if($(this).is(':checked'))
		{
			radios[1].checked= true;
		}
		else
		{
			for (var i = 1; i < radios.length; i++) {
				radios[i].checked = false;
			}
		}    

});

	$('input[id=Purpose-v3]').change(function(){

	var radios = document.querySelectorAll("[id^='Purpose-v3']")

    if($(this).is(':checked'))
    {
        radios[1].checked= true;
    }
    else
    {
        for (var i = 1; i < radios.length; i++) {
				radios[i].checked = false;
			}
    }    

});
	$('input[id=Purpose-v6]').change(function(){

	var radios = document.querySelectorAll("[id^='Purpose-v6']")

    if($(this).is(':checked'))
    {
        radios[1].checked= true;
    }
    else
    {
        for (var i = 1; i < radios.length; i++) {
				radios[i].checked = false;
			}
    }    

});
	$('input[type=checkbox]').change(function(){
		if($('input[id=Purpose-v1]').is(':checked') || $('input[id=Purpose-v2]').is(':checked') || $('input[id=Purpose-v3]').is(':checked')|| $('input[id=Purpose-v4]').is(':checked')|| $('input[id=Purpose-v5]').is(':checked') || $('input[id=Purpose-v6]').is(':checked') || $('input[id=Purpose-v7]').is(':checked') || $('input[id=Purpose-v8]').is(':checked'))
		{
			$("#SubmitButton").removeClass("disabled");
		}
		else {
			$("#SubmitButton").addClass("disabled");	
		}  

		if($('input[id=Purpose-v1b]').is(':checked')) {
			if ($('input[id=Purpose-v2]').is(':checked') || $('input[id=Purpose-v3]').is(':checked')|| $('input[id=Purpose-v4]').is(':checked')|| $('input[id=Purpose-v5]').is(':checked') || $('input[id=Purpose-v7]').is(':checked')) {
				if ($('input[id=Purpose-v8]').is(':checked')) {
					callUs();
				}
				else {
					proceedToForm();	
				}
			}
			else if ($('input[id=Purpose-v6a]').is(':checked')) {
				proceedToForm();		
			}
			else {
				callUs();
			}
		}
		else if ($('input[id=Purpose-v8]').is(':checked')){       
			callUs();
		}
		else if (!$('input[id=Purpose-v8]').is(':checked')) {
			proceedToForm();
		}

		if (!$('input[id=Purpose-v1b]').is(':checked') && $('input[id=Purpose-v6]').is(':checked') && !$('input[id=Purpose-v6a]').is(':checked')) {
			if ($('input[id=Purpose-v1]').is(':checked') || $('input[id=Purpose-v2]').is(':checked') || $('input[id=Purpose-v3]').is(':checked')|| $('input[id=Purpose-v4]').is(':checked')|| $('input[id=Purpose-v5]').is(':checked') || $('input[id=Purpose-v7]').is(':checked') || $('input[id=Purpose-v8]').is(':checked')) {
				proceedToForm();
			}
			else {
				callUs();
			}
		}
		
	});

$('input[type=radio]').change(function() {
		if($('input[id=Purpose-v1a]').is(':checked')) {
			if (!$('input[id=Purpose-v8]').is(':checked')) {
				if ($('input[id=Purpose-v6a]').is(':checked')) {
					proceedToForm();
				}
				else {
					proceedToForm();
				}
			}
			else if ($('input[id=Purpose-v8]').is(':checked')){
				callUs();
			}
		}

		if ($('input[id=Purpose-v1b]').is(':checked')){
				if ($('input[id=Purpose-v2]').is(':checked') || $('input[id=Purpose-v3]').is(':checked')|| $('input[id=Purpose-v4]').is(':checked')|| $('input[id=Purpose-v5]').is(':checked') ||  $('input[id=Purpose-v7]').is(':checked') || $('input[id=Purpose-v6a]').is(':checked')) {
					if ($('input[id=Purpose-v6]').is(':checked') && !$('input[id=Purpose-v6a]').is(':checked')){
						proceedToForm();
					}
					else {
						proceedToForm();
					}
				}
				else {
					callUs();
				}  
				
			}

		else if($('input[id=Purpose-v6]').is(':checked') && !$('input[id=Purpose-v6a]').is(':checked')) {
				if ($('input[id=Purpose-v1]').is(':checked') || $('input[id=Purpose-v2]').is(':checked') || $('input[id=Purpose-v3]').is(':checked')|| $('input[id=Purpose-v4]').is(':checked')|| $('input[id=Purpose-v5]').is(':checked') || $('input[id=Purpose-v7]').is(':checked') || $('input[id=Purpose-v8]').is(':checked')) {
					if ($('input[id=Purpose-v1b]').is(':checked')){
						callUs();
					}
					else {
						proceedToForm();
					}
				}
				else {
					callUs();
				}
		}
		else if ($('input[id=Purpose-v6a]').is(':checked'))	{
				proceedToForm();
		}
		
		if ($('input[id=Purpose-v8]').is(':checked')){       
			callUs();
		}	
	});





	$('[data-toggle="popover"]').popover({
		html: true,
		template: '<div class="popover small"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
		placement: 'auto bottom'
	});

	$('[data-toggle="popover"]').hover(function() {
		$(this).popover({
				html: true,
		        template: '<div class="popover small"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'

			}).popover('show');
		}, function () {
			$('[data-toggle="popover"]').popover('hide');
		});

	homeloansinterimappy.variationFormControl();
});


$(window).resize(function (e) {
	refreshResponsiveComponents(e);
});


function callUs() {
	$("#SubmitButton").fadeOut(animationDuration.fast, function() {
		$("#FrmSectionMsg").fadeIn();
	});
}

function proceedToForm() {
	$("#FrmSectionMsg").fadeOut(animationDuration.fast, function() {
		$("#SubmitButton").fadeIn();
	});

}


// Setup Methods
// ----------------------------------------------
function initializeComponents() {
	$("a[href$='#']").click(function () {
	    return false;
	});

	// mobile header
	initializeMobileMenuButtons();

	// DEBUG
	if (checkDEBUG()) {
		initializeSizeMonitor();
	}
}

function refreshResponsiveComponents(e) {
	if (changedMediaQuery() === true) {
		// mobile header 
		refreshMobileMenuButtons();
	}

	// DEBUG
	if(checkDEBUG()) {
		refreshSizeMonitor();
	}
}


// Hash Info Controller
// ----------------------------------------------
function adjustPagePosition() {
	var prefix = hashPrefix;
	var hashTarget = window.location.hash;
	var realTarget = hashTarget.replace(prefix, '');

	if (hashTarget.length > 1 && $(realTarget).size() === 1) {

		// Case: mobile
		if (mediaQuery === media_xs) {
			// footer
			if (realTarget === '#more-about' ||
				realTarget === '#important-information' ||
				realTarget === '#generic-footer') {
				window.scrollTo(0, $(realTarget).offset().top);
			}
			// content tab or index.html menu tabs
			else if (realTarget.indexOf('content') > -1 ||

				realTarget.indexOf('home-quicklinks') > -1 ||
				realTarget.indexOf('home-everyday') > -1 ||
				realTarget.indexOf('home-savings') > -1 ||
				realTarget.indexOf('home-homeloans') > -1 ||
				realTarget.indexOf('home-super') > -1 ||
				realTarget.indexOf('home-business') > -1 

				) {
				var mobileTab = $('.mobile-tab[data-target="' + realTarget + '"]');
				mobileTab.addClass('active');
				$(realTarget).css('display', 'block');
				window.scrollTo(0, mobileTab.offset().top);
			}
			// else (ex: help and support pages)
			else {
				var offset = $(realTarget).offset().top;
				$('body, html').scrollTop(offset);
			}
		}

		// Case: desktop
		else {
			// content tab
			if (realTarget.indexOf('content') > -1) {
				// only check tab content
				var tabHeader = '.ING-tab-header .tab-list > li > a[href="' + hashTarget + '"]';
	//			console.log("tab-header: " + tabHeader);
				$(tabHeader).trigger('click');
			}
			// footer, else
			else {
				var offset = $(realTarget).offset().top - headerBottomHeight;
				$('body, html').scrollTop(offset);
			}
		}

	}	
}


function getContentId(anchor) {

	// case: tab contents
	var tabContent = $(anchor).parents('.ING-tab-body article .ING-content');
	if (tabContent.length !== 0 &&
		tabContent.attr('id') !== 'undefined') {
		return tabContent.attr('id');
	}

	// case: footer contents 
	var moreAbout = $(anchor).parents('#more-about');
	var importantInfo = $(anchor).parents('#important-information');
	var genericFooter = $(anchor).parents('#generic-footer');
	if (moreAbout.length !== 0) {
		return moreAbout.attr('id');
	} else if (importantInfo.length !== 0) {
		return importantInfo.attr('id');
	} else if (genericFooter.length !== 0) {
		return genericFooter.attr('id');
	}

	// case: exceptional content
	// nothing yet...
	return null;
}





// Mobile Menus
// ----------------------------------------------
function initializeMobileMenuButtons () {
	// menu button
	$(mobileMenuButton).on('click', function(event) {
		event.preventDefault();
		if (mediaQuery === media_xs) {
			if ($(this).hasClass('selected') === false) {
				$(this).addClass('selected');
				$(mobileMenuWrapper).addClass('active');
			} else {
				$(this).removeClass('selected');
				$(mobileMenuWrapper).removeClass('active');
			}
		}
	});
}

function refreshMobileMenuButtons() {
	if (mediaQuery === media_xs) {
		// menu button
		$(mobileMenuButton).removeClass('selected');
		$(mobileMenuWrapper).removeClass('active');
	}
}



// Mobile Content Tabs
// ----------------------------------------------
var mobileContentTab = '.mobile-tab';
function initializeMobileContentTabs() {

	$(mobileContentTab).on('click', function(event) {
		event.preventDefault();

		var target = $(this).data('target');
		var thisObject = $(this).get(0);
		if ($(this).hasClass('active') === false) {
			$(this).addClass('active');
			$(target).slideDown(durationFast, function() {
				// check if info slider exists in the tab and if exits, reload the slider
				if( $(target).find('#infos-slider').length ) {
					refreshInfosSlider();
				}
			});
		}
		else {
			$(this).removeClass('active');
			$(target).slideUp(durationFast);
		}
	});
}



// Open Modal Popup
$('a[data-toggle="popup-window"]').on('click', function(event) {
	event.preventDefault();

	var width = 600;
	var height = 600;
	if ($(this).data('size') === 'large') {
		width = 900;
		height = 800;
	}
	else if ($(this).data('size') === 'call') {
	    width = 285;
	    height = 385;
	}
	var left = (screen.width/2)-(width/2);
	var top = (screen.height/2)-(height/2);
	var url = $(this).attr("href");
	var title = 'popup';
	var option = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + width + ', height=' + height;
	//alert(option);

	window.open(url, title, option);
});

$('a[data-toggle="new-tab-page"]').on('click', function(event) {
	event.preventDefault();

	var url = $(this).attr("href");
	var win = window.open(url, '_blank');
	win.focus();
});
// Help Methods
// ----------------------------------------------
function changedMediaQuery() {
	var width = $(window).width();
	var media;
	
	if (width < minTablet) {
		media = media_xs;
	}
	else if (width < minMiddle) {
		media = media_sm;
	}
	else if (width < minLarge) {
		media = media_md;
	}
	else {
		media = media_lg;
	}

	if (media !== mediaQuery) {
		mediaQuery = media;
		return true;
	}
	return false;
}


function checkCssTransitions() {
	return $('html').hasClass('csstransitions');
}

function checkDEBUG() {
	return $('html').hasClass('DEBUG');
}

// http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function checkTouch() {
	//alert('modernizr: ' + Modernizr.touch);
	//alert('ontouchstart: ' + ('ontouchstart' in window));
	//alert('msMaxTouchPoints: ' + (navigator.msMaxTouchPoints > 0));
	return Modernizr.touch || 'ontouchstart' in window || (navigator.msMaxTouchPoints > 0);
}

// http://stackoverflow.com/questions/13478303/correct-way-to-use-modernizr-to-detect-ie
var BrowserDetect = 
{
    init: function () 
    {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    },

    searchString: function (data) 
    {
        for (var i=0 ; i < data.length ; i++)   
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) !== -1)
            {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) 
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
			return;
        }
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },

    dataBrowser: 
    [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
    ]
};
BrowserDetect.init();

// http://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript
var OSName = "Unknown OS";
function OSDetect () {
	if (navigator.appVersion.indexOf("Win") !== -1) {
		OSName = "Windows";
	} else if (navigator.appVersion.indexOf("Mac") !== -1) {
		OSName = "MacOS";	
	} else if (navigator.appVersion.indexOf("X11") !== -1) {
		OSName = "UNIX";
	} else if (navigator.appVersion.indexOf("Linux") !== -1) {
		OSName = "Linux";
	}
}

// DEBUG - Size Monitor
// ----------------------------------------------
function initializeSizeMonitor() {
	var sizeMonitor = $('<div class="size-monitor"/>')
		.append('<p id="debug_browser-width">width: 0px</p>')
		.append('<p id="debug_browser-height">height: 0px</p>')
		.append('<p class="visible-xs">[Mobile]</p>')
		.append('<p class="visible-sm">[Tablet]</p>')
		.append('<p class="visible-md">[Desktop]</p>')
		.append('<p class="visible-lg">[Large Desktop]</p>');
	sizeMonitor.prependTo('body');
}

function refreshSizeMonitor() {
	$('#debug_browser-width').text('width: ' + $(document).width() + 'px');
	$('#debug_browser-height').text('height: ' + $(document).height() + 'px');
}

