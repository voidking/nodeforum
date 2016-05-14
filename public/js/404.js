/**
 * Created by haojin on 2016/4/9 0009.
 */

$(function(){
    var time = 5;
    window.show = function(){
        var $jump = $('.pic .jump');
        var host = $jump.attr('data-host');
        $jump.find('span').html(time);
        time--;
        if (time == 0) {
            window.opener = null;
            window.location.href = host;
        }
        else {
            window.setTimeout('show()', 1000);
        }
    }
    window.setTimeout('show()',1000);
});
