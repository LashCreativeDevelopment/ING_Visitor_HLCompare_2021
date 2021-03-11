/*
 * ING DIRECT Main JS
 */
// Helper for Windows Mobile Browser Size Issue
// ----------------------------------------------
// http://css-tricks.com/snippets/javascript/fix-ie-10-on-windows-phone-8-viewport/
// Fix IE 10 on Windows Phone 8 Viewport
function initializeComponents() {
    $("a[href$='#']").click(function() {
        return !1
    }), initializeMobileMenuButtons(), initializeMobileContentTabs(), initializeStickyHeader(), initializeStickyTabHeader(), initializeMegaMenus(), initializeHomePage(), initializeMoreContents(), initializeTabHighlighter(), initializePopOverComponents(), initializeTooltipComponents(), initializeLivingSuperContent(), initializeOeCalculator(), initializeFaqScroller(), checkDEBUG() && initializeSizeMonitor(), checkAnchorTags()
}

function refreshResponsiveComponents() {
    changedMediaQuery() === !0 && (refreshMobileMenuButtons(), refreshMobileContentTabs(), refreshStickyHeader(), refreshStickyTabHeader(), refreshMegaMenus(), refreshHomePage(), refreshMoreAboutSlider(), refreshSustainSlider(), refreshSustainSlider2(), refreshFeaturesSlider(), refreshMoreContents(), refreshLivingSuperAccordion(), refreshOeCalculator()), checkDEBUG() && refreshSizeMonitor()
}

function updateScrollingComponents(e) {
    mediaQuery >= media_sm && isForcedScrolling === !1 && (updateStickyHeader(e), updateStickyTabHeader(e), changeStickyHeaderUsingScrollUpEvent())
}

