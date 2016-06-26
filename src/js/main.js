var Site = {};

Site.launchFullscreen = function(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

Site.exitFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

//http://stackoverflow.com/questions/5680013/how-to-be-notified-once-a-web-font-has-loaded
Site.waitForWebfonts = function(fonts, callback) {
    var loadedFonts = 0;
    var i;

    function doNode(font) {
        var node = document.createElement('span');
        var width = node.offsetWidth;
        var interval;

        // Characters that vary significantly among different fonts
        node.innerHTML = 'Haowu Ge\ue800';

        // Visible - so we can measure it - but not on the screen
        node.style.position = 'absolute';
        node.style.left = '-10000px';
        node.style.top = '-10000px';

        // Large font size makes even subtle changes obvious
        node.style.fontSize = '300px';

        // Reset any font properties
        node.style.fontFamily = 'sans-serif';
        node.style.fontVariant = 'normal';
        node.style.fontStyle = 'normal';
        node.style.fontWeight = 'normal';
        node.style.letterSpacing = '0';
        document.body.appendChild(node);

        // Remember width with no applied web font
        width = node.offsetWidth;

        node.style.fontFamily = font;

        function checkFont() {

            // Compare current width with original width
            if (node && node.offsetWidth !== width) {
                ++loadedFonts;
                node.parentNode.removeChild(node);
                node = null;
            }

            // If all fonts have been loaded
            if (loadedFonts >= fonts.length) {
                if (interval) {
                    clearInterval(interval);
                }
                if (loadedFonts === fonts.length) {
                    callback();
                    return true;
                }
            }
        }

        if (!checkFont()) {
            interval = setInterval(checkFont, 50);
        }
    }

    for (i = 0, l = fonts.length; i < l; ++i) {
        doNode(fonts[i]);
    }
};
Site.show = function() {
    $('.loading').parent('.mask').addClass('fadeOut');
    setTimeout(function() {
        $('.loading').parent('.mask').css('display', 'none');
    }, 1000);
};
Site.init = function() {
    if (Site.skrollr) {
        Site.skrollr.refresh();
    } else {
        Site.skrollr = skrollr.init({
            forceHeight: false,
            smoothScrolling: true,
            smoothScrollingDuration: 200,
            mobileDeceleration: 0.001
        });
    }
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
            document.title = '别忘了回来再看看我的简历哦 | 葛豪武的个人简历';
        } else {
            document.title = '葛豪武的个人简历';
        }
    });
    Site.waitForWebfonts(['Muli-Light', 'Fredericka-the-Great', 'resume-icon'], function() {
        Site.show();
    });
    setTimeout(function() {

        // 字体超时加载超时后,依然显示站点
        Site.show();
    }, 5000);
};

$(function() {

    // TODO: 增加项目
    var $email = $('.email'),
    $qrcode = $('.qrcode'),
    realMail = $email.data('text').join(''),
    fullscreenEnabled;

    $email.text(realMail).parent('.connect-item').attr({
        href: 'mailto:' + realMail
    });

    $('.resume').on('click', function() {
        if (fullscreenEnabled) {
            Site.exitFullscreen();
            fullscreenEnabled = false;
            _hmt.push(['_trackEvent', 'resume', 'exitFullscreen', 'resume', '1']);
        } else {
            Site.launchFullscreen(document.documentElement);
            fullscreenEnabled = true;
            _hmt.push(['_trackEvent', 'resume', 'launchFullscreen', 'resume', '1']);
        }
    });

    $('.skill-bar').forEach(function(bar) {
        var $bar = $(bar);

        $bar.css('width', $bar.data('width'));
    });

    $('.trip-item').on('click', function() {
        $(this).next('.trip-item-detail').addClass('zoomIn').show();
        _hmt.push(['_trackEvent', 'trip-item', 'click', $(this).find('.job').text(), '1']);
    });

    $('.trip-item-close').on('click', function() {
        $(this).parent('.trip-item-detail').removeClass('zoomIn').hide();
    });

    $('.rocket').on('click', function() {
        var $rocket = $(this);

        $rocket.addClass('launch');
        Site.skrollr.animateTo(0, {
            duration: 600
        });
        setTimeout(function() {
            $rocket.removeClass('launch');
        }, 600);
        _hmt.push(['_trackEvent', 'rocket', 'gotoTop', 'gotoTop', '0']);
    });

    $('.wechat').on('click', function(e) {
        $qrcode.css('display', 'block');
        e.preventDefault();
        _hmt.push(['_trackEvent', 'wechat', 'open', 'wechat', '1']);
    });

    $qrcode.on('click', function() {
        $qrcode.css('display', 'none');
        _hmt.push(['_trackEvent', 'wechat', 'close', 'wechat', '0']);
    });

    $('.connect-item').on('click', function() {
        _hmt.push(['_trackEvent', 'connect', 'click', $(this).attr('title'), '1']);
    });

    Site.init();

});
