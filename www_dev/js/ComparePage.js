
var currentPos = 0;
$(document).ready(function () {    

    adjustScreen();

    $('.compare-table').on('click', function () {
        adjustScreen();
    });

    $('#next').on('click', function () {
        compareMoveRight();
    });

    $('#prev').on('click', function () {
        compareMoveLeft();
    });
	
	//Hiding the login button and footer in compare credit card visitor page for OO product switch mobile app
	
	var compareCreditQueryString = location.search;
	var compareCreditUrlParams = new URLSearchParams(compareCreditQueryString);
	var appType = compareCreditUrlParams.get("appType"); 
       
	var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
	var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
	if(isiDevice && appType==='mobileapp') {
		$('.ING-header').hide();
		$('.ING-footer').hide();
	}
	if(isAndroid && appType==='mobileapp') {
		$('.ING-header').hide();
		$('.ING-footer').hide();
	}

});


var maxPage = NumberOfProduct - 2; //displaying 2 product at a time

function compareMoveRight() {
    currentPos += 1;
    adjustTable();
    
    if (currentPos == maxPage) {
        $('#next').addClass('hide');
    }
    if (currentPos - 2 < 0) {
        $('#prev').removeClass('hide');
    }
}

function compareMoveLeft() {
    currentPos -= 1;
    adjustTable();
    
    if (currentPos == 0) {
        $('#prev').addClass('hide');
    }

    if (currentPos < maxPage) {
        $('#next').removeClass('hide');
    }
}

function adjustTable() {
    var cellWidth = getCellWidth();

    if (currentPos < 0)
        currentPos = 0;
    
    if (currentPos > maxPage)
        currentPos = maxPage;
    
    $('.compare-table .table-row').stop().animate({ 'left': "-" + (cellWidth * currentPos) + "px" }, 400);
    
    //console.log('move left: ' + currentPos + '==' + 0);
    
    

}

function adjustScreen() {
    
    if (mediaQuery == media_xs) {
        $('.compare-table .compareWidth .table-row').css('width', (NumberOfProduct * 50) + '%');
        var winWidth = getRowWidth();
        $('.bx-wrapper.compare').css('top', $(this).scrollTop() + ($(window).height() / 2) + 'px');
        
        $('.ING-body .compareSideBySide-module .table-cell').css('width', ((winWidth) / NumberOfProduct) + 'px');
    }

    if (mediaQuery == media_sm || mediaQuery == media_md || mediaQuery == media_lg) {
        var winWidth = $('.content-container').parent().width();
     
        $('.compare-table .compareWidth .table-row').css('width', winWidth + "px");
        //console.log($('.content-container').parent().width());
        
        $('.bx-wrapper.compare').css('top', $(this).scrollTop() + ($(window).height() / 2) + 'px');
        $('.ING-body .compareSideBySide-module .table-cell').css('width', (winWidth / NumberOfProduct) - 20 + 'px');
    }

    if (mediaQuery != media_xs) {
        $('.stickToTop').css('top', 'inherit');
        $('.stickToTop').css('position', 'relative');
        hasSticked = false;
    }
    adjustTable();
}

function getRowWidth() {
    return $('.compare-table .compareWidth .table-row')[0].getBoundingClientRect().width;
}

function getCellWidth() {
    var cell = $('.compare-table .compareSideBySide-module .table-row  .table-cell');
    return $(cell)[0].getBoundingClientRect().width;
}

$(window).resize(function () {
    adjustScreen();
});

var hasSticked = false;
$(window).scroll(function (e) {

    if ($('.ING-body').height() <= 3000) {
        if (!isElementInViewportFromTop($('footer')[0])) {
            $('#prev, #next').addClass('hide');
        }
        else if (isElementInViewport($('.breakControls')[0])) {
            $('#prev, #next').addClass('hide');
        }
        else {
            $('#prev, #next').removeClass('hide');

            if (currentPos == maxPage) {
                $('#prev').removeClass('hide');
                $('#next').addClass('hide');
            }
            if (currentPos == 0) {
                $('#prev').addClass('hide');
                $('#next').removeClass('hide');
            }

        }
    }
    else {
        if (isElementInViewport($('.breakControls')[0])) {
            $('#prev, #next').addClass('hide');
        }
        else if ($(this).scrollTop() < 300) {
            $('#prev, #next').addClass('hide');
        }
        else {
            $('#prev, #next').removeClass('hide');

            if (currentPos == maxPage) {
                $('#prev').removeClass('hide');
                $('#next').addClass('hide');
            }
            if (currentPos == 0) {
                $('#prev').addClass('hide');
                $('#next').removeClass('hide');
            }

        }
    }

    if (mediaQuery == media_xs) {
        var top = $(this).scrollTop() + ($(window).height() / 2);
        $('.box').css('top', top + 'px');
        $('.bx-wrapper.compare').css('top', $(this).scrollTop() + ($(window).height()/2) + 'px');
        if (hasSticked)   {
            if ($('.ING-body').height() <= 3000) {
                if ($(this).scrollTop() < 200) {
                    $('.stickToTop').css('top', 'inherit');
                    $('.stickToTop').css('position', 'relative');
                    hasSticked = false;
                } else {
                    hasSticked = true;
                    $('.stickToTop').css('background', 'white');
                    $('.stickToTop').css('position', 'absolute');
                    $('.stickToTop').css('top', ($(this).scrollTop() - $('.compareWidth').offset().top) + 'px');
                }
            }
            else {
                if ($(this).scrollTop() < 550) {
                    $('.stickToTop').css('top', 'inherit');
                    $('.stickToTop').css('position', 'relative');
                    hasSticked = false;
                } else {
                    hasSticked = true;
                    $('.stickToTop').css('background', 'white');
                    $('.stickToTop').css('position', 'absolute');
                    $('.stickToTop').css('top', ($(this).scrollTop() - $('.compareWidth').offset().top) + 'px');
                }
            }

        } else if (!isElementInViewport($('.stickToTop')[0])) {
            hasSticked = true;
            $('.stickToTop').css('background', 'white');
            $('.stickToTop').css('position', 'absolute');
            $('.stickToTop').css('top', ($(this).scrollTop() - $('.compareWidth').offset().top) + 'px');
        } 
    } else {
        $('.stickToTop').css('top', 'inherit');
        $('.stickToTop').css('position', 'relative');
        hasSticked = false;
    }

});
			
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
			
function isElementInViewportFromTop(el) {
    var rect = el.getBoundingClientRect();
    return rect.top >= (window.innerHeight * 0.3);
}