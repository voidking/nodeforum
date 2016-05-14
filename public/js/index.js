/**
 * Created by haojin on 2016/3/20 0020.
 */
$(function(){
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });

    var error = $('#error').val();
    if(error){
        layer.alert(error, {
            skin: 'layui-layer-lan' //样式类名
            ,closeBtn: 0
        });
    }
});