function shareUrl(e) {
    var t, i, a;
    if ("facebook" === e) i = "?cid=som:fac:vis:shr", t = "https://www.facebook.com/sharer/sharer.php?u=" + document.URL + i, a = "ING Direct - Facebook";
    else if ("twitter" === e) i = "?cid=som:twi:vis:shr", t = "https://twitter.com/intent/tweet?text=" + document.URL + i + " via @ING_AUST", a = "ING Direct - Twitter";
    else if ("googleplus" === e) i = "?cid=som:goo:vis:shr", t = "https://plus.google.com/share?url=" + document.URL + i, a = "ING Direct - Google Plus";
    else {
        if ("linkedin" !== e) return console.log("unknown sns provider: " + e), !1;
        i = "?cid=som:lnk:vis:shr", t = "https://www.linkedin.com/cws/share?url=" + document.URL + i, a = "ING Direct - LinkedIn"
    }
    var n = 600,
        r = 600,
        o = (screen.width / 2 - n / 2, screen.height / 2 - r / 2, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=" + n + ", height=" + r);
    return checkIE8() || checkIE9() ? window.open(t, "", o) : window.open(t, a, o), !1
}

function shareEmail() {
    var e = escape("\n"),
        t = $("title").text(),
        i = $('meta[property="og:url"]').attr("content") + "?cid=som:eml:vis:shr",
        a = "Sender: Please enter a personal message to yourself or a friend.";
    a += e + e, a += "Hi," + e + e, a += "I saw this and thought it might be of interest" + e + e, a += i + e + e;
    var n = "mailto:?subject=" + t + " &body=" + a;
    return window.location = n, !1
}

function adjustPagePosition() {
    var e = hashPrefix,
        t = window.location.hash,
        i = t.replace(e, "");
    if (t.length > 1 && 1 === $(i).size())
        if (mediaQuery === media_xs)
            if ("#more-about" === i || "#important-information" === i || "#generic-footer" === i) window.scrollTo(0, $(i).offset().top);
            else if (i.indexOf("content") > -1 || i.indexOf("home-quicklinks") > -1 || i.indexOf("home-everyday") > -1 || i.indexOf("home-savings") > -1 || i.indexOf("home-homeloans") > -1 || i.indexOf("home-super") > -1 || i.indexOf("home-business") > -1) {
        var a = $('.mobile-tab[data-target="' + i + '"]');
        a.addClass("active"), $(i).css("display", "block"), window.scrollTo(0, a.offset().top)
    } else {
        var n = $(i).offset().top;
        $("body, html").scrollTop(n)
    } else if (i.indexOf("content") > -1) {
        var r = '.ING-tab-header .tab-list > li > a[href="' + t + '"]';
        $(r).trigger("click")
    } else {
        var n = $(i).offset().top - headerBottomHeight;
        $("body, html").scrollTop(n)
    }
}

function checkAnchorTags() {
    $("a").on("click", function() {
        if (isNormalAnchorTag(this) === !0) {
            if (mediaQuery === media_xs) {
                var e = getContentId(this);
                if (null !== e) {
                    var t = "#" + hashPrefix,
                        i = t + e;
                    window.location.hash = i, navigator.userAgent.match("CriOS") && window.history.pushState({}, "", window.location.href)
                }
            }
            if (-1 !== $(this).attr("href").indexOf("#")) {
                var a = $(this).attr("href");
                if (-1 !== a.indexOf("#") && (a = a.slice(0, a.indexOf("#"))), window.location = $(this).attr("href"), resetMegaMenus(), refreshMegaMenus(), window.location.pathname === a) return adjustPagePosition(), !1
            }
        }
    })
}

function isNormalAnchorTag(e) {
    if ($(e).parents(".ING-tab-header .tab-list > li").length > 0) return !1;
    if ("undefined" != typeof $(e).attr("data-toggle")) return !1;
    var t = $(e).attr("href"),
        i = $(e).attr("target");
    return "#" === t || -1 !== t.indexOf("tel:") || "_blank" === i ? !1 : !0
}

function getContentId(e) {
    var t = $(e).parents(".ING-tab-body article .ING-content");
    if (0 !== t.length && "undefined" !== t.attr("id")) return t.attr("id");
    var i = $(e).parents("#home-quicklinks"),
        a = $(e).parents("#home-everyday"),
        n = $(e).parents("#home-savings"),
        r = $(e).parents("#home-homeloans"),
        o = $(e).parents("#home-super"),
        s = $(e).parents("#home-business");
    if (0 !== i.length) return i.attr("id");
    if (0 !== a.length) return a.attr("id");
    if (0 !== n.length) return n.attr("id");
    if (0 !== r.length) return r.attr("id");
    if (0 !== o.length) return o.attr("id");
    if (0 !== s.length) return s.attr("id");
    var l = $(e).parents("#more-about"),
        d = $(e).parents("#important-information"),
        c = $(e).parents("#generic-footer");
        f = $(e).parents("#sus-slider1");
        h = $(e).parents("#sus-slider2");
        return 0 !== l.length ? l.attr("id") : 0 !== d.length ? d.attr("id") : 0 !== c.length ? c.attr("id") : 0 !== f.length ? f.attr("id") : 0 !== h.length ? h.attr("id") : null
}

function initializeMegaMenus() {
    checkTouch() === !0 && ($(".ING-header .mega-dropdown-container").append("<div class='close-button'></div>"), $(".ING-header .mega-dropdown-container .close-button").on("click", function(e) {
        return e.preventDefault(), $(this).parents(".menu-cell").removeClass("active"), $(this).parents(".menu-cell").children(".mega-dropdown-container:visible").fadeOut("fast"), !1
    })), $("#btnAskSubmit").click(function() {
        return OpenIR($("#txtAsk").val()), !1
    }), $("#txtAsk").keydown(function(e) {
        13 === e.keyCode && $("#btnAskSubmit").click()
    })
}

function refreshMegaMenus() {
    var e = ".ING-header .menu-cell";
    resetMegaMenus(), mediaQuery === media_xs ? $(e + " > a").on("click", function(e) {
        return "undefined" == typeof $(this).data("target") ? void(window.location.href = $(this).attr("href")) : (e.preventDefault(), void($(this).parent().hasClass("active") === !1 ? ($(this).parent().addClass("active"), $(this).siblings(".mega-dropdown-container:hidden").slideDown("fast"), $(this).parent().siblings().each(function(e, t) {
            $(t).hasClass("active") === !0 && ($(t).removeClass("active"), $(t).children(".mega-dropdown-container:visible").slideUp("fast"))
        })) : ($(this).parent().removeClass("active"), $(this).siblings(".mega-dropdown-container:visible").slideUp("fast"))))
    }) : checkTouch() === !0 ? $(e).on("click", function(e) {
        if ($(this).hasClass("active") === !0) {
            var t = $(this).children("a").attr("href");
            return void(window.location.href = t)
        }
        return e.preventDefault(), $(this).addClass("active"), $(this).children(".mega-dropdown-container:hidden").fadeIn("fast"), $(this).siblings().each(function(e, t) {
            $(t).hasClass("active") === !0 && ($(t).removeClass("active"), $(t).children(".mega-dropdown-container:visible").fadeOut("fast"))
        }), !1
    }) : $(e).hover(function(e) {
        e.preventDefault(), $(this).addClass("hovered");
        var t = $(this);
        setTimeout(function() {
            t.hasClass("hovered") === !0 && (t.addClass("active"), t.children(".mega-dropdown-container:hidden").stop().fadeIn("fast"))
        }, 500)
    }, function(e) {
        e.preventDefault(), $(this).removeClass("hovered"), $(this).removeClass("active"), $(this).children(".mega-dropdown-container:visible").stop().fadeOut("fast")
    })
}

function resetMegaMenus() {
    var e = ".ING-header .menu-cell";
    $(e).unbind("click"), $(e).unbind("hover"), $(e).removeClass("active"), $(e + " .mega-dropdown-container").css("display", "none")
}

function initializeMobileMenuButtons() {
    $(mobileMenuButton).on("click", function(e) {
        e.preventDefault(), mediaQuery === media_xs && ($(this).hasClass("selected") === !1 ? ($(this).addClass("selected"), $(mobileMenuWrapper).addClass("active")) : ($(this).removeClass("selected"), $(mobileMenuWrapper).removeClass("active")))
    }), $(mobileSearchButton).on("click", function(e) {
        if (e.preventDefault(), mediaQuery === media_xs)
            if ($(this).hasClass("selected") === !1) {
                if ($("#mobile-search").size() < 1) {
                    var t = '<div id="mobile-search" class="mobile-search"><div class="container"><form action="/application/search.aspx" method="post"><div class="search-container"><input class="input-search" type="text" autocomplete="off" value="Ask us a question" id="txtAsk-m" name="Ask_IR" maxlength="60" onkeypress="return FilterSearchInput(event);" style="color: rgb(204, 204, 204);" onclick="this.style.color=\'#000\';" onfocus="if(this.value  == \'Ask us a question\') {this.value = \'\';}" onblur="if(this.value == \'\') {this.style.color=\'#ccc\';this.value = \'Ask us a question\'; }"><input class="input-button" type="image" src="/img/etc/search-glass.png" alt="Search" id="btnAskSubmit-m" name="btnAskSubmit" title="Search"></div></form></div></div>';
                    $(".ING-header").after(t), $("#btnAskSubmit-m").click(function() {
                        return OpenIR($("#txtAsk-m").val()), !1
                    }), $("#txtAsk-m").keydown(function(e) {
                        13 === e.keyCode && $("#btnAskSubmit-m").click()
                    })
                }
                $(this).addClass("selected"), $(".menu-buttons-container").css("border-bottom-color", "#2a2c2b"), $("#mobile-search").slideDown("fast")
            } else $(this).removeClass("selected"), $(".menu-buttons-container").removeAttr("style"), $("#mobile-search").slideUp("fast")
    }), $(mobileLoginButton).on("click", function(e) {
        return mediaQuery === media_xs ? (e.preventDefault(), onClickResponsiveLogin(), !1) : void 0
    })
}

function refreshMobileMenuButtons() {
    mediaQuery === media_xs && ($(mobileMenuButton).removeClass("selected"), $(mobileMenuWrapper).removeClass("active"), $(mobileSearchButton).removeClass("selected"), $("#mobile-search").removeAttr("style"))
}

function transformStickyHeader(e) {
    e !== statusStickyHeader && (statusStickyHeader = e, "normal" === statusStickyHeader ? ($(".ING-header").removeClass("sticky").removeClass("roll-up"), $(".ING-body").css("margin-top", 0)) : "sticky" === statusStickyHeader ? ($(".ING-header").addClass("sticky").removeClass("roll-up"), $(".ING-body").css("margin-top", headerHeight + "px")) : "roll-up" === statusStickyHeader ? ($(".ING-header").addClass("sticky").addClass("roll-up"), $(".ING-body").css("margin-top", headerHeight + "px"), resetMegaMenus(), refreshMegaMenus()) : console.log("Unknown status in transformStickyHeader(): " + statusStickyHeader))
}

function transformStickyTabHeader(e) {
    if (e !== statusStickyTabHeader)
        if (statusStickyTabHeader = e, "normal" === statusStickyTabHeader) $(".ING-tab-header").removeClass("sticky"), $(".tab-height-manager").css("padding-top", 0);
        else if ("sticky" === statusStickyTabHeader) {
        $(".ING-tab-header").addClass("sticky");
        var t = $(".ING-tab-header .tabs-wrapper").height();
        $(".tab-height-manager").css("padding-top", t + "px")
    } else console.log("Unknown status in transformStickyTabHeader(): " + statusStickyTabHeader)
}

function adjustStickyTabList() {
    if ("sticky" !== statusStickyTabHeader) return void $(".ING-tab-header .tab-list > li").removeClass("active");
    var e = $(".ING-tab-header .tabs-wrapper").offset().top + $(".ING-tab-header .tabs-wrapper").height(),
        t = -1;
    for (var i in stickyTabIds) {
        var a = $(stickyTabIds[i]).offset().top;
        e > a && (t = i)
    }
    t >= 0 ? $(".ING-tab-header .tab-list > li:eq(" + t + ")").addClass("active").siblings().removeClass("active") : $(".ING-tab-header .tab-list > li").removeClass("active")
}

function adjustStickyTabOrangeBar() {
    var e = $(".ING-tab-header .orange-bar").hasClass("invisible");
    if ("sticky" !== statusStickyTabHeader) return void(e === !1 && $(".ING-tab-header .orange-bar").addClass("invisible"));
    if (e === !0 && $(".ING-tab-header .orange-bar").removeClass("invisible"), 1 === $(".ING-tab-header .tab-list > li.active").size()) {
        var t = $(".ING-tab-header .tab-list > li.active").index(),
            i = $(".ING-tab-header .tab-list > li").size(),
            a = t / i * 100;
        $(".ING-tab-header .orange-bar").css("left", a + "%")
    }
}

function changeStickyHeaderUsingScrollUpEvent() {
    if ("sticky" === statusStickyTabHeader) {
        var e = $(window).scrollTop();
        mouseWheelPos > e ? ("roll-up" === statusStickyHeader && transformStickyHeader("sticky"), isScrollUpEvent = !0) : isScrollUpEvent = !1, mouseWheelPos = e
    }
}

function initializeStickyHeader() {
    $("#main-menu-button, #search-menu-button").on("click", function(e) {
        e.preventDefault(), mediaQuery >= media_sm && ("roll-up" === statusStickyHeader ? ("Firefox" === BrowserDetect.browser && (allowMegaDropdownMenu = !1), transformStickyHeader("sticky")) : console.log("Unexpected control in Sticky Header"))
    })
}

function updateStickyHeader() {
    var e = $("#additional-info-box").height(),
        t = $(".ING-tab-header").prev("div, section, article").height(),
        i = $(".ING-tab-header .heading-wrapper").height(),
        a = headerTopHeight + e + t + i;
    $(window).scrollTop() > a && $(".ING-tab-header").size() > 0 ? isScrollUpEvent === !1 && transformStickyHeader("roll-up") : transformStickyHeader($(window).scrollTop() > headerTopHeight + e ? "sticky" : "normal")
}

function refreshStickyHeader() {
    mediaQuery === media_xs && transformStickyHeader("normal")
}

function initializeStickyTabHeader() {
    stickyTabHeaderMaxHeight = $(".ING-tab-header").height(), $(".ING-tab-header .tab-list > li").each(function(e, t) {
        stickyTabIds[e] = $(t).children("a").attr("href").replace("ING-", "")
    });
    var e = $("<div/>").addClass("tab-height-manager");
    e.prependTo(".ING-body");
    var t = $(".ING-tab-header .tab-list > li").size(),
        i = 1 / t * 100;
    $("<div/>").addClass("orange-bar").addClass("invisible").css("width", i + "%").css("left", 0).appendTo(".ING-tab-header .tab-list"), $(".ING-tab-header .tab-list > li > a").on("click", function(e) {
        e.preventDefault();
        var t = stickyTabIds[$(this).parent().index()],
            i = $(t).offset().top - headerBottomHeight - $(".ING-tab-header .tabs-wrapper").height() + 1 + 40;
        isForcedScrolling = !0, transformStickyHeader("roll-up"), transformStickyTabHeader("sticky"), $(this).parent().addClass("active").siblings().removeClass("active"), adjustStickyTabOrangeBar();
        var a = Math.sqrt(Math.abs($(window).scrollTop() - i)) * pageScrollingWeight * 20;
        $("body, html").stop().animate({
            scrollTop: i
        }, a, "easeOutQuint", function() {
            isForcedScrolling = !1
        })
    })
}

function updateStickyTabHeader() {
    if (0 !== $(".ING-tab-header").size()) {
        var e = $("#additional-info-box").height(),
            t = $(".ING-tab-header").prev("div, section, article").height(),
            i = $(".ING-tab-header .heading-wrapper").height(),
            a = headerTopHeight + e + t + i;
        transformStickyTabHeader($(window).scrollTop() > a && $(".ING-header").hasClass("sticky") ? "sticky" : "normal"), adjustStickyTabList(), adjustStickyTabOrangeBar()
    }
}

function refreshStickyTabHeader() {
    mediaQuery === media_xs && transformStickyTabHeader("normal")
}

function initializeMobileContentTabs() {
    $(mobileContentTab).on("click", function(e) {
        e.preventDefault(); {
            var t = $(this).data("target");
            $(this).get(0)
        }
        $(this).hasClass("active") === !1 ? ($(this).addClass("active"), $(t).slideDown(durationFast)) : ($(this).removeClass("active"), $(t).slideUp(durationFast))
    })
}

function refreshMobileContentTabs() {
    $(mobileContentTab).each(mediaQuery === media_xs ? function(e, t) {
        var i = $(t).data("target");
        $(t).hasClass("active") === !0 ? $(i).show() : $(i).hide()
    } : function(e, t) {
        var i = $(t).data("target");
        $(i).removeAttr("style")
    })
}

function initializeHomePage() {
    $(".ING-people .tab-list > li").on("click", function(e) {
        function t() {
            $(".ING-people .content").removeAttr("style")
        }
        e.preventDefault();
        var i = $(this).data("target"),
            a = $(".ING-people .content-container").hasClass("active");
        if (a === !1) {
            $(this).addClass("active"), $(this).siblings("li").addClass("inactive"), updatePeopleHighlighter();
            var n = $("#home-archetype").offset().top - headerBottomHeight;
            $("body, html").stop().animate({
                scrollTop: n
            }, 400, "easeOutQuart", function() {
                $(i + ":hidden").slideDown(400, "easeInQuint", function() {
                    saveOpenPeopleStatus(!0), $(i).addClass("active").addClass("fade").addClass("in"), $(i).siblings().removeClass("active").removeClass("in").addClass("fade"), t()
                })
            })
        } else $(this).hasClass("active") === !1 ? ($(this).addClass("active").removeClass("inactive"), $(this).siblings("li.active").removeClass("active"), $(this).siblings("li").addClass("inactive"), updatePeopleHighlighter(), $(i).siblings(".active").removeClass("in"), setTimeout(function() {
            $(i).siblings(".active").removeClass("active"), $(i).addClass("active"), setTimeout(function() {
                $(i).addClass("in")
            }, 0)
        }, durationFast)) : ($(".ING-people .tab-list > li.active").removeClass("active"), updatePeopleHighlighter(), $(i + ":visible").slideUp(durationFast, function() {
            clearPeopleMenuAll()
        }))
    }), $(".ING-people .close-button").on("click", function(e) {
        e.preventDefault(), $(".ING-people .tab-list > li.active").removeClass("active"), updatePeopleHighlighter(), $(this).parent(":visible").slideUp(durationFast, function() {
            clearPeopleMenuAll()
        })
    })
}

function refreshHomePage() {
    if (mediaQuery === media_xs && (clearPeopleMenuAll(), updatePeopleHighlighter()), mediaQuery !== media_xs) {
        $(".dynamic-table-box .table-container .table").removeAttr("style");
        for (var e = $(".dynamic-table-box .table-container").size(), t = mediaQuery === media_sm ? 2 : 3, i = parseInt(e / t, 10), a = 0; i > a; a++) {
            for (var n = 0, r = 0, o = 0; t > o; o++) {
                r = t * a + o;
                var s = $(".dynamic-table-box .table-container:eq(" + r + ") .table").height();
                s > n && (n = s)
            }
            for (o = 0; t > o; o++) r = t * a + o, $(".dynamic-table-box .table-container:eq(" + r + ") .table").css("height", n + "px")
        }
    } else $(".dynamic-table-box .table-container .table").css("height", "auto");
    refreshHomeHeroSlider()
}

function clearPeopleMenuAll() {
    $(".ING-people .content").removeClass("active").removeClass("fade").removeClass("in").removeAttr("style"), $(".ING-people .tab-list > li").removeClass("active").removeClass("inactive").removeAttr("style"), saveOpenPeopleStatus(!1)
}

function saveOpenPeopleStatus(e) {
    e === !0 ? $(".ING-people .content-container").addClass("active") : $(".ING-people .content-container").removeClass("active")
}

function updatePeopleHighlighter() {
    if ($(".ING-people .tab-list > li.active").size() > 0) {
        var e = $(".ING-people .tab-list > li.active").index(),
            t = 20 * e;
        $(".ING-people .highlighter").css("left", t + "%").fadeIn(durationFast, function() {
            $(this).addClass("active")
        })
    } else $(".ING-people .highlighter").fadeOut(durationFast, function() {
        $(this).removeClass("active")
    })
}

function refreshMoreAboutSlider() {
    if (1 === $("#more-about-slider").size()) {
        var e, t, i, a;
        if (checkIE8() === !0) e = 220, t = 20, i = 4, a = 4;
        else if (mediaQuery === media_xs) e = 0, t = 0, i = 1, a = 1;
        else if (mediaQuery === media_sm) e = 224, t = 20, i = 3, a = 3;
        else if (mediaQuery === media_md) e = 220, t = 20, i = 4, a = 4;
        else {
            if (mediaQuery !== media_lg) return void console.log("unknown media query");
            e = 254, t = 30, i = 4, a = 4
        }
        null === moreAboutSlider ? createMoreAboutSlider(e, t, i, a) : reloadMoreAboutSlider(e, t, i, a)
    }
}

function createMoreAboutSlider(e, t, i, a) {
    moreAboutSliderLoaded = !1, moreAboutSlider = $("#more-about-slider").bxSlider({
        slideWidth: e,
        slideMargin: t,
        minSlides: i,
        maxSlides: a,
        startSlider: 0,
        nextText: "",
        prevText: "",
        adaptiveHeight: !0,
        pager: false,
        onSliderLoad: function() {
            moreAboutSliderLoaded = !0
        }
    })
}

function reloadMoreAboutSlider(e, t, i, a) {
    moreAboutSliderLoaded = !1, moreAboutSlider.reloadSlider({
        slideWidth: e,
        slideMargin: t,
        minSlides: i,
        maxSlides: a,
        startSlider: 0,
        nextText: "",
        prevText: "",
        pager: false,
        adaptiveHeight: !0,
        onSliderLoad: function () {
            moreAboutSliderLoaded = !0
        }
    })
}

function refreshSustainSlider() {
    if (1 === $("#sustain-slider1").size()) {
        var e, t, i, a;
        if (checkIE8() === !0) e = 220, t = 20, i = 4, a = 4;
        else if (mediaQuery === media_xs) e = 0, t = 0, i = 1, a = 1;
        else if (mediaQuery === media_sm) e = 224, t = 20, i = 3, a = 3;
        else if (mediaQuery === media_md) e = 220, t = 20, i = 4, a = 4;
        else {
            if (mediaQuery !== media_lg) return void console.log("unknown media query");
            e = 254, t = 30, i = 4, a = 4
        }
        null === susSlider ? createSustainSlider(e, t, i, a) : reloadSustainSlider(e, t, i, a)
    }
}

function createSustainSlider(e, t, i, a) {
    susSliderLoaded = !1, susSlider = $("#sustain-slider1").bxSlider({
        slideWidth: e,
        slideMargin: t,
        minSlides: i,
        maxSlides: a,
        startSlider: 0,
        nextText: "",
        prevText: "",
        adaptiveHeight: !0,
        pager: false,
        onSliderLoad: function () {
            susSliderLoaded22 = !0
        }
    })
}

function reloadSustainSlider(e, t, i, a) {
    susSliderLoaded = !1, susSlider.reloadSlider({
        slideWidth: e,
        slideMargin: t,
        minSlides: i,
        maxSlides: a,
        startSlider: 0,
        nextText: "",
        prevText: "",
        pager: false,
        adaptiveHeight: !0,
        onSliderLoad: function () {
            sustainSliderLoaded = !0
        }
    })
}

function refreshSustainSlider2() {
    if (1 === $("#sustain-slider2").size()) {
        var e, t, i, a;
        if (checkIE8() === !0) e = 220, t = 20, i = 4, a = 4;
        else if (mediaQuery === media_xs) e = 0, t = 0, i = 1, a = 1;
        else if (mediaQuery === media_sm) e = 224, t = 20, i = 3, a = 3;
        else if (mediaQuery === media_md) e = 220, t = 20, i = 4, a = 4;
        else {
            if (mediaQuery !== media_lg) return void console.log("unknown media query");
            e = 254, t = 30, i = 4, a = 4
        }
        null === susSlider2 ? createSustainSlider2(e, t, i, a) : reloadSustainSlider2(e, t, i, a)
    }
}

function createSustainSlider2(e, t, i, a) {
    susSliderLoaded2 = !1, susSlider2 = $("#sustain-slider2").bxSlider({
        slideWidth: e,
        slideMargin: t,
        minSlides: i,
        maxSlides: a,
        startSlider: 0,
        nextText: "",
        prevText: "",
        adaptiveHeight: !0,
        pager: false,
        onSliderLoad: function () {
            susSliderLoaded2 = !0
        }
    })
}

function reloadSustainSlider2(e, t, i, a) {
    susSliderLoaded2 = !1, susSlider2.reloadSlider({
        slideWidth: e,
        slideMargin: t,
        minSlides: i,
        maxSlides: a,
        startSlider: 0,
        nextText: "",
        prevText: "",
        pager: false,
        adaptiveHeight: !0,
        onSliderLoad: function () {
            sustainSliderLoaded2 = !0
        }
    })
}

function refreshFeaturesSlider() {
    if (1 === $("#features-slider").size()) {
        var e, t, i, a;
        if (mediaQuery === media_xs && null !== featuresSlider) return featuresSlider.destroySlider(), featuresSlider = null, $("#features-slider").addClass("reset-bx-slider"), void $(".content-features-slider").removeClass("ready");
        if (mediaQuery === media_sm) e = 237.3333333333333, t = 0, i = 3, a = 3;
        else if (mediaQuery === media_md) e = 235, t = 0, i = 4, a = 4;
        else {
            if (mediaQuery !== media_lg) return void console.log("unknown media query: " + mediaQuery);
            e = 276.5, t = 0, i = 4, a = 4
        }
        null === featuresSlider ? ($("#features-slider").removeClass("reset-bx-slider"), featuresSliderLoaded = !1, featuresSlider = $("#features-slider").bxSlider({
            slideWidth: e,
            slideMargin: t,
            minSlides: i,
            maxSlides: a,
            startSlider: 0,
            nextText: "",
            prevText: "",
            adaptiveHeight: !1,
            infiniteLoop: !1,
            hideControlOnEnd: !0,
            onSliderLoad: function() {
                featuresSliderLoaded = !0, $("ul.features-slider").css("display", "block"), $(".content-features-slider").addClass("ready")
            }
        })) : (featuresSliderLoaded = !1, featuresSlider.reloadSlider({
            slideWidth: e,
            slideMargin: t,
            minSlides: i,
            maxSlides: a,
            startSlider: 0,
            nextText: "",
            prevText: "",
            adaptiveHeight: !1,
            infiniteLoop: !1,
            hideControlOnEnd: !0,
            onSliderLoad: function() {
                featuresSliderLoaded = !0, $("ul.features-slider").css("display", "block"), $(".content-features-slider").addClass("ready")
            }
        }))
    }
}

function refreshHomeHeroSlider() {
    return 1 === $("#home-hero-slider").size() ? mediaQuery >= media_md || checkIE8() === !0 ? void(null !== homeHeroSlider && (homeHeroSlider.destroySlider(), homeHeroSlider = null, $("#home-hero-slider").addClass("reset-bx-slider"))) : void(null === homeHeroSlider ? ($("#home-hero-slider").removeClass("reset-bx-slider"), homeHeroSliderLoaded = !1, $(".ING-home-slider").css({
        height: "1px",
        overflow: "hidden"
    }), homeHeroSlider = $("#home-hero-slider").bxSlider({
        auto: !0,
        onSliderLoad: function() {
            homeHeroSliderLoaded = !0, $(".ING-home-slider").removeAttr("style")
        }
    })) : (homeHeroSliderLoaded = !1, homeHeroSlider.reloadSlider({
        auto: !0,
        onSliderLoad: function() {
            homeHeroSliderLoaded = !0
        }
    }))) : void 0
}

function showAllLivingSuperCollapse() {
    var e = $("#living-super-accordion li.panel.active").index(); - 1 !== e && (livingSuperSelectedIndex = e), $("#living-super-accordion li.panel").removeClass("active").find(".slide-content").show()
}

function setInitialSelectedState() {
    $("#living-super-accordion li.panel:eq(" + livingSuperSelectedIndex + ")").find(".slide-handle").hide(), $("#living-super-accordion li.panel:eq(" + livingSuperSelectedIndex + ")").siblings().find(".slide-handle").show()
}

function onTriggerSlide() {
    this.children(".slide-handle").fadeOut("fast").end().parent().siblings().find(".slide-handle").stop(!1, !0).fadeIn("fast"), livingSuperSelectedIndex = this.parent().index()
}

function createLivingSuperAccordion(e, t, i, a) {
    1 === $("#living-super-accordion").size() && (showAllLivingSuperCollapse(), accordionLivingSuper = $("#living-super-accordion").liteAccordion({
        firstSlide: livingSuperSelectedIndex + 1,
        containerWidth: e,
        containerHeight: t,
        slideSpeed: 300,
        headerWidth: i,
        contentWidth: a,
        theme: "living-super",
        onTriggerSlide: onTriggerSlide
    }), setInitialSelectedState())
}

function destroyLivingSuperAccordion() {
    null !== accordionLivingSuper && ($("#living-super-accordion").liteAccordion("destroy"), accordionLivingSuper = null, $("#living-super-accordion li.panel .slide-handle").removeAttr("style"))
}

function refreshLivingSuperAccordion() {
    return checkIE8() === !0 ? void(null === accordionLivingSuper && createLivingSuperAccordion(880, 532, 144, 592)) : (destroyLivingSuperAccordion(), void(mediaQuery === media_xs ? refreshLivingSuperCollapse() : mediaQuery === media_sm ? createLivingSuperAccordion(672, 502, 102, 468) : mediaQuery === media_md ? createLivingSuperAccordion(880, 532, 144, 592) : mediaQuery === media_lg && createLivingSuperAccordion(1040, 532, 156, 728)))
}

function refreshLivingSuperCollapse() {
    $("#living-super-accordion li.panel:eq(" + livingSuperSelectedIndex + ")").addClass("active").find(".slide-content").show(), $("#living-super-accordion li.panel:eq(" + livingSuperSelectedIndex + ")").siblings().removeClass("active").find(".slide-content").hide(), $("#living-super-accordion li.panel .title-container").unbind("click"), $("#living-super-accordion li.panel .title-container").on("click", function(e) {
        if (e.preventDefault(), mediaQuery === media_xs) {
            var t = $(this).data("target");
            $(t).parent().parent().hasClass("active") === !0 ? (console.log("has active"), $(t).parent().parent().removeClass("active"), $(t).slideUp("fast"), livingSuperSelectedIndex = 0) : (console.log("does not have active"), $(t).parent().parent().addClass("active"), $(t).slideDown("fast"), $(t).parent().parent().siblings().removeClass("active"), $(t).parent().parent().siblings().find(".slide-content").slideUp("fast"), livingSuperSelectedIndex = $(t).parent().parent().index())
        }
    })
}

function initializeLivingSuperContent() {
    $("#living-super-accordion .bottom-title-bar").on("click", function(e) {
        if (e.preventDefault(), onClickPopOverClose(), $(this).parent().hasClass("active") === !0) $(this).parent().removeClass("active"), Modernizr.csstransitions === !1 && $(this).parent().animate({
            top: 0
        }, "normal");
        else if ($(this).parent().addClass("active"), Modernizr.csstransitions === !1) {
            var t = 0;
            mediaQuery === media_sm ? t = -422 : mediaQuery >= media_md && (t = -422), $(this).parent().animate({
                top: t + "px"
            }, "normal")
        }
    }), $("#living-super-accordion .detail-info-selector").on("click", function(e) {
        e.preventDefault();
        var t = !1;
        if ($(this).parent().siblings(".horizontal-sliding-container").each(function(e, i) {
                $(i).hasClass("active") === !0 && (t = !0)
            }), t === !1) {
            var i = $(this).data("target");
            $(i).addClass("active"), Modernizr.csstransitions === !1 && $(i).animate({
                left: 0
            }, "normal")
        }
    }), $("#living-super-accordion .horizontal-sliding-container .close-button").on("click", function(e) {
        e.preventDefault(), $(this).parent().parent().removeClass("active"), Modernizr.csstransitions === !1 && $(this).parent().parent().animate({
            left: "100%"
        }, "normal")
    }), $("#living-super-accordion .slide-handle").on("click", function(e) {
        e.preventDefault(), onClickPopOverClose()
    })
}

function initializeOeCalculator() {
    if (1 === $("#oe-calculator").size()) {
        var e = parseInt($("#txtCoffee").val(), 10),
            t = parseInt($("#txtPetrol").val(), 10),
            i = parseInt($("#txtGroceries").val(), 10),
            a = parseInt($("#txtTaxi").val(), 10);
        $("#expense1").noUiSlider({
            range: [0, 100],
            start: e,
            step: 1,
            handles: 1,
            serialization: {
                to: $("#txtCoffee")
            },
            slide: onSlideInOeCalculator,
            set: onClickInOeCalculator
        }), $("#expense2").noUiSlider({
            range: [0, 1e3],
            start: t,
            step: 10,
            handles: 1,
            serialization: {
                to: $("#txtPetrol")
            },
            slide: onSlideInOeCalculator,
            set: onClickInOeCalculator
        }), $("#expense3").noUiSlider({
            range: [0, 500],
            start: i,
            step: 10,
            handles: 1,
            serialization: {
                to: $("#txtGroceries")
            },
            slide: onSlideInOeCalculator,
            set: onClickInOeCalculator
        }), $("#expense4").noUiSlider({
            range: [0, 800],
            start: a,
            step: 10,
            handles: 1,
            serialization: {
                to: $("#txtTaxi")
            },
            slide: onSlideInOeCalculator,
            set: onClickInOeCalculator
        })
    }
}

function refreshOeCalculator() {
    updateSliderValuesInOe("#expense1"), updateSliderValuesInOe("#expense2"), updateSliderValuesInOe("#expense3"), updateSliderValuesInOe("#expense4"), calculateOeTotal()
}

function updateSliderValuesInOe(e) {
    var t = $(e).find(".noUi-origin-lower").css("left");
    $(e).parent().find(".slider-arrow").css("left", t);
    var i = $(e).parents(".sliderRow").data("labelfield"),
        a = $($(e).parents(".sliderRow").attr("data-valuefield")).val();
    $(i + " span").html(Math.round(a))
}

function calculateOeTotal() {
    var e = 2,
        t = 12,
        i = 4.34812 * t,
        a = parseInt($("#txtCoffee").val(), 10),
        n = parseInt($("#txtPetrol").val(), 10),
        r = parseInt($("#txtGroceries").val(), 10),
        o = parseInt($("#txtTaxi").val(), 10),
        s = a * i * (e / 100);
    s += n * i * (e / 100), s += r * i * (e / 100), s += o * i * (e / 100), $("#txtTotal").html(s.toFixed(2)), $("#txtTotal2").html(s.toFixed(2))
}

function onSlideInOeCalculator() {
    updateSliderValuesInOe(this), calculateOeTotal()
}

function onClickInOeCalculator() {
    setTimeout(function() {
        updateSliderValuesInOe(this), calculateOeTotal()
    }, 300)
}

function initializeMoreContents() {
    initializeDisclaimer(), initializeMoreFeatures()
}

function refreshMoreContents() {
    refreshDisclaimer()
}

function initializeDisclaimer() {
    $(".ING-footer .important-information .read-more").on("click", function(e) {
        e.preventDefault(), $(this).addClass("active"), $(".ING-footer .important-information .collapsed").addClass("active")
    })
}

function refreshDisclaimer() {
    $(".ING-footer .important-information .read-more").removeClass("active"), $(".ING-footer .important-information .collapsed").removeClass("active")
}

function initializeMoreFeatures() {
    $('a[data-toggle="collapse"].more-features-style').on("click", function(e) {
        e.preventDefault(), $(this).fadeOut("fast")
    })
}

function initializeTabHighlighter() {
    $('.content-tab-style > li > a[data-toggle="tab"]').on("show.bs.tab", function() {
        var e = $(this).parents(".content-tab-style").children("li").size() - 1,
            t = 100 / e,
            i = $(this).parent().index() * t;
        $(this).parent().siblings(".highlighter").css("left", i + "%")
    })
}

function initializeTooltipComponents() {
    $("[data-toggle=tooltip]").tooltip(checkTouch() === !0 ? {
        trigger: "click",
        html: "true"
    } : {
        trigger: "hover",
        html: "true",
        container: "body"
    })
}

function initializePopOverComponents() {
    $('[data-toggle="popover"]').popover({
        trigger: "manual",
        html: "true"
    }), $('[data-toggle="popover"]').on("click", function(e) {
        e.preventDefault(), "true" === $(this).data("shown") ? ($(this).data("shown", "false"), $(this).removeClass("active"), $(this).popover("hide")) : (onClickPopOverClose(), $(this).data("shown", "true"), $(this).addClass("active"), $(this).popover("show"))
    }), $('[data-toggle="collapse"]').each(function(e, t) {
        $($(t).attr("href")).on("hide.bs.collapse", function() {
            onClickPopOverClose()
        })
    }), $('a[data-toggle="tab"]').on("show.bs.tab", function() {
        onClickPopOverClose()
    })
}

function onClickPopOverClose() {
    $("[data-toggle=popover]").each(function(e, t) {
        "true" === $(t).data("shown") && ($(t).data("shown", "false"), $(t).removeClass("active"), $(t).popover("hide"))
    })
}

function initializeFaqScroller() {
    $('[data-toggle="scroller"]').on("click", function(e) {
        e.preventDefault();
        var t = $(this).attr("href"),
            i = $(t).offset().top - headerBottomHeight;
        1 === $(".ING-tab-header").size() && (i = $(t).offset().top - (headerBottomHeight + $(".ING-tab-header .tabs-wrapper").height())), $("body, html").stop().animate({
            scrollTop: i
        }, 500, "easeOutQuint")
    })
}

function onClickResponsiveLogin() {
    if (mediaQuery === media_xs) {
        var e = "/mobile-login.html";
        window.location.href = e
    } else OpenClient();
    return !1
}

function onClickMobileApp() {
    var e = "https://itunes.apple.com/au/app/ing-direct-australia-banking/id427100193?mt=8&ign-mpt=uo%3D4",
        t = "https://play.google.com/store/apps/details?id=au.com.ingdirect.android",
        i = "http://www.windowsphone.com/en-au/store/app/ing-direct/3e80e3bb-ed81-4ec1-af60-0b185a21b670";
    if (jQuery.browser.mobile === !0) {
        var a = navigator.userAgent,
            n = "";
        if (a.indexOf("Android") >= 0) n = t;
        else if (a.indexOf("iPhone") >= 0 || a.indexOf("iPod") >= 0) n = e;
        else {
            if (!(a.indexOf("IEMobile") >= 0)) return !1;
            n = i
        }
        var r = window.open(n, "_blank");
        r.focus()
    }
    return !1
}

function changedMediaQuery() {
    var e, t = $(window).width();
    return e = checkIE8() === !0 ? media_md : minTablet > t ? media_xs : minMiddle > t ? media_sm : minLarge > t ? media_md : media_lg, e !== mediaQuery ? (mediaQuery = e, !0) : !1
}

function checkIE8() {
    return $("html").hasClass("ie8")
}

function checkIE9() {
    return $("html").hasClass("ie9")
}

function checkOldIE() {
    var e = navigator.userAgent.toLowerCase();
    (e.match(/windows nt 5.1/) || e.match(/windows nt 6.0/) || e.match(/windows nt 5.2/)) && $.browser.msie && $.browser.version <= 7 && ($(".box").append("<p style='text-align:center;'>We have detected that you are using Internet Explorer 7. It has known <strong>security flaws</strong> and may <strong>not display all features</strong> of this and other websites.<br />Please upgrade to one of the following - <a href='http://www.microsoft.com/en-au/download/internet-explorer-8-details.aspx' target='_blank'>Internet Explorer</a>, <a href='http://www.mozilla.org/en-US/firefox/new/' target='_blank'>Firefox</a>, <a href='http://www.apple.com/au/safari/' target='_blank'>Safari</a> and <a href='http://www.google.com/chrome/' target='_blank'>Chrome</a>.</p><div class='close_box style='text-align:right;cursor:pointer;float:right;margin-right:50px;'>&times;</div>"), $(".box").slideDown("slow"), $(".close_box").click(function() {
        $(".box").slideUp("slow")
    }))
}

function checkCssTransitions() {
    return $("html").hasClass("csstransitions")
}

function checkDEBUG() {
    return $("html").hasClass("DEBUG")
}

function checkTouch() {
    return Modernizr.touch || "ontouchstart" in window || navigator.msMaxTouchPoints > 0
}

function OSDetect() {
    -1 !== navigator.appVersion.indexOf("Win") ? OSName = "Windows" : -1 !== navigator.appVersion.indexOf("Mac") ? OSName = "MacOS" : -1 !== navigator.appVersion.indexOf("X11") ? OSName = "UNIX" : -1 !== navigator.appVersion.indexOf("Linux") && (OSName = "Linux")
}

function initializeSizeMonitor() {
    var e = $('<div class="size-monitor"/>').append('<p id="debug_browser-width">width: 0px</p>').append('<p id="debug_browser-height">height: 0px</p>').append('<p class="visible-xs">[Mobile]</p>').append('<p class="visible-sm">[Tablet]</p>').append('<p class="visible-md">[Desktop]</p>').append('<p class="visible-lg">[Large Desktop]</p>');
    e.prependTo("body")
}

function refreshSizeMonitor() {
    $("#debug_browser-width").text("width: " + $(document).width() + "px"), $("#debug_browser-height").text("height: " + $(document).height() + "px")
}! function() {
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var e = document.createElement("style");
        e.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}")), document.getElementsByTagName("head")[0].appendChild(e)
    }
}();
var minTablet = 768,
    minMiddle = 980,
    minLarge = 1200,
    media_xs = 0,
    media_sm = 1,
    media_md = 2,
    media_lg = 3,
    mediaQuery = -1,
    durationNormal = 500,
    durationFast = 300,
    hashPrefix = "ING-",
    mobileMenuButton = "#main-menu-button",
    mobileMenuWrapper = ".mobile-side-wrapper",
    mobileLoginButton = "#login-menu-button",
    mobileSearchButton = "#search-menu-button",
    headerTopHeight = 80,
    headerBottomHeight = 58,
    headerHeight = headerTopHeight + headerBottomHeight,
    statusStickyHeader = "normal",
    statusStickyTabHeader = "normal",
    stickyTabIds = [],
    isForcedScrolling = !1,
    pageScrollingWeight = 1,
    allowMegaDropdownMenu = !1;
