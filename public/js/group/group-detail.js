/**
 * Created by haojin on 2016/4/14 0020.
 */
$(function(){
    var follow = $('#follow').val();
    if(follow=='true'){
        $('.not-follow').hide();
    }else{
        $('.has-follow').hide();
        $('.cancel').hide();
    }
    $('.icon-edit,.post-add').click(function(){
        $('#group_info').submit();
    });
    $('.cancel').click(function(){
        var groupId = $('#group_id').val();
        var param = {
            groupId: groupId
        };
        $.ajax({
            url: '/follow-delete/api',
            type: 'POST',
            dataType: 'json',
            data: param,
            success:function(data){
                if(data.state==1){
                    layer.msg('已取消关注');
                    $('.has-follow').hide();
                    $('.cancel').hide();
                    $('.not-follow').show();
                }
            },
            error:function(error){

            }
        });

    });
    $('.not-follow').click(function(e){
        var groupId =$('#group_id').val();
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
                    layer.msg('关注成功');
                    $('.not-follow').hide();
                    $('.has-follow').show();
                    $('.cancel').show();
                }
            },
            error:function(error){

            }
        });
    });
});

