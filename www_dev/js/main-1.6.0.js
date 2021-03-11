/*
 * ING DIRECT Main JS
 */


// Helper for Windows Mobile Browser Size Issue
// ----------------------------------------------
// http://css-tricks.com/snippets/javascript/fix-ie-10-on-windows-phone-8-viewport/
// Fix IE 10 on Windows Phone 8 Viewport
(function() {
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(
      document.createTextNode("@-ms-viewport{width:auto!important}")
    );
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
  }
})();



// Common variables
// ----------------------------------------------
var minTablet   = 768;
var minMiddle   = 980;
var minLarge    = 1200;

var media_xs    = 0;
var media_sm    = 1;
var media_md    = 2;
var media_lg    = 3;

var mediaQuery  = -1;       // unknown device size

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
var mobileSearchButton = '#search-menu-button';

// header size
var headerTopHeight = 110;
var headerBottomHeight = 60;
var headerHeight = headerTopHeight + headerBottomHeight;

// status of sticky components
var statusStickyHeader = 'normal';
var statusStickyTabHeader = 'normal';
var stickyTabIds = [];
var isForcedScrolling = false;
var pageScrollingWeight = 1.0;

// MARK: fixed bug in firefox about megamenu initial hover issue
var allowMegaDropdownMenu = false;


// ING MAIN
// ----------------------------------------------
$(document).ready(function () {
    OSDetect();

    initializeComponents();

    $(window).trigger('resize');
    $(window).trigger('scroll');

    // page position check
    setTimeout(function() {
        adjustPagePosition();
    }, 100);
});

$(window).resize(function (e) {
    refreshResponsiveComponents(e);
});

$(window).scroll(function (e) {
    if (!$('body').hasClass('active-side-faq')) {
        updateScrollingComponents(e);
    }
});


// Setup Methods
// ----------------------------------------------
function initializeComponents() {
    $("a[href$='#']").click(function () {
        return false;
    });

    // mobile header
    initializeMobileMenuButtons();
    initializeMobileContentTabs();

    // desktop header
    initializeStickyHeader();
    initializeStickyTabHeader();

    // mega-menu
    initializeMegaMenus();

    // homepage
    initializeHomePage();

    // disclaimer style
    initializeMoreContents();

    // etc.
    initializeTabHighlighter();
    initializePopOverComponents();
    initializeTooltipComponents();

    // oe calculator
    initializeOeCalculator();

    // faq scroller
    initializeFaqScroller();

    // DEBUG
    if (checkDEBUG()) {
        initializeSizeMonitor();
    }

    // hash anchor tag
    checkAnchorTags();
}

function refreshResponsiveComponents(e) {
    if (changedMediaQuery() === true) {

        // mobile header
        refreshMobileMenuButtons();
        refreshMobileContentTabs();

        // desktop header
        refreshStickyHeader();
        refreshStickyTabHeader();

        // mega-menu
        refreshMegaMenus();

        // home page
        refreshHomePage();

        // infos slider
        refreshInfosSlider();

        // more about slider
        refreshMoreAboutSlider();

        // features slider
        refreshFeaturesSlider();

        // disclaimer style
        refreshMoreContents();

        // oe calculator
        refreshOeCalculator();
    }

    // DEBUG
    if(checkDEBUG()) {
        refreshSizeMonitor();
    }
}

function updateScrollingComponents(e) {
    if (mediaQuery >= media_sm && isForcedScrolling === false) {
        updateStickyHeader(e);
        updateStickyTabHeader(e);
        changeStickyHeaderUsingScrollUpEvent();
    }
}


