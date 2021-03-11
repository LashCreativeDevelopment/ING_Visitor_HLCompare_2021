function refreshArticleside() { $('.aside-part').removeAttr('style'); }
function initializeArticleside() {
    
    $(window).scroll(function () {
        if (mediaQuery >= media_md || checkIE8() === false) {
            var aside = $('.aside-part');
            $('.aside-part').css({ 'position': 'fixed', 'right': '20px' });
            var length = $('.ING-content').height();
            var bread = $('.content-hero.simple').height() + $('.front-header').height();
            var off = $('.ING-content').offset().top;
            var scroll = $(this).scrollTop();
            var height = $('.aside-part').height() + 'px';

            if (scroll < off - bread) { //
                $('.aside-part').css({
                    'position': 'fixed',
                    'right': '20px',
                    'top': off - scroll + 'px'
                });
            } else if (scroll > length - bread) { //
                $('.aside-part').css({
                    'position': 'absolute',
                    'bottom': '100px',
                    'top': 'auto'
                });
            } else {
                //$('.aside-part').css({
                //    'position': 'fixed',
                //    'top': bread,
                //    'right': '20px'
                //});
            }
        } else { $('.aside-part').removeAttr('style'); }
    });
    
};