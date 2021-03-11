$(document).ready(function() {
    if (!Modernizr.csstransitions) {
        initializeTabs_NOCSSTRANSITIONS();
    }
    initializeCollapses_NOCSSTRANSITIONS();
});

function initializeTabs_NOCSSTRANSITIONS () {
    var objects = 'a[data-toggle="tab"]';

    // clean up css3 transition effect
    $(objects).each(function(index, el) {
        $(el).attr({ 'data-toggle': 'no-csstransitions-tab' });
        
        var target = $(el).attr('href');
        $(target).removeClass('fade').removeClass('in');
        if($(target).hasClass('active')) {
            $(target).css('display', 'block');
        } else {
            $(target).css('display', 'none');
        }
    });

    // use jQuery Fade In/Out
    $('a[data-toggle="no-csstransitions-tab"]').on('click', function(event) {
        event.preventDefault();

        if($(this).parent().hasClass('active'))
            return;
        
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');

        var target = $(this).attr('href');
        console.log($(target).siblings('div'));

        $(target).siblings('.active').fadeOut(150, function() {
            $(this).removeClass('active');
            $(target).addClass('active');
            $(target).fadeIn(150);
        });
    });
}

function initializeCollapses_NOCSSTRANSITIONS () {
    var objects = 'a[data-toggle="collapse"]';

    // clean up css3 transition effect
    $(objects).each(function(index, el) {
        $(el).attr({ 'data-toggle' : 'no-csstransitions-collapse' });

        var target = $(el).attr('href');
        $(target).removeClass('collapse').removeClass('in');

        if($(el).parents('li.panel').hasClass('active')) {
            $(target).css('display', 'block');            
        } else {
            $(target).css('display', 'none');
        }
    });

    // use jQuery Slide Down/Up
    $('a[data-toggle="no-csstransitions-collapse"]').on('click', function(event) {
        event.preventDefault();

        if($(this).parent().hasClass('active'))
            return;
        
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');

        var target = $(this).attr('href');
        console.log($(target).siblings('div'));

        $(target).siblings('.active').fadeOut(150, function() {
            $(this).removeClass('active');
            $(target).addClass('active');
            $(target).fadeIn(150);
        });
    });
}