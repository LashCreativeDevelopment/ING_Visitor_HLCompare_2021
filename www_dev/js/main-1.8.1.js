/*
 * ING Main JS
 * (Rebranding 2021)
 * ver. 1.8.1
 * NOTE: v2.5, v2.6 - referring to css versions
 */


// Helper for Windows Mobile Browser Size Issue
// ----------------------------------------------
// http://css-tricks.com/snippets/javascript/fix-ie-10-on-windows-phone-8-viewport/
// Fix IE 10 on Windows Phone 8 Viewport
(function() {
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild( document.createTextNode("@-ms-viewport{width:auto!important}") );
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

var mediaQuery  = -1; // unknown device size

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

// this is for the landing page which does not have top menu and mega drop down
if( (typeof TOPLESS_LANDING !== 'undefined') && TOPLESS_LANDING ) {
  headerBottomHeight = -4; // lose the mega drop down bar
  headerHeight = headerTopHeight; // + headerBottomHeight;
}

// status of sticky components
var statusStickyHeader = 'normal';
var statusStickyTabHeader = 'normal';
var stickyTabIds = [];
var isForcedScrolling = false;
var pageScrollingWeight = 1.0;

// MARK: fixed bug in firefox about megamenu initial hover issue
var allowMegaDropdownMenu = false;

      
// BY ING DIRECT (from main-1.6.0.min.js)
function openJointInviteModal() {
  var modal = document.querySelector("ing-invite-joint-applicant-modal");
  if (modal.toggleDialog) {
    modal.toggleDialog()
  }
  else {
    setTimeout(openJointInviteModal, 100);
  }
}
function GetURLParameters(e) {
  window.location.search.substring(1).split("=")[0] == e && openJointInviteModal();
}


// ING MAIN
// ----------------------------------------------
$(document).ready(function () {
  //OSDetect(); // v2.6
  initializeComponents();
  GetURLParameters('jointApp');

  $(window).trigger('resize');
  $(window).trigger('scroll');

  // init scroll anchor - page position check
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
  // href value ending in #
  $("a[href$='#']").click(function () {
    return false;
  });

  initialiseClickInNewTabPage();

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

  // faq scroller
  initializeFaqScroller();

  // sliders
  //initialiseHomeHeroSlider(); //v1.8.1
  initialiseMoreAboutSlider();
  initialiseFeaturesSlider(); 
  initialiseHomeHeroFeatureSlider();

  // DEBUG
  // if (checkDEBUG()) {
  //   initializeSizeMonitor();
  // }

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

    // disclaimer style
    refreshMoreContents();
  }

  // DEBUG
  // if(checkDEBUG()) {
  //     refreshSizeMonitor();
  // }
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
  var newline = encodeURIComponent('\n');

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

  if (hashTarget.length > 1 && $(realTarget).length === 1) {

    // Case: mobile
    if (mediaQuery === media_xs) {
      // footer
      if (realTarget === '#more-about' ||
        realTarget === '#important-information' ||
        realTarget === '#generic-footer'
      ) {
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
            window.history.pushState({}, '', window.location.href);
          }
        }
      }

      // force reload hash url
      if ($(this).attr('href').indexOf('#') !== -1) {
        var newUrl = $(this).attr('href');
        if (newUrl.indexOf('#') !== -1) {
          newUrl = newUrl.slice(0, newUrl.indexOf('#'));
        }

        window.location = $(this).attr('href');

        resetMegaMenus();
        refreshMegaMenus();

        if (window.location.pathname === newUrl) {
          adjustPagePosition();
          return false;
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

  if      (homeQuickLink.length !== 0) return homeQuickLink.attr('id');
  else if (homeEveryday.length  !== 0) return homeEveryday.attr('id');
  else if (homeSavings.length   !== 0) return homeSavings.attr('id');
  else if (homeLoans.length     !== 0) return homeLoans.attr('id');
  else if (homeSuper.length     !== 0) return homeSuper.attr('id');
  else if (homeBusiness.length  !== 0) return homeBusiness.attr('id');

  // case: footer contents
  var moreAbout = $(anchor).parents('#more-about');
  var importantInfo = $(anchor).parents('#important-information');
  var genericFooter = $(anchor).parents('#generic-footer');

  if      (moreAbout.length     !== 0) return moreAbout.attr('id');
  else if (importantInfo.length !== 0) return importantInfo.attr('id');
  else if (genericFooter.length !== 0) return genericFooter.attr('id');

  // case: exceptional content
  // nothing yet...
  return null;
}


// Mega Dropdown Menus
// ----------------------------------------------
function initializeMegaMenus() {
  $(".ING-header .mega-dropdown-container").append("<div class='close-button'></div>");
  $(".ING-header .mega-dropdown-container .close-button").on("click", function(event) {
    event.preventDefault();
    $(this).parents(".menu-cell").removeClass("active");
    $(this).parents(".menu-cell").children(".mega-dropdown-container:visible").fadeOut("fast");
    return false;
  });

  // to close megadropdown menu when you click ING-body area
  $('.ING-body').on('click', function() {
    if (mediaQuery !== media_xs) {
      $(".ING-header .mega-dropdown-container .close-button").trigger('click');
    }
  });

  // when inner menus are changed, if there are the related "Your tools", also need to change.
  $('.column-inner-tab-style > a[data-toggle="tab"]').on('show.bs.tab', function(e) {
    var newTarget = $(e.target).attr('href') + '-ex';
    var oldTarget = $(e.relatedTarget).attr('href') + '-ex';
    if (mediaQuery !== media_xs && $(newTarget).length == 1 && $(oldTarget).length == 1) {
      $(newTarget).fadeIn();
      $(oldTarget).fadeOut();
    }
  });
}

function refreshMegaMenus() {
    var menuCell = ".ING-header .menu-cell";
    resetMegaMenus();
    if (mediaQuery === media_xs) {
        $(menuCell + " > a").on("click", function(event) {
            return "undefined" == typeof $(this).data("target") ? void (window.location.href = $(this).attr("href")) : (event.preventDefault(),
            void ($(this).parent().hasClass("active") === !1 ? ($(this).parent().addClass("active"),
            $(this).siblings(".mega-dropdown-container:hidden").slideDown("fast"),
            $(this).parent().siblings().each(function(a, b) {
                $(b).hasClass("active") === !0 && ($(b).removeClass("active"),
                $(b).children(".mega-dropdown-container:visible").slideUp("fast"))
            })) : ($(this).parent().removeClass("active"),
            $(this).siblings(".mega-dropdown-container:visible").slideUp("fast"))))
        });

        $(menuCell).each(function(i, obj) {
            $(obj).find(".column-collapse-button").each(function(index, collapseButton) {
                // cleanup
                $(collapseButton).removeClass('active');
                var target = $(collapseButton).data('target');
                //console.log(target);
                $(target).removeClass('fade in active');
                if (index == 0) {
                    $(collapseButton).addClass('active');
                    $(target).show();
                } else {
                    $(target).hide();
                }

                // bind event listener
                $(collapseButton).on("click", function(e) {
                    e.preventDefault();
                    var target = $(this).data('target');
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        $(target).slideUp("fast");
                    } else {
                        $(this).addClass('active');
                        $(target).slideDown("fast");

                        $(this).siblings('.column-collapse-button').each(function(i, o) {
                            $(o).removeClass('active');
                            $($(o).data('target')).slideUp("fast");
                        });
                    }
                });
            });
        });


    } else {
        // cleanup
        $(menuCell).each(function(i, menu) {
            var tabHeaders = $(menu).find('.column-inner-tab-style');
            tabHeaders.each(function(index, tabHeader) {
                if (index == 0) {
                    $(tabHeader).addClass('active');
                    $(tabHeader).children('[data-toggle="tab"]').attr('aria-expanded', 'true');
                    var target = $(tabHeader).children('[data-toggle="tab"]').attr('href');
                    $(target).attr('style', '').addClass('fade in active');

                    // for "Your tools"
                    $(target + '-ex').show();
                }
                else {
                    $(tabHeader).removeClass('active');
                    $(tabHeader).children('[data-toggle="tab"]').attr('aria-expanded', 'false');
                    var target = $(tabHeader).children('[data-toggle="tab"]').attr('href');
                    $(target).attr('style', '').addClass('fade').removeClass('in active');

                    // for "Your tools"
                    $(target + '-ex').hide();
                }
            });
        });

        // bind event listener
        $(menuCell + "> a").on("click", function(a) {
            var b = $(this).parent();
            a.preventDefault();

            if (b.hasClass("active") === !0) {
                b.removeClass("active"),
                b.children(".mega-dropdown-container:visible").fadeOut("fast")
            } else {
                b.addClass("active"),
                b.children(".mega-dropdown-container:hidden").fadeIn("fast"),
                b.siblings().each(function(a, obj) {
                    $(obj).hasClass("active") === !0 && ($(obj).removeClass("active"),
                    $(obj).children(".mega-dropdown-container:visible").fadeOut("fast"))
                })
            }
            return false;
        })
    }
}

function resetMegaMenus() {
  var menuCell = ".ING-header .menu-cell";
  $(menuCell).removeClass("active");
  $(menuCell + " .mega-dropdown-container").css("display", "none");
  $(menuCell + " > a").unbind("click");
  $(menuCell + " > a").unbind("hover");

  var collapseButton = menuCell + " .column-collapse-button";
  $(collapseButton).unbind("click");
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
}

function refreshMobileMenuButtons() {
  if (mediaQuery === media_xs) {
    // menu button
    $(mobileMenuButton).removeClass('selected');
    $(mobileMenuWrapper).removeClass('active');
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
  var activeIndex = -1;
  for (var index in stickyTabIds) {
    var contentTop = $(stickyTabIds[index]).offset().top;
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

  if ($('.ING-tab-header .tab-list > li.active').length === 1) {
    var index = $('.ING-tab-header .tab-list > li.active').index();
    var size = $('.ING-tab-header .tab-list > li').length;
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
        // v2.6 not required - old FF may still needs this
        // if (BrowserDetect.browser === 'Firefox') {
        //   allowMegaDropdownMenu = false;
        // }
        transformStickyHeader('sticky');
      }
      else {
        console.log('Unexpected control in Sticky Header');
      }
    }
  });
}

function updateStickyHeader (e) {
  var infoHeight = ($('#additional-info-box').length > 0 ) ? $('#additional-info-box').height() : 0; // jquery height() reutns undefined instead of null in the latest version
  var heroHeight = $('.ING-tab-header').prev('div, section, article').height();
  var titleHeight = $('.ING-tab-header .heading-wrapper').height();
  var contentTopHeight = headerTopHeight + infoHeight + heroHeight + titleHeight;

  // MARK: second condition makes to avoid to error when tab header is not in page.
  if ($(window).scrollTop() > contentTopHeight && $('.ING-tab-header').length > 0) {
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
    stickyTabIds[index] = $(el).children('a').attr('href').replace('ING-', '');
  });

  var tempDiv = $('<div/>').addClass('tab-height-manager');
  if( $('.tab-height-manager').length < 0 ) { 
    tempDiv.prependTo('.ING-body');
  }

  // add orange bar
  var tabListCount = $('.ING-tab-header .tab-list > li').length;
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

    var id = stickyTabIds[$(this).parent().index()];
    var offset = $(id).offset().top - headerBottomHeight - $('.ING-tab-header .tabs-wrapper').height() + 1;

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
  if ($('.ING-tab-header').length === 0) {
    return;
  }

  // update sticky status
  var infoHeight = ( $('#additional-info-box').length > 0 ) ? $('#additional-info-box').height() : 0;
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
        // v2.6 not required
        // check if info slider exists in the tab and if exits, reload the slider
        // if( $(target).find('#infos-slider').length ) {
        //   refreshInfosSlider();
        // }
      });
    }
    else {
      $(this).removeClass('active');
      $(target).slideUp(durationFast);
    }
  });
}

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
          // isForcedScrolling = true;
          $('body, html').stop().animate({scrollTop : offset}, 400/*'2000'*/, "easeOutQuart", function() {
            // isForcedScrolling = false;
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
        var count = $('.dynamic-table-box .table-container').length;
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

    // v2.6 not required
    // refreshHomeHeroSlider();
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
    if ($('.ING-people .tab-list > li.active').length > 0) {
        var index = $('.ING-people .tab-list > li.active').index();
        var percentage = index * (1/6)*100; // v2.5 index * 20;
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



// More About Slider
// ----------------------------------------------
function initialiseMoreAboutSlider() {
  if ( $('.more-about-slider').length < 0 ) return;

  $('.more-about-slider').slick({
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    //infinite: false,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: minTablet - 1,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: minMiddle - 1,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      }
    ]
  });
}


// Features Slider
// ----------------------------------------------
function initialiseFeaturesSlider() {
  if ( $('#features-slider').length < 0 ) return;

  initFeaturesSlider();

  $(window).resize(function (e) {
    //if( $('.mobile-tab').first().is(':hidden') ) {
    if( $(window).width() >= minTablet ) {
      if(! $('#features-slider').hasClass('slick-initialized') ) initFeaturesSlider();
    }
  });
}

function initFeaturesSlider() {
  $('#features-slider').slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    infinite: false,
    responsive: [
      {
        breakpoint: minMiddle,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: minTablet,
        settings: 'unslick'
      }
    ]
  });
}


