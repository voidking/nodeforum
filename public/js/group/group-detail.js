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
    // 取消关注
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
    // 关注
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

    // 分页
    var groupId = $('#group_id').val();
    var pageSize = 9;
    $.ajax({
        url: '/post-get-page/api',
        type: 'POST',
        dataType: 'json',
        data: {
            groupId: groupId,
            pageSize: pageSize,
            pageIndex: 1
        },
        success: function(data){
            laypage({
                cont: 'page', //容器。值支持id名、原生dom对象，jquery对象,
                pages: data.pageTotal, //总页数
                groups: 0, //连续分数数0
                prev: false, //不显示上一页
                next: '查看更多',
                skin: 'flow', //设置信息流模式的样式
                jump: function(obj){
                    if(obj.curr === data.pageTotal-1){
                        this.next = '没有更多了';
                    }
                    $.ajax({
                        url: '/post-get-page/api',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            groupId: groupId,
                            pageSize: pageSize,
                            pageIndex: obj.curr
                        },
                        success: function(data){
                            var html = template('block_template',data);
                            $('.blocks').append(html);
                        },
                        error: function(xhr){
                            console.log(xhr);
                        }
                    });
                }
            });
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
});