// Share Buttons
// ----------------------------------------------
if (!checkTouch()) {
    $('.ING-share-button').hover(function() {
        $(this).addClass('active');
    }, function() {
        $(this).removeClass('active');
    });
}
else {
    $('.ING-share-button').on('click', function(event) {
        event.preventDefault();
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
}

function shareUrl(provider) {
    var url, cid, title;
    if (provider === 'facebook') {
        cid = '?cid=som:fac:vis:shr';
        url = 'https://www.facebook.com/sharer/sharer.php?u=' + document.URL + cid;
        title = 'ING Direct - Facebook';
    }
    else if (provider === 'twitter') {
        cid = '?cid=som:twi:vis:shr';
        url = 'https://twitter.com/intent/tweet?text=' + document.URL + cid + ' via @ING_AUST';
        title = 'ING Direct - Twitter';
    }
    else if (provider === 'googleplus') {
        cid = '?cid=som:goo:vis:shr';
        url = 'https://plus.google.com/share?url=' + document.URL + cid;
        title = 'ING Direct - Google Plus';
    }
    else if (provider === 'linkedin') {
        cid = '?cid=som:lnk:vis:shr';
        url = 'https://www.linkedin.com/cws/share?url=' + document.URL + cid;
        title = 'ING Direct - LinkedIn';
    }
    else {
        console.log('unknown sns provider: ' + provider);
        return false;
    }

    var width = 600,
    height = 600,
    left = (screen.width/2)-(width/2),
    top = (screen.height/2)-(height/2),
    option = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + width + ', height=' + height;

    window.open(url, title, option);

    return false;
}

function shareEmail() {
    var newline = escape('\n');

    var title = $('title').text();
    var url = $('meta[property="og:url"]').attr('content') + '?cid=som:eml:vis:shr';
    var description = 'Sender: Please enter a personal message to yourself or a friend.';
    description += newline + newline;
    description += 'Hi,' + newline + newline;
    description += 'I saw this and thought it might be of interest' + newline + newline;
    description += url + newline + newline;
    var content = 'mailto:?subject=' + title + ' &body=' + description;

    window.location = content;
    return false;
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
    //          console.log("tab-header: " + tabHeader);
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

function checkAnchorTags() {

    // check all anchors
    $('a').on('click', function(event) {

        if (isNormalAnchorTag(this) === true) {

            // update a hash into current location
            if (mediaQuery === media_xs) {
                var idForHash = getContentId(this);
                if (idForHash !== null) {

                    var prefix = '#' + hashPrefix;
                    var newHash = prefix + idForHash;
                    window.location.hash = newHash;

                    // hotfix(v1.2: 20140515): if browser is a Chrome in iPhone, use history because location.hash doesn't get saved properly. need extra history saving.
                    if(navigator.userAgent.match('CriOS')) {
                        //alert('CriOS');
                        window.history.pushState({}, '', window.location.href);
                    }
                }
            }

            // force reload hash url
            if ($(this).attr('href').indexOf('#') !== -1) {
                //alert($(this).attr('href'));
                var newUrl = $(this).attr('href');
                if (newUrl.indexOf('#') !== -1) {
                    newUrl = newUrl.slice(0, newUrl.indexOf('#'));
                }

                window.location = $(this).attr('href');

                // v1.4.0
                resetMegaMenus();
                refreshMegaMenus();

                if (window.location.pathname === newUrl) {
                    // v1.3.1
                    //window.location.reload();
                    adjustPagePosition();
                    return false;
                    // end
                }
            }
        }
    });
}

function isNormalAnchorTag(anchor) {

    // ING tab header list
    if ($(anchor).parents('.ING-tab-header .tab-list > li').length > 0) {
        return false;
    }

    // Special commands
    if (typeof $(anchor).attr('data-toggle') !== 'undefined') {
        return false;
    }

    // href exceptions
    var href = $(anchor).attr('href');
    var target = $(anchor).attr('target');
    if (href === '#' ||
        href.indexOf('tel:') !== -1 ||
        target === '_blank') {
        return false;
    }

    // only pass normal anchor tags
    return true;
}

function getContentId(anchor) {

    // case: tab contents
    var tabContent = $(anchor).parents('.ING-tab-body article .ING-content');
    if (tabContent.length !== 0 &&
        tabContent.attr('id') !== 'undefined') {
        return tabContent.attr('id');
    }

    // case: home page table contents
    var homeQuickLink = $(anchor).parents('#home-quicklinks');
    var homeEveryday = $(anchor).parents('#home-everyday');
    var homeSavings = $(anchor).parents('#home-savings');
    var homeLoans = $(anchor).parents('#home-homeloans');
    var homeSuper = $(anchor).parents('#home-super');
    var homeBusiness = $(anchor).parents('#home-business');
    if (homeQuickLink.length !== 0) {
        return homeQuickLink.attr('id');
    } else if (homeEveryday.length !== 0) {
        return homeEveryday.attr('id');
    } else if (homeSavings.length !== 0) {
        return homeSavings.attr('id');
    } else if (homeLoans.length !== 0) {
        return homeLoans.attr('id');
    } else if (homeSuper.length !== 0) {
        return homeSuper.attr('id');
    } else if (homeBusiness.length !== 0) {
        return homeBusiness.attr('id');
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


// Mega Dropdown Menus
// ----------------------------------------------
function initializeMegaMenus() {
    // close button
    if (checkTouch() === true) {
        $('.ING-header .mega-dropdown-container').append("<div class='close-button'></div>");
        $('.ING-header .mega-dropdown-container .close-button').on('click', function(event) {
            event.preventDefault();
            $(this).parents('.menu-cell').removeClass('active');
            $(this).parents('.menu-cell').children('.mega-dropdown-container:visible').fadeOut('fast');
            return false;
        });
    }

    // firefox and chrome hotfix
    // if ((OSName === 'Windows' && (BrowserDetect.browser === 'Firefox' || BrowserDetect.browser === 'Chrome')) ||
    //  (OSName === 'MacOS' && BrowserDetect.browser === 'Firefox')) {
    //  allowMegaDropdownMenu = false;
    // } else {
    //  allowMegaDropdownMenu = true;
    // }

    // search form
    // cleanup - has been removed from angular version
    // $('#btnAskSubmit').click(function () {
    //  OpenIR($('#txtAsk').val());
    //  return false;
    // });
    // $('#txtAsk').keydown(function (event) {
    //  // Enter key pressed
    //  if (event.keyCode === 13) {
    //      $('#btnAskSubmit').click();
    //  }
    // });

}

function refreshMegaMenus() {

    var menuCell = '.ING-header .menu-cell';

    // resetEvents
    resetMegaMenus();

    // MOBILE
    if (mediaQuery === media_xs) {
        //alert("MOBILE");
        $(menuCell + ' > a').on('click', function(event) {

            // http://stackoverflow.com/questions/10653367/how-to-check-undefined-value-in-jquery
            if (typeof $(this).data('target') === 'undefined') {
                window.location.href = $(this).attr('href');
                return;
            }

            event.preventDefault();
            if ($(this).parent().hasClass('active') === false) {
                $(this).parent().addClass('active');
                $(this).siblings('.mega-dropdown-container:hidden').slideDown('fast');

                $(this).parent().siblings().each(function(index, el) {
                    if($(el).hasClass('active') === true) {
                        $(el).removeClass('active');
                        $(el).children('.mega-dropdown-container:visible').slideUp('fast');
                    }
                });
            }
            else {
                $(this).parent().removeClass('active');
                $(this).siblings('.mega-dropdown-container:visible').slideUp('fast');
            }
        });
    }

    // TABLET
    else if (checkTouch() === true) {
        //alert("TABLET");
        $(menuCell + '> a').on('click', function(event) {
            var parent = $(this).parent();
            if (parent.hasClass('active') === true) {
                // link
                var url = parent.children('a').attr('href');
                window.location.href = url;
                return;
            }
            else {
                event.preventDefault();
                // open
                parent.addClass('active');
                parent.children('.mega-dropdown-container:hidden').fadeIn('fast');
                parent.siblings().each(function(index, el) {
                    if ($(el).hasClass('active') === true) {
                        $(el).removeClass('active');
                        $(el).children('.mega-dropdown-container:visible').fadeOut('fast');
                    }
                });
                return false; // very important!!! --> allow to connect all links
            }
        });
    }

    // DESKTOP
    else {
        //alert("DESKTOP");
        $(menuCell).hover(function(event) {
            // if (allowMegaDropdownMenu === false) {
            //  allowMegaDropdownMenu = true;
            //  return;
            // }

            //console.log('mouseover');
            event.preventDefault();
            $(this).addClass('hovered');
            var object = $(this);
            setTimeout(function() {
                if (object.hasClass('hovered') === true) {
                    object.addClass('active');
                    object.children('.mega-dropdown-container:hidden').stop().fadeIn('fast');
                }
            }, 500);
        }, function(event) {

            //console.log('mouseleave');
            event.preventDefault();
            $(this).removeClass('hovered');
            $(this).removeClass('active');
            $(this).children('.mega-dropdown-container:visible').stop().fadeOut('fast');
        });
    }
}

function resetMegaMenus() {
    var menuCell = '.ING-header .menu-cell';

    $(menuCell).unbind('click');
    $(menuCell).unbind('hover');

    $(menuCell).removeClass('active');
    $(menuCell + ' .mega-dropdown-container').css('display', 'none');
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

    // login button
    // $(mobileLoginButton).on('click', function(event) {
    // });

    // search button
    $(mobileSearchButton).on('click', function(event) {
        event.preventDefault();
        if (mediaQuery === media_xs) {
            if ($(this).hasClass('selected') === false) {
                // if ($('#mobile-search').size() < 1) {
                //  // mobile search form
                //  var searchBar = '<div id="mobile-search" class="mobile-search"><div class="container"><form action="/application/search.aspx" method="post"><div class="search-container"><input class="input-search" type="text" autocomplete="off" value="Ask us a question" id="txtAsk-m" name="Ask_IR" maxlength="60" onkeypress="return FilterSearchInput(event);" style="color: rgb(204, 204, 204);" onclick="this.style.color=\'#000\';" onfocus="if(this.value  == \'Ask us a question\') {this.value = \'\';}" onblur="if(this.value == \'\') {this.style.color=\'#ccc\';this.value = \'Ask us a question\'; }"><input class="input-button" type="image" src="/img/etc/search-glass.png" alt="Search" id="btnAskSubmit-m" name="btnAskSubmit" title="Search"></div></form></div></div>';
                //  $('.ING-header').after(searchBar);

                //  // mobile search function
                //  $('#btnAskSubmit-m').click(function () {
                //      OpenIR($('#txtAsk-m').val());
                //      return false;
                //  });
                //  $('#txtAsk-m').keydown(function (event) {
                //      // Enter key pressed
                //      if (event.keyCode === 13) {
                //          $('#btnAskSubmit-m').click();
                //      }
                //  });
                // }
                $(this).addClass('selected');
                $('.menu-buttons-container').css('border-bottom-color', '#2a2c2b');
                $('#mobile-search').slideDown('fast');
            }
            else {
                $(this).removeClass('selected');
                $('.menu-buttons-container').removeAttr('style');
                $('#mobile-search').slideUp('fast');
            }
        }
    });

    // mobile login button (hotfix - accessibility issue on login button)
    $(mobileLoginButton).on('click', function (event) {
        if (mediaQuery === media_xs) {
            event.preventDefault();
            onClickResponsiveLogin();
            return false;
        }
    });

}

function refreshMobileMenuButtons() {
    if (mediaQuery === media_xs) {
        // menu button
        $(mobileMenuButton).removeClass('selected');
        $(mobileMenuWrapper).removeClass('active');

        // login button (not need)

        // search button
        $(mobileSearchButton).removeClass('selected');
        $('#mobile-search').removeAttr('style');
    }
}


// Help Methods for header, tab header
// ----------------------------------------------
function transformStickyHeader(option) {

    // 'normal', 'sticky', 'roll-up'
    if (option === statusStickyHeader) {
        return;
    }
    else {
        statusStickyHeader = option;
    }

    if (statusStickyHeader === 'normal') {
        $('.ING-header').removeClass('sticky').removeClass('roll-up');
        $('.ING-body').css('margin-top', 0);
    }
    else if (statusStickyHeader === 'sticky') {
        $('.ING-header').addClass('sticky').removeClass('roll-up');
        $('.ING-body').css('margin-top', headerHeight + 'px');
    }
    else if (statusStickyHeader === 'roll-up') {
        $('.ING-header').addClass('sticky').addClass('roll-up');
        $('.ING-body').css('margin-top', headerHeight + 'px');

        // v1.4.0
        resetMegaMenus();
        refreshMegaMenus();
    }
    else {
        console.log('Unknown status in transformStickyHeader(): ' + statusStickyHeader);
    }
}

// 'normal', 'sticky'
function transformStickyTabHeader(option) {

    if (option === statusStickyTabHeader) {
        return;
    }
    else {
        statusStickyTabHeader = option;
    }

    if (statusStickyTabHeader === 'normal') {
        $('.ING-tab-header').removeClass('sticky');
        $('.tab-height-manager').css('padding-top', 0);
    }
    else if (statusStickyTabHeader === 'sticky') {
        $('.ING-tab-header').addClass('sticky');
        var tabHeight = $('.ING-tab-header .tabs-wrapper').height();
        $('.tab-height-manager').css('padding-top', tabHeight + 'px');
    }
    else {
        console.log('Unknown status in transformStickyTabHeader(): ' + statusStickyTabHeader);
    }
}

// control scrollspy in tab header
function adjustStickyTabList () {

    if (statusStickyTabHeader !== 'sticky') {
        $('.ING-tab-header .tab-list > li').removeClass('active');
        return;
    }

    // MARK: use 10px bumber to avoid browser bouncing negative effect
    var offsetBottom = $('.ING-tab-header .tabs-wrapper').offset().top + $('.ING-tab-header .tabs-wrapper').height();
    //console.log('offset: ' + offsetBottom);
    var activeIndex = -1;
    for (var index in stickyTabIds) {
        var contentTop = $(stickyTabIds[index]).offset().top;
        //console.log('cell[' + index + ']:' + contentTop);
        if (offsetBottom > contentTop) {
            activeIndex = index;
        }
    }
    if (activeIndex >= 0) {
        $('.ING-tab-header .tab-list > li:eq(' + activeIndex + ')')
            .addClass('active')
            .siblings().removeClass('active');
    }
    else {
        $('.ING-tab-header .tab-list > li').removeClass('active');
    }
}

// control orange bar in tab header
function adjustStickyTabOrangeBar () {

    var hasInvisible = $('.ING-tab-header .orange-bar').hasClass('invisible');
    if (statusStickyTabHeader !== 'sticky') {
        if (hasInvisible === false) {
            $('.ING-tab-header .orange-bar').addClass('invisible');
        }
        return;
    }
    else {
        if (hasInvisible === true) {
            $('.ING-tab-header .orange-bar').removeClass('invisible');
        }
    }

    if ($('.ING-tab-header .tab-list > li.active').size() === 1) {
        var index = $('.ING-tab-header .tab-list > li.active').index();
        var size = $('.ING-tab-header .tab-list > li').size();
        var leftPos = (index / size) * 100;
        $('.ING-tab-header .orange-bar').css('left', leftPos + '%');
    }
}

// control mouse wheel event
var mouseWheelPos = 0;
var isScrollUpEvent = false;
function changeStickyHeaderUsingScrollUpEvent () {

    if (statusStickyTabHeader === 'sticky') {
        var scrollTop = $(window).scrollTop();
        if (scrollTop < mouseWheelPos) {
            if (statusStickyHeader === 'roll-up') {
                transformStickyHeader('sticky');
            }
            isScrollUpEvent = true;
        }
        else {
            isScrollUpEvent = false;
        }
        mouseWheelPos = scrollTop;
    }
}

// Desktop Sticky Header
// ----------------------------------------------
function initializeStickyHeader () {

    // mini bar buttons
    $('#main-menu-button, #search-menu-button').on('click', function(event) {
        event.preventDefault();

        if (mediaQuery >= media_sm) {
            if (statusStickyHeader === 'roll-up') {
                if (BrowserDetect.browser === 'Firefox') {
                    allowMegaDropdownMenu = false;
                }
                transformStickyHeader('sticky');
            }
            else {
                console.log('Unexpected control in Sticky Header');
            }
        }
    });
}

function updateStickyHeader (e) {

//  var contentTopHeight = headerTopHeight + $('.ING-tab-header').prev('div, section, article').height();
    var infoHeight = $('#additional-info-box').height();
    var heroHeight = $('.ING-tab-header').prev('div, section, article').height();
    var titleHeight = $('.ING-tab-header .heading-wrapper').height();
    var contentTopHeight = headerTopHeight + infoHeight + heroHeight + titleHeight;


    // MARK: second condition makes to avoid to error when tab header is not in page.
    if ($(window).scrollTop() > contentTopHeight && $('.ING-tab-header').size() > 0) {
        if (isScrollUpEvent === false) {
            transformStickyHeader('roll-up');
        }
    }
    else if ($(window).scrollTop() > headerTopHeight + infoHeight) {
        transformStickyHeader('sticky');
    }
    else {
        transformStickyHeader('normal');
    }
}

function refreshStickyHeader () {

    if (mediaQuery === media_xs) {
        transformStickyHeader('normal');
    }
}


// Desktop Sticky Tab Header
// ----------------------------------------------
function initializeStickyTabHeader () {

    // save tab header max height
    stickyTabHeaderMaxHeight = $('.ING-tab-header').height();

    // save tab ids
    $('.ING-tab-header .tab-list > li').each(function(index, el) {
//      stickyTabIds[index] = $(el).children('a').attr('href');
        stickyTabIds[index] = $(el).children('a').attr('href').replace('ING-', '');
//      console.log(stickyTabIds[index]);
    });


    // add "tab-height-manager" div
    var tempDiv = $('<div/>').addClass('tab-height-manager');
    tempDiv.prependTo('.ING-body');

    // add orange bar
    var tabListCount = $('.ING-tab-header .tab-list > li').size();
    var barWidth = (1/tabListCount)*100;
    $('<div/>')
        .addClass('orange-bar')
        .addClass('invisible')
        .css('width', barWidth + '%')
        .css('left', 0)
        .appendTo('.ING-tab-header .tab-list');


    // event handlers
    $('.ING-tab-header .tab-list > li > a').on('click', function(event) {
        event.preventDefault();

        // var id = $(this).attr('href');
        var id = stickyTabIds[$(this).parent().index()];
        //console.log(id);


        // this controls the tab scroll offset
        // var offset = $(id).offset().top - $('.ING-tab-header').height() - headerMiniHeight + 1;
        // v1.3.0
        // var offset = $(id).offset().top - $('.ING-tab-header').height() - headerMiniHeight + 1 + 40;
        // v1.4.0
        // var offset = $(id).offset().top - headerBottomHeight - $('.ING-tab-header .tabs-wrapper').height() + 1 + 40;
        var offset = $(id).offset().top - headerBottomHeight - $('.ING-tab-header .tabs-wrapper').height() + 1;
        // var offset = $(id).offset().top - $('.ING-tab-header .tabs-wrapper').height() - headerBottomHeight + 5;
        if (statusStickyHeader === 'normal') {
            //offset -= headerMiniGap;
        }

        isForcedScrolling = true;
        transformStickyHeader('roll-up');
        transformStickyTabHeader('sticky');
        $(this).parent().addClass('active').siblings().removeClass('active');
        adjustStickyTabOrangeBar();

        var duration = Math.sqrt(Math.abs($(window).scrollTop() - offset)) * pageScrollingWeight * 20.0;
        $('body, html').stop().animate({scrollTop : offset}, duration, "easeOutQuint", function() {
            isForcedScrolling = false;
        });
    });
}

function updateStickyTabHeader (e) {

    // MARK: avoid to error when tab header is not in page.
    if ($('.ING-tab-header').size() === 0) {
        return;
    }

    // update sticky status
//  var contentTopHeight = headerTopHeight + $('.ING-tab-header').prev('div, section, article').height();
    var infoHeight = $('#additional-info-box').height();
    var heroHeight = $('.ING-tab-header').prev('div, section, article').height();
    var titleHeight = $('.ING-tab-header .heading-wrapper').height();
    var contentTopHeight = headerTopHeight + infoHeight + heroHeight + titleHeight;

    if ($(window).scrollTop() > contentTopHeight && $('.ING-header').hasClass('sticky')) {
        transformStickyTabHeader('sticky');
    }
    else {
        transformStickyTabHeader('normal');
    }

    // update tab list status
    adjustStickyTabList();
    adjustStickyTabOrangeBar();
}

function refreshStickyTabHeader () {

    if (mediaQuery === media_xs) {
        transformStickyTabHeader('normal');
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


/*
function initializeMobileContentTabs() {
    $(mobileContentTab).on('click', function(event) {
        event.preventDefault();

        var target = $(this).data('target');
        var thisObject = $(this).get(0);

        if ($(this).hasClass('active') === false) {

            $(mobileContentTab).each(function(index, el) {
                if ($(el).get(0) !== thisObject &&
                    $(el).hasClass('active') === true) {

                    $(el).removeClass('active');

                    $($(el).data('target')).slideUp({
                        duration: durationFast,
                        step: function(now, fx) {
                            console.log(fx.pos);
                            var offset = $(thisObject).offset().top;
                            $('body, html').scrollTop(offset);
                        }
                    });

                }
            });

            $(this).addClass('active');
            $(target).slideDown(400);
        }

    });
}
*/

function refreshMobileContentTabs() {

    if (mediaQuery === media_xs) {
        $(mobileContentTab).each(function(index, el) {
            var target = $(el).data('target');
            if ($(el).hasClass('active') === true) {
                $(target).show();
            }
            else {
                $(target).hide();
            }
        });
    }
    else {
        $(mobileContentTab).each(function(index, el) {
            var target = $(el).data('target');
            $(target).removeAttr('style');
        });
    }
}


// Home Page
// ----------------------------------------------
function initializeHomePage() {

    // people-menu
    $('.ING-people .tab-list > li').on('click', function(event) {
        event.preventDefault();
        var target = $(this).data('target');

        // check open state
        var isOpened = $('.ING-people .content-container').hasClass('active');
        // slide-down
        if (isOpened === false) {

            $(this).addClass('active');
            $(this).siblings('li').addClass('inactive');
            updatePeopleHighlighter();

            // move to top when archetype info view is been opening.
            var offset = $('#home-archetype').offset().top - headerBottomHeight;
//          isForcedScrolling = true;
            $('body, html').stop().animate({scrollTop : offset}, 400/*'2000'*/, "easeOutQuart", function() {
//              isForcedScrolling = false;

                $(target+':hidden').slideDown(400/*'800'*/, 'easeInQuint'/*durationFast*/, function() {
                    saveOpenPeopleStatus(true);
                    $(target).addClass('active').addClass('fade').addClass('in');
                    $(target).siblings().removeClass('active').removeClass('in').addClass('fade');
                    clearStyle();
                });
            });
        }
        else {
            // fade-in-out
            if ($(this).hasClass('active') === false) {

                $(this).addClass('active').removeClass('inactive');
                $(this).siblings('li.active').removeClass('active');
                $(this).siblings('li').addClass('inactive');
                updatePeopleHighlighter();

                $(target).siblings('.active').removeClass('in');
                setTimeout(function() {
                    $(target).siblings('.active').removeClass('active');
                    $(target).addClass('active');
                    setTimeout(function() {
                        $(target).addClass('in');
                    }, 0);
                }, durationFast);

            }
            // close
            else {
                $('.ING-people .tab-list > li.active').removeClass('active');
                updatePeopleHighlighter();
                $(target+":visible").slideUp(durationFast, function() {
                    clearPeopleMenuAll();
                });
            }
        }

        function clearStyle () {
            $('.ING-people .content').removeAttr('style');
        }
    });

    $('.ING-people .close-button').on('click', function(event) {
        event.preventDefault();
        $('.ING-people .tab-list > li.active').removeClass('active');
        updatePeopleHighlighter();
        $(this).parent(':visible').slideUp(durationFast, function() {
            clearPeopleMenuAll();
        });
    });
}

function refreshHomePage() {
    if (mediaQuery === media_xs) {
        clearPeopleMenuAll();
        updatePeopleHighlighter();
    }

    // fitting table-cell height
    if (mediaQuery !== media_xs) {
        $('.dynamic-table-box .table-container .table').removeAttr('style');
        var count = $('.dynamic-table-box .table-container').size();
        var column = (mediaQuery === media_sm) ? 2 : 3;
        var quotient = parseInt(count/column, 10);

        for (var i = 0; i < quotient; i++) {
            var maxHeight = 0;
            var index = 0;
            for (var j = 0; j < column; j++) {
                index = column * i + j;
                var height = $('.dynamic-table-box .table-container:eq(' + index + ') .table').height();
                if (height > maxHeight) {
                    maxHeight = height;
                }
            }
            for (j = 0; j < column; j++) {
                index = column * i + j;
                $('.dynamic-table-box .table-container:eq(' + index + ') .table')
                    .css('height', maxHeight + 'px');
            }
        }
    }
    else {
        $('.dynamic-table-box .table-container .table').css('height', 'auto');
    }

    // Home Hero Slider
    refreshHomeHeroSlider();
}

function clearPeopleMenuAll () {
    $('.ING-people .content')
        .removeClass('active')
        .removeClass('fade')
        .removeClass('in')
        .removeAttr('style');
    $('.ING-people .tab-list > li')
        .removeClass('active')
        .removeClass('inactive')
        .removeAttr('style');
    saveOpenPeopleStatus(false);
}

function saveOpenPeopleStatus(opened) {
    if (opened === true) {
        $(".ING-people .content-container").addClass('active');
    } else {
        $(".ING-people .content-container").removeClass('active');
    }
}

function updatePeopleHighlighter () {
    if ($('.ING-people .tab-list > li.active').size() > 0) {
        var index = $('.ING-people .tab-list > li.active').index();
        var percentage = index * 20;
        $('.ING-people .highlighter')
            .css('left', percentage + '%')
            .fadeIn(durationFast, function() {
                $(this).addClass('active');
            });
    }
    else {
        $('.ING-people .highlighter').fadeOut(durationFast, function() {
            $(this).removeClass('active');
        });
    }
}


// Infos Slider - DNA landing
// ----------------------------------------------
var infosSlider = null;
var infosSliderLoaded = false;

function refreshInfosSlider () {

    if ($('#infos-slider').size() !== 1) {
        return;
    }

    var width = 0, margin = 20, minSlides = 1, maxSlides = 1;

    if (infosSlider === null) {
        createInfosSlider(width, margin, minSlides, maxSlides);
    } else {
        reloadInfosSlider(width, margin, minSlides, maxSlides);
    }
}

function createInfosSlider(width, margin, minSlides, maxSlides) {
    infosSliderLoaded = false;
    infosSlider = $('#infos-slider').bxSlider({
        slideWidth: width,
        slideMargin: margin,
        minSlides: minSlides,
        maxSlides: maxSlides,
        startSlider: 0,
        nextText: '',
        prevText: '',
        adaptiveHeight: true,
        onSliderLoad: function() {
            infosSliderLoaded = true;
        }
    });
}

function reloadInfosSlider(width, margin, minSlides, maxSlides) {
    infosSliderLoaded = false;
    infosSlider.reloadSlider({
        slideWidth: width,
        slideMargin: margin,
        minSlides: minSlides,
        maxSlides: maxSlides,
        startSlider: 0,
        nextText: '',
        prevText: '',
        adaptiveHeight: true,
        onSliderLoad: function() {
            infosSliderLoaded = true;
        }
    });
}


// More About Slider
// ----------------------------------------------
var moreAboutSlider = null;
var moreAboutSliderLoaded = false;

function refreshMoreAboutSlider () {

    if ($('#more-about-slider').size() !== 1) {
        return;
    }

    var width, margin, minSlides, maxSlides;
    // remove ie8
    // if (checkIE8() === true) {
    //  width = 220; margin = 20; minSlides = 4; maxSlides = 4;
    // } else {
        if (mediaQuery === media_xs) {
            width = 0; margin = 0; minSlides = 1; maxSlides = 1;
        } else if (mediaQuery === media_sm) {
            width = 224; margin = 20; minSlides = 3; maxSlides = 3;
        } else if (mediaQuery === media_md) {
            width = 220; margin = 20; minSlides = 4; maxSlides = 4;
        } else if (mediaQuery === media_lg) {
            width = 254; margin = 30; minSlides = 4; maxSlides = 4;
        } else {
            console.log('unknown media query');
            return;
        }
    // }

    if (moreAboutSlider === null) {
        createMoreAboutSlider(width, margin, minSlides, maxSlides);
    } else {
        reloadMoreAboutSlider(width, margin, minSlides, maxSlides);
    }
}

function createMoreAboutSlider(width, margin, minSlides, maxSlides) {
    moreAboutSliderLoaded = false;
    moreAboutSlider = $('#more-about-slider').bxSlider({
        slideWidth: width,
        slideMargin: margin,
        minSlides: minSlides,
        maxSlides: maxSlides,
        startSlider: 0,
        nextText: '',
        prevText: '',
        adaptiveHeight: true,
        onSliderLoad: function() {
            moreAboutSliderLoaded = true;
        }
    });
}

function reloadMoreAboutSlider(width, margin, minSlides, maxSlides) {
    moreAboutSliderLoaded = false;
    moreAboutSlider.reloadSlider({
        slideWidth: width,
        slideMargin: margin,
        minSlides: minSlides,
        maxSlides: maxSlides,
        startSlider: 0,
        nextText: '',
        prevText: '',
        adaptiveHeight: true,
        onSliderLoad: function() {
            moreAboutSliderLoaded = true;
        }
    });
}


// Features Slider v1.3.0
var featuresSlider = null;
var featuresSliderLoaded = false;

function refreshFeaturesSlider() {
    if ($("#features-slider").size() !== 1) return;
    var e, t, n, r;
    if (mediaQuery === media_xs && featuresSlider !== null) {
        featuresSlider.destroySlider();
        featuresSlider = null;
        $("#features-slider").addClass("reset-bx-slider");
        // hiding module after loading finish
        $(".content-features-slider").removeClass('ready');
        return
    }
    if (mediaQuery === media_sm) {
        e = 224; //237.3333333333333;
        t = 20; //0
        n = 3;
        r = 3
    } else if (mediaQuery === media_md) {
        e = 220; // 235
        t = 20; //20
        n = 4;
        r = 4
    } else {
        if (mediaQuery !== media_lg) {
            console.log("unknown media query: " + mediaQuery);
            return
        }
        e = 254; // 276.5
        t = 30; //0
        n = 4;
        r = 4
    }

    if (featuresSlider === null) {
        $("#features-slider").removeClass("reset-bx-slider");
        featuresSliderLoaded = !1;
        featuresSlider = $("#features-slider").bxSlider({
            slideWidth: e,
            slideMargin: t,
            minSlides: n,
            maxSlides: r,
            startSlider: 0,
            nextText: "",
            prevText: "",
            adaptiveHeight: false,
            infiniteLoop: false,
            hideControlOnEnd: true,
            onSliderLoad: function () {
                featuresSliderLoaded = !0
                // IE8, 9 hack
                $("ul.features-slider").css('display', 'block');
                // showing module after loading finish
                $(".content-features-slider").addClass('ready');
            }
        })
    } else {
        featuresSliderLoaded = !1;
        featuresSlider.reloadSlider({
            slideWidth: e,
            slideMargin: t,
            minSlides: n,
            maxSlides: r,
            startSlider: 0,
            nextText: "",
            prevText: "",
            adaptiveHeight: false,
            infiniteLoop: false,
            hideControlOnEnd: true,
            onSliderLoad: function () {
                featuresSliderLoaded = !0
                // IE8, 9 hack
                $("ul.features-slider").css('display', 'block');
                // showing module after loading finish
                $(".content-features-slider").addClass('ready');
            }
        })
    }
}

// Atricle side sticky
// ----------------------------------------------

/*function initializeArticleside() {
    if (mediaQuery >= media_md || checkIE8() === false) {
        //$('.aside-part').css({ 'position': 'fixed', 'right': '20px' });
        var length = $('.ING-content').height();
        var bread = $('.content-hero.simple').height() + $('.front-header').height();
        var off = $('.ING-content').offset().top;

        $(window).scroll(function () {

            var scroll = $(this).scrollTop();
            var height = $('.aside-part').height() + 'px';

            if (scroll < off - bread) { //

                $('.aside-part').css({
                    'position': 'fixed',
                    'right': '20',
                    'top': off - scroll + 'px'
                });

            } else if (scroll > length - bread) { //

                $('.aside-part').css({
                    'position': 'absolute',
                    'bottom': '100px',
                    'top': 'auto'
                });

            } else {

                $('.aside-part').css({
                    'position': 'fixed',
                    'top': bread,
                    'right': '20',
                    //'height': height
                });

            }
        });
    }
}*/

// Home Hero Slider
// ----------------------------------------------
var homeHeroSlider = null;
var homeHeroSliderLoaded = false;

function refreshHomeHeroSlider () {
    // exceptional conditions
    if ($('#home-hero-slider').size() !== 1) {
        return;
    }
    // responsive condition
    // remove IE old
    //if (mediaQuery >= media_md || checkIE8() === true) {
    if (mediaQuery >= media_md) {
        if (homeHeroSlider !== null) {
            homeHeroSlider.destroySlider();
            homeHeroSlider = null;
            // reset
            $('#home-hero-slider').addClass('reset-bx-slider');
        }
        return;
    }

    if (homeHeroSlider === null) {

        // clearing reset
        $('#home-hero-slider').removeClass('reset-bx-slider');

        // create home hero slider
        homeHeroSliderLoaded = false;
        $('.ING-home-slider').css({height: '1px', overflow: 'hidden'});
        homeHeroSlider = $('#home-hero-slider').bxSlider({
            auto: true,
            onSliderLoad: function() {
                homeHeroSliderLoaded = true;
                $('.ING-home-slider').removeAttr('style');
            }
        });
    }
    else {
        // reload home hero slider
        homeHeroSliderLoaded = false;
        homeHeroSlider.reloadSlider({
            auto: true,
            onSliderLoad: function() {
                homeHeroSliderLoaded = true;
            }
        });
    }
}

/* remove this
// Accordion - Living Super
// ----------------------------------------------
var accordionLivingSuper = null;
var livingSuperSelectedIndex = 0;

function showAllLivingSuperCollapse () {
    var mobileIndex = $('#living-super-accordion li.panel.active').index();
    if (mobileIndex !== -1) {
        livingSuperSelectedIndex = mobileIndex;
    }

    $('#living-super-accordion li.panel')
        .removeClass('active')
        .find('.slide-content')
        .show();
}

function setInitialSelectedState() {
    $('#living-super-accordion li.panel:eq('+livingSuperSelectedIndex+')')
        .find('.slide-handle')
        .hide();
    $('#living-super-accordion li.panel:eq('+livingSuperSelectedIndex+')')
        .siblings()
        .find('.slide-handle')
        .show();
}

function onTriggerSlide() {
    this.children('.slide-handle')
        .fadeOut('fast')
        .end()
        .parent()
        .siblings()
        .find('.slide-handle')
        .stop(false, true)
        .fadeIn('fast');

    livingSuperSelectedIndex = this.parent().index();
}

function createLivingSuperAccordion(width, height, header, content) {

    if ($('#living-super-accordion').size() === 1) {
        showAllLivingSuperCollapse();
        accordionLivingSuper = $('#living-super-accordion').liteAccordion({
    //      easing: 'easeOutCirc',
            firstSlide: livingSuperSelectedIndex + 1,
            containerWidth: width,
            containerHeight: height,
            slideSpeed: 300,
            headerWidth: header,
            contentWidth: content,
            theme: 'living-super',
            onTriggerSlide: onTriggerSlide
        });

        setInitialSelectedState();
    }
}

function destroyLivingSuperAccordion() {
    if (accordionLivingSuper !== null) {
        $('#living-super-accordion').liteAccordion('destroy');
        accordionLivingSuper = null;
        $('#living-super-accordion li.panel .slide-handle').removeAttr('style');
    }
}

function refreshLivingSuperAccordion () {

    // exception for IE8
    if (checkIE8() === true) {
        if (accordionLivingSuper === null) {
            createLivingSuperAccordion(880, 532, 144, 592);
        }
        return;
    }

    destroyLivingSuperAccordion();

    if (mediaQuery === media_xs) {
        refreshLivingSuperCollapse();

    } else if (mediaQuery === media_sm) {
        createLivingSuperAccordion(672, 502, 102, 468);

    } else if (mediaQuery === media_md) {
        createLivingSuperAccordion(880, 532, 144, 592);

    } else if (mediaQuery === media_lg) {
        createLivingSuperAccordion(1040, 532, 156, 728);
    }
}

function refreshLivingSuperCollapse () {
    $('#living-super-accordion li.panel:eq('+livingSuperSelectedIndex+')')
        .addClass('active')
        .find('.slide-content')
        .show();
    $('#living-super-accordion li.panel:eq('+livingSuperSelectedIndex+')')
        .siblings()
        .removeClass('active')
        .find('.slide-content')
        .hide();

    $('#living-super-accordion li.panel .title-container').unbind('click');
    $('#living-super-accordion li.panel .title-container').on('click', function(event) {
        event.preventDefault();

        if (mediaQuery === media_xs) {
            var target = $(this).data('target');


            if ($(target).parent().parent().hasClass('active') === true) {
                console.log('has active');

                $(target).parent().parent().removeClass('active');
                $(target).slideUp('fast');
                livingSuperSelectedIndex = 0;

            } else {
                console.log('does not have active');

                $(target).parent().parent().addClass('active');
                $(target).slideDown('fast');

                $(target).parent().parent().siblings().removeClass('active');
                $(target).parent().parent().siblings().find('.slide-content').slideUp('fast');

                livingSuperSelectedIndex = $(target).parent().parent().index();
            }
        }
    });
}
*/
/* remove this

// Living Super Inner
// ----------------------------------------------
function initializeLivingSuperContent() {
    $('#living-super-accordion .bottom-title-bar').on('click', function(event) {
        event.preventDefault();
        onClickPopOverClose();

        if ($(this).parent().hasClass('active') === true) {
            $(this).parent().removeClass('active');
            if (Modernizr.csstransitions === false) {
                $(this).parent().animate({ top: 0 }, 'normal');
            }
        } else {
            $(this).parent().addClass('active');
            if (Modernizr.csstransitions === false) {
                var top = 0;
                if (mediaQuery === media_sm) {
                    top = -422;
                } else if (mediaQuery >= media_md) {
                    top = -422;
                }
                $(this).parent().animate({ top: top + 'px' }, 'normal');
            }
        }
    });

    $('#living-super-accordion .detail-info-selector').on('click', function(event) {
        event.preventDefault();

        var isAnyoneActive = false;
        $(this).parent().siblings('.horizontal-sliding-container').each(function(index, element) {
            if ($(element).hasClass('active') === true) {
                isAnyoneActive = true;
            }
        });

        if (isAnyoneActive === false) {
            var target = $(this).data('target');
            $(target).addClass('active');
            if (Modernizr.csstransitions === false) {
                $(target).animate({ left: 0 }, 'normal');
            }
        }
    });

    $('#living-super-accordion .horizontal-sliding-container .close-button').on('click', function(event) {
        event.preventDefault();
        $(this).parent().parent().removeClass('active');
        if (Modernizr.csstransitions === false) {
            $(this).parent().parent().animate({ left: '100%' }, 'normal');
        }
    });

    $('#living-super-accordion .slide-handle').on('click', function(event) {
        event.preventDefault();
        onClickPopOverClose();
    });
}
*/

// OE Calculator
// ----------------------------------------------
function initializeOeCalculator() {

    if ($('#oe-calculator').size() !== 1) {
        return;
    }

    var coffee = parseInt($('#txtCoffee').val(), 10);
    var petrol = parseInt($('#txtPetrol').val(), 10);
    var groceries = parseInt($('#txtGroceries').val(), 10);
    var taxies = parseInt($('#txtTaxi').val(), 10);

    $('#expense1').noUiSlider({ range: [0, 100], start: coffee, step: 1, handles: 1, serialization: { to: $("#txtCoffee") }, slide: onSlideInOeCalculator, set: onClickInOeCalculator });
    $('#expense2').noUiSlider({ range: [0, 1000], start: petrol, step: 10, handles: 1, serialization: { to: $("#txtPetrol") }, slide: onSlideInOeCalculator, set: onClickInOeCalculator });
    $('#expense3').noUiSlider({ range: [0, 500], start: groceries, step: 10, handles: 1, serialization: { to: $("#txtGroceries") }, slide: onSlideInOeCalculator, set: onClickInOeCalculator });
    $('#expense4').noUiSlider({ range: [0, 800], start: taxies, step: 10, handles: 1, serialization: { to: $("#txtTaxi") }, slide: onSlideInOeCalculator, set: onClickInOeCalculator });

    /* this is for new nouislider javascript - no more jquery dependency
    var expense1 = document.getElementById('expense1'); var expense1_val = document.getElementById('txtCoffee');
    var expense2 = document.getElementById('expense2');
    var expense3 = document.getElementById('expense3');
    var expense4 = document.getElementById('expense4');
    noUiSlider.create( expense1, { range: {'min':0, 'max':100}, start: coffee, step: 1, handles: 1, serialization: { to: expense1_val }, slide: onSlideInOeCalculator, set: onClickInOeCalculator  });
    */
}

function refreshOeCalculator() {
    updateSliderValuesInOe('#expense1');
    updateSliderValuesInOe('#expense2');
    updateSliderValuesInOe('#expense3');
    updateSliderValuesInOe('#expense4');

    calculateOeTotal();
}

function updateSliderValuesInOe(ele) {
    //get init values
    var handleLeft = $(ele).find(".noUi-origin-lower").css('left');
    $(ele).parent().find(".slider-arrow").css('left', handleLeft);
//    console.log('handleLeft: ' + handleLeft);

    //set label value
    var labelField = $(ele).parents('.sliderRow').data("labelfield");
    var valueField = $($(ele).parents('.sliderRow').attr("data-valuefield")).val();

    $(labelField + " span").html(Math.round(valueField));
}

function calculateOeTotal() {
    // v1.3.0
//    var percentage = 5;
//    var months = 6;
    var percentage = 2;
    var months = 12;
    // end
    var weeks = months * 4.34812;

    var coffee = parseInt($('#txtCoffee').val(), 10);
    var petrol = parseInt($('#txtPetrol').val(), 10);
    var groceries = parseInt($('#txtGroceries').val(), 10);
    var taxies = parseInt($('#txtTaxi').val(), 10);

    var result = (coffee * weeks) * (percentage / 100);
    result += (petrol * weeks) * (percentage / 100);
    result += (groceries * weeks) * (percentage / 100);
    result += (taxies * weeks) * (percentage / 100);
    $('#txtTotal').html(result.toFixed(2));
    $('#txtTotal2').html(result.toFixed(2));
}

function onSlideInOeCalculator() {
    updateSliderValuesInOe(this);
    calculateOeTotal();
}

function onClickInOeCalculator() {
    setTimeout(function () {
        updateSliderValuesInOe(this);
        calculateOeTotal();
    }, 300);
}


// More Contents
// ----------------------------------------------
function initializeMoreContents() {
    initializeDisclaimer();
    initializeMoreFeatures();
}

function refreshMoreContents() {
    refreshDisclaimer();
}

function initializeDisclaimer () {
    $('.ING-footer .important-information .read-more').on('click', function(event) {
        event.preventDefault();
        $(this).addClass('active');
        $('.ING-footer .important-information .collapsed').addClass('active');
    });
}

function refreshDisclaimer () {
    $('.ING-footer .important-information .read-more').removeClass('active');
    $('.ING-footer .important-information .collapsed').removeClass('active');
}

function initializeMoreFeatures() {
    $('a[data-toggle="collapse"].more-features-style').on('click', function(event) {
        event.preventDefault();
        $(this).fadeOut('fast');
    });
}


// Tab Highlighter
// ----------------------------------------------
function initializeTabHighlighter () {
    $('.content-tab-style > li > a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        var count = $(this).parents('.content-tab-style').children('li').size() - 1;
        var weight = 100 / count;
        var percentage = $(this).parent().index() * weight;
        $(this).parent().siblings('.highlighter').css('left', percentage + '%');
    });
}


// Tooltip Components
// ----------------------------------------------
function initializeTooltipComponents() {
    if (checkTouch() === true) {
        $("[data-toggle=tooltip]").tooltip({
            trigger: 'click',
            html: 'true'
        });
    } else {
        $("[data-toggle=tooltip]").tooltip({
            trigger: 'hover',
            html: 'true',
            container: 'body'
        });
    }
}


// Pop-over Components
// ----------------------------------------------
function initializePopOverComponents() {

    $('[data-toggle="popover"]').popover({
        trigger: 'manual',
        html: 'true'
    });

    $('[data-toggle="popover"]').on('click', function(event) {
        event.preventDefault();

        if ($(this).data('shown') === 'true') {
            $(this).data('shown', 'false');
            $(this).removeClass('active');
            $(this).popover('hide');
        }
        else {

            onClickPopOverClose();

            $(this).data('shown', 'true');
            $(this).addClass('active');
            $(this).popover('show');
        }
    });

    // reset popover when collapse closed
    $('[data-toggle="collapse"]').each(function(index, el) {
        $($(el).attr('href')).on('hide.bs.collapse', function() {
            onClickPopOverClose();
        });
    });

    // reset popover when tab changed
    $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        onClickPopOverClose();
    });
}

function onClickPopOverClose() {
    $("[data-toggle=popover]").each(function(index, el) {
        if ($(el).data('shown') === 'true') {
            $(el).data('shown', 'false');
            $(el).removeClass('active');
            $(el).popover('hide');
        }
    });
}

// FAQ Scroller
function initializeFaqScroller() {

    $('[data-toggle="scroller"]').on('click', function(event) {
        event.preventDefault();

        var target = $(this).attr('href');
        var offset = $(target).offset().top - headerBottomHeight;
        if ($('.ING-tab-header').size() === 1) {
            offset = $(target).offset().top - (headerBottomHeight + $('.ING-tab-header .tabs-wrapper').height());
            //offset = $(target).offset().top - (headerBottomHeight + stickyTabHeaderMinHeight - headerMiniGap);
        }
        $('body, html').stop().animate({scrollTop : offset}, 500, "easeOutQuint");
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

function onClickResponsiveLogin() {
    if (mediaQuery === media_xs) {
        var url = '/mobile-login.html';
        window.location.href = url;
    }
    else {
        OpenClient();
    }
    return false;
}

function onClickMobileApp() {
    var urliPhone = 'https://itunes.apple.com/au/app/ing-direct-australia-banking/id427100193?mt=8&ign-mpt=uo%3D4';
    var urlAndroid = 'https://play.google.com/store/apps/details?id=au.com.ingdirect.android';
    var urlWindows = 'http://www.windowsphone.com/en-au/store/app/ing-direct/3e80e3bb-ed81-4ec1-af60-0b185a21b670';

    if (jQuery.browser.mobile === true) {
        var userAgent = navigator.userAgent;
        var url = '';
        if (userAgent.indexOf('Android') >= 0) {
            url = urlAndroid;
        } else if (userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('iPod') >= 0) {
            url = urliPhone;
        } else if (userAgent.indexOf('IEMobile') >= 0) {
            url = urlWindows;
        } else {
            return false;
        }

        var win = window.open(url, '_blank');
        win.focus();
    }

    return false;
}


// Help Methods
// ----------------------------------------------
function changedMediaQuery() {
    var width = $(window).width();
    var media;

    // remove IE8
    // if (checkIE8() === true) {
    //  media = media_md;
    // }
    //else {
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
    //}

    if (media !== mediaQuery) {
        mediaQuery = media;
        return true;
    }
    return false;
}

// remove IE old
// function checkIE8() {
//  return $('html').hasClass('ie8');
// }
// function checkIE9() {
//  return $('html').hasClass('ie9');
// }
// function checkOldIE() {
//     var ua = navigator.userAgent.toLowerCase(); /* message */
//     if ((ua.match(/windows nt 5.1/) || ua.match(/windows nt 6.0/) || ua.match(/windows nt 5.2/)) && $.browser.msie && $.browser.version <= 7) {
//         $(".box").append("<p style='text-align:center;'>We have detected that you are using Internet Explorer 7. It has known <strong>security flaws</strong> and may <strong>not display all features</strong> of this and other websites.<br />Please upgrade to one of the following - <a href='http://www.microsoft.com/en-au/download/internet-explorer-8-details.aspx' target='_blank'>Internet Explorer</a>, <a href='http://www.mozilla.org/en-US/firefox/new/' target='_blank'>Firefox</a>, <a href='http://www.apple.com/au/safari/' target='_blank'>Safari</a> and <a href='http://www.google.com/chrome/' target='_blank'>Chrome</a>.</p><div class='close_box style='text-align:right;cursor:pointer;float:right;margin-right:50px;'>&times;</div>");
//         $(".box").slideDown("slow");
//         $(".close_box").click(function () {
//             $(".box").slideUp("slow");
//         });
//     }
// }

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





/*
// Tab Content Style
// ----------------------------------------------
function initializeTabStyleMainFeatures () {
    initializeTabStyle('.product-tab-title-list', '#product-tab-content-list');
    initializeTabStyle('.left.category-tab-title-list', '#left-category-tab-content-list');
    initializeTabStyle('.right.category-tab-title-list', '#right-category-tab-content-list');

    // add highlighter
    $('<li class="highlighter"/>').appendTo('.category-tab-title-list');
}

function initializeTabStyleMainFeatures_NOCSSTRANSITIONS () {
    initializeTabStyle_NOCSSTRANSITIONS('.product-tab-title-list', '#product-tab-content-list');
    initializeTabStyle_NOCSSTRANSITIONS('.left.category-tab-title-list', '#left-category-tab-content-list');
    initializeTabStyle_NOCSSTRANSITIONS('.right.category-tab-title-list', '#right-category-tab-content-list');

    // add highlighter
    $('<li class="highlighter"/>').appendTo('.category-tab-title-list');
}

function refreshTabStyleMainFeatures () {
    refreshTabStyle('.product-tab-title-list', '#product-tab-content-list');
    refreshTabStyle('.left.category-tab-title-list', '#left-category-tab-content-list');
    refreshTabStyle('.right.category-tab-title-list', '#right-category-tab-content-list');
}

function initializeTabStyle_NOCSSTRANSITIONS(titleListClass, contentListId) {

}

function initializeTabStyle(titleListClass, contentListId) {

    $(titleListClass + ' a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var index = $(e.target).parent().index();
        setupActiveTitleTab(index);

        $(contentListId + ' > li:eq('+index+')')
            .find('.collapse-panel')
            .addClass('in')
            .css('height', 'auto');
        $(contentListId + ' > li:eq('+index+')').siblings()
            .find('.collapse-panel')
            .removeClass('in')
            .addClass('collapse')       // recover collapse bug..
            .css('height', '0');
    });

    $(titleListClass + ' a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var index = $(e.target).parent().index();
        setupHighlighterTab(titleListClass, index);
    });

    $(contentListId + ' .collapse-panel').on('show.bs.collapse', function (e) {
        if ($(e.target).hasClass('collapse-panel') === true) {
            var index = $(e.target).parent().index();

            $(titleListClass + ' > li:eq('+index+')')
                .addClass('active');

            $(contentListId + ' > li:eq('+index+')')
                .addClass('active').addClass('in')
                .siblings().removeClass('active').removeClass('in');

            setupHighlighterTab(titleListClass, index);
        }
    });

    $(contentListId + ' .collapse-panel').on('hide.bs.collapse', function (e) {
        if ($(e.target).hasClass('collapse-panel') === true) {
            var index = $(e.target).parent().index();

            $(titleListClass + ' > li:eq('+index+')')
                .removeClass('active');

            $(contentListId + ' > li:eq('+index+')')
                .removeClass('active').removeClass('in');
        }
    });

    function setupActiveTitleTab (index) {
        $(titleListClass + ' > li:eq('+index+')')
            .addClass('active')
            .siblings().removeClass('active');
    }
}

function refreshTabStyle(titleListClass, contentListId) {

    if($(titleListClass + ' > li.active').size() <= 0) {
        $(titleListClass + ' > li:eq(0)').addClass('active');
        $(contentListId + ' > li:eq(0)')
            .addClass('active').addClass('in')
            .find('.collapse-panel').addClass('collapse').addClass('in')
            .css('height', 'auto');

        setupHighlighterTab(titleListClass, 0);
    }
}

function setupHighlighterTab (titleListClass, index) {
    var left = (20 * index) + '%';
    if ($(titleListClass).hasClass('divide-4') === true) {
        left = (25 * index) + '%';
    }

    if (Modernizr.csstransitions) {
        $(titleListClass + ' > li.highlighter').css('left', left);
    } else {
        $(titleListClass + ' > li.highlighter').animate({ left: left }, 'fast');
    }
}


// Sub Tab Content Style ('Fee' Collapse List)
// ----------------------------------------------
function initializeSubTabContentStyle () {
    $('.module-collapse' + ' .sub-collapse').on('show.bs.collapse', function (e) {
        $(this).parent().addClass('active');
    });
    $('.module-collapse' + ' .sub-collapse').on('hide.bs.collapse', function (e) {
        $(this).parent().removeClass('active');
    });
}

function initializeSubTabContentStyle_NOCSSTRANSITIONS () {
    $('.module-collapse > li.panel > a').attr('data-toggle', 'none');
    $('.module-collapse > li.panel > a').on('click', function(event) {
        event.preventDefault();

        var target = $(this).attr('href');
        var active = $(this).children('.sub-tab-title').hasClass('active');

        if (active) {
            $(target).slideUp('fast');
            $(this).children('.sub-tab-title').removeClass('active');

        } else {
            $(target).slideDown('fast');
            $(this).parent().siblings('li.panel').each(function(index, el) {
                $($(el).children('a').attr('href')).slideUp('fast');
            });

            $(this).parent().addClass('active');
            $(this).parent().siblings('li.panel').each(function(index, el) {
                $(el).removeClass('active');
            });
        }
    });
}
*/



/*
// Table Slider
// ----------------------------------------------

var tableSliders = [];
function refreshTableSliders () {
    // create
    if (mediaQuery === media_xs && checkIE8() === false) {
        // MARK: prevent resize error
        setTimeout(createAllTableSliders, 2000);
        //createAllTableSliders();
    }
    // destroy
    else {
        destroyAllTableSliders();
    }
}

function createAllTableSliders() {
    tableSliders = [];
    $('.table-style-slider').each(function(index, element) {
        if ($(element).children('li').size() <= 1) {
            return;
        }

        $('.double-tab-pane').css('display', 'block');
        $(element).removeClass('reset-bx-slider');
        var collapseObject = $(element).parents('.collapse-panel');
        $(collapseObject).css('display', 'block');

        var slider = $(element).bxSlider({
            slideWidth: 0,
            slideMargin: 0,
            minSlides: 1,
            maxSlides: 1,
            startSlider: 0,
            nextText: '',
            prevText: '',
            adaptiveHeight: true,
            onSliderLoad: function() {
                if ($(collapseObject).hasClass('in') === true) {
                    $(collapseObject).css('height', 'auto');
                } else {
                    $(collapseObject).css('height', '1px');
                }
                $(collapseObject).removeAttr('style');
                $('.double-tab-pane').removeAttr('style');
            }
        });

        tableSliders.push(slider);
    });
}

function destroyAllTableSliders() {
    jQuery.each(tableSliders, function(index, object) {
        object.destroySlider();
        object.addClass('reset-bx-slider');
    });
    tableSliders = [];
}





*/