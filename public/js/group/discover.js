/**
 * Created by haojin on 2016/4/14 0020.
 */
$(function(){
    $('.title-select .tab-title').click(function(){
        $(this).addClass('active');
        $('.title-select .tab-title').not($(this)).removeClass('active');
        var id = $(this).attr('data-id');
        var $content = $('.blocks').find('#'+id);
        $content.show();
        $('.tab').not($content).hide();
    });

    $('#group .item .follow').click(function(e){
        var $that = $(this);
        e.preventDefault();
        var groupId = $(this).attr('id');
        var param = {
            groupId: groupId
        };
        $.ajax({
            url: '/follow-add/api',
            type: 'POST',
            dataType: 'json',
            data: param,
            success:function(data){
                if(data.state==1){
                    $that.hide();
                }
            },
            error:function(error){

            }
        });
    });
});