$(document).ready(function() {
    OSDetect(), initializeComponents(), $(window).trigger("resize"), $(window).trigger("scroll"), setTimeout(function() {
        adjustPagePosition()
    }, 100)
}), $(window).resize(function(e) {
    refreshResponsiveComponents(e)
}), $(window).scroll(function(e) {
    updateScrollingComponents(e)
}), checkTouch() ? $(".ING-share-button").on("click", function(e) {
    e.preventDefault(), $(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active")
}) : $(".ING-share-button").hover(function() {
    $(this).addClass("active")
}, function() {
    $(this).removeClass("active")
});
var mouseWheelPos = 0,
    isScrollUpEvent = !1,
    mobileContentTab = ".mobile-tab",
    moreAboutSlider = null,
    moreAboutSliderLoaded = !1,
    susSlider = null,
    susSliderLoaded = !1,
    susSlider2 = null,
    susSliderLoaded2 = !1,
    featuresSlider = null,
    featuresSliderLoaded = !1,
    homeHeroSlider = null,
    homeHeroSliderLoaded = !1,
    accordionLivingSuper = null,
    livingSuperSelectedIndex = 0;
$('a[data-toggle="popup-window"]').on("click", function(e) {
    e.preventDefault();
    var t = 600,
        i = 600;
    "large" === $(this).data("size") ? (t = 900, i = 800) : "call" === $(this).data("size") && (t = 285, i = 385);
    var a = (screen.width / 2 - t / 2, screen.height / 2 - i / 2, $(this).attr("href")),
        n = "popup",
        r = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=" + t + ", height=" + i;
    window.open(a, n, r)
}), $('a[data-toggle="new-tab-page"]').on("click", function(e) {
    e.preventDefault();
    var t = $(this).attr("href"),
        i = window.open(t, "_blank");
    i.focus()
});
var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "Other", this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown"
    },
    searchString: function(e) {
        for (var t = 0; t < e.length; t++) {
            var i = e[t].string;
            if (this.versionSearchString = e[t].subString, -1 !== i.indexOf(e[t].subString)) return e[t].identity
        }
    },
    searchVersion: function(e) {
        var t = e.indexOf(this.versionSearchString);
        if (-1 !== t) return parseFloat(e.substring(t + this.versionSearchString.length + 1))
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.userAgent,
        subString: "Safari",
        identity: "Safari"
    }, {
        string: navigator.userAgent,
        subString: "Opera",
        identity: "Opera"
    }]
};
BrowserDetect.init();
var OSName = "Unknown OS";