/* v1.8.1 - no more home hero slider
// Home Hero Slider
// ----------------------------------------------
function initialiseHomeHeroSlider() {
  if ( $('#home-hero-slider').length < 0 ) return;

  initHomeSlider();

  $(window).resize(function (e) {
    //if( $('.mobile-tab').first().is(':hidden') ) {
    if( $(window).width() < minMiddle ) {
      if(! $('#home-hero-slider').hasClass('slick-initialized') ) initHomeSlider();
    }
  });
}

function initHomeSlider() {
  $('#home-hero-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: minMiddle - 1,
        settings: 'unslick'
      }
    ]
  });
}
*/


// Home Hero Feature Slider - 2020 Homepage Upgrade
// ----------------------------------------------
function initialiseHomeHeroFeatureSlider() {
  if ( $('#hero-feature-slider').length < 0 ) return;

  initHeroFeatureSlider();

  $(window).resize(function (e) {
    if( $(window).width() < minMiddle ) {
      if(! $('#hero-feature-slider').hasClass('slick-initialized') ) initHeroFeatureSlider();
    }
  });
}

function initHeroFeatureSlider() {
  var options = {
    slidesToShow: 1.2,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    mobileFirst: true,
    infinite: false,
    responsive: [
      {
        breakpoint: minTablet - 1,
        settings: {
          slidesToShow: 2.2,
        }
      },
      {
        breakpoint: minMiddle - 1,
        settings: 'unslick'
      }
    ]
  };

  $('#hero-feature-slider').slick( options );
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
    var count = $(this).parents('.content-tab-style').children('li').length - 1;
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
    if ($('.ING-tab-header').length === 1) {
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


// to open in a new tab - more from ing slide
function initialiseClickInNewTabPage() {
  $('body').on('click', 'a[data-toggle="new-tab-page"]', function(event) {
    event.preventDefault();

    var url = $(this).attr("href");
    var win = window.open(url, '_blank');
    win.focus();
  });
}


$('a[href="#ImportantInformation"]').on('click', function(event) {
  event.preventDefault();
  var footDisc = document.querySelector("#important-information");
  footDisc = footDisc.querySelector(".text-container");
  var disc = footDisc.cloneNode(true);
  if (!document.querySelector("#ImportantInformation") == false) {
    var modalDisc = document.querySelector("#ImportantInformation");
    modalDisc = modalDisc.querySelector(".modal-body");
    
    // v2.5 
    if( ! modalDisc.contains( modalDisc.querySelector(".text-container") ))
      modalDisc.appendChild(disc);
  }
});


// v2.6 - check if this can be removed? only used in personal loan calculator pages
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


// v2.6 not used 
// function onClickMobileApp() {
//   var urliPhone = 'https://itunes.apple.com/au/app/ing-direct-australia-banking/id427100193?mt=8&ign-mpt=uo%3D4';
//   var urlAndroid = 'https://play.google.com/store/apps/details?id=au.com.ingdirect.android';
//   var urlWindows = 'http://www.windowsphone.com/en-au/store/app/ing-direct/3e80e3bb-ed81-4ec1-af60-0b185a21b670';
//   if (jQuery.browser.mobile === true) {
//     var userAgent = navigator.userAgent;
//     var url = '';
//     if (userAgent.indexOf('Android') >= 0) {
//       url = urlAndroid;
//     } else if (userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('iPod') >= 0) {
//       url = urliPhone;
//     } else if (userAgent.indexOf('IEMobile') >= 0) {
//       url = urlWindows;
//     } else {
//       return false;
//     }
//     var win = window.open(url, '_blank');
//     win.focus();
//   }
//   return false;
// }



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

/*
M - delete
function checkCssTransitions() {
  return $('html').hasClass('csstransitions');
}
*/

// function checkDEBUG() {
//   return $('html').hasClass('DEBUG');
// }

// http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function checkTouch() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
    return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}


// v2.6 not required
// http://stackoverflow.com/questions/13478303/correct-way-to-use-modernizr-to-detect-ie
// var BrowserDetect = {
//   init: function () {
//       this.browser = this.searchString(this.dataBrowser) || "Other";
//       this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
//   },
//   searchString: function (data) {
//       for (var i=0 ; i < data.length ; i++)
//       {
//           var dataString = data[i].string;
//           this.versionSearchString = data[i].subString;
//           if (dataString.indexOf(data[i].subString) !== -1)
//           {
//               return data[i].identity;
//           }
//       }
//   },
//   searchVersion: function (dataString) {
//       var index = dataString.indexOf(this.versionSearchString);
//       if (index === -1) {
//           return;
//       }
//       return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
//   },
//   dataBrowser: [
//       { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
//       { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
//       { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
//       { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
//       { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
//   ]
// };
// BrowserDetect.init();


// v2.6 - not sure if this is being used
// http://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript
// var OSName = "Unknown OS";
// function OSDetect () {
//   if (navigator.appVersion.indexOf("Win") !== -1) {
//       OSName = "Windows";
//   } else if (navigator.appVersion.indexOf("Mac") !== -1) {
//       OSName = "MacOS";
//   } else if (navigator.appVersion.indexOf("X11") !== -1) {
//       OSName = "UNIX";
//   } else if (navigator.appVersion.indexOf("Linux") !== -1) {
//       OSName = "Linux";
//   }
// }





// DEBUG - Size Monitor
// ----------------------------------------------
// function initializeSizeMonitor() {
//   var sizeMonitor = $('<div class="size-monitor"/>')
//     .append('<p id="debug_browser-width">width: 0px</p>')
//     .append('<p id="debug_browser-height">height: 0px</p>')
//     .append('<p class="visible-xs">[Mobile]</p>')
//     .append('<p class="visible-sm">[Tablet]</p>')
//     .append('<p class="visible-md">[Desktop]</p>')
//     .append('<p class="visible-lg">[Large Desktop]</p>');
//   sizeMonitor.prependTo('body');
// }

// function refreshSizeMonitor() {
//   $('#debug_browser-width').text('width: ' + $(document).width() + 'px');
//   $('#debug_browser-height').text('height: ' + $(document).height() + 'px');
// }


// used only at contact-us.html to display phone number
// moved to contact-us.html
// function singleSelectChangeValue() {
//   var selObj = document.getElementById("singleSelectValueDDJS");
//   var selValue = selObj.options[selObj.selectedIndex].value;
//   document.getElementById("textFieldValueJS").value = selValue;
// }

// END