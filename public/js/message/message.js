/**
 * Created by haojin on 2016/4/14 0020.
 */
$(function(){
    // 即时通讯
    var socket = io.connect();
    var from_user = $('#from-user').val();
    socket.emit("adduser",from_user,function(data){
        console.log(data);
    });

    $('.title-select .tab-title').click(function(){
        $(this).addClass('active');
        $('.title-select .tab-title').not($(this)).removeClass('active');
        var id = $(this).attr('data-id');
        var $content = $('.blocks').find('#'+id);
        $content.show();
        $('.tab').not($content).hide();
        if($(this).hasClass('letter-title')){
            $('.title-select .write-private').show();
        }else{
            $('.title-select .write-private').hide();
        }
    });

    $('#letter').on('click','.block',function(){
        var $that = $(this);
        var friend_id = $(this).find('#friend-id').val();
        var friendname = $(this).find('#friendname').val();
        $.ajax({
            url: '/message-get/api',
            type: 'POST',
            dataType: 'json',
            data: {
                friend_id: friend_id
            },
            success: function(data){
                if(data.state == 1){
                    var html = template('chat_template',data);
                    $('#chat').html(html);
                    var index = layer.open({
                        type: 1,
                        title: '与'+ friendname + '聊天中',
                        skin: 'layui-layer-demo', //样式类名
                        closeBtn: 1, //不显示关闭按钮
                        shift: 2,
                        shadeClose: true, //开启遮罩关闭
                        content: $('#chat')
                    });
                }
            },
            error: function(xhr){
            }
        });
        $('#chat').unbind().on('click','.sendmsg',function(){
            var from_user = $('#from-user').val();
            var to_user = friend_id;
            var content = $('#chat .reply-content').val();
            var data = {
                from_user: from_user,
                to_user: to_user,
                content: content
            };
            socket.emit("privatemsg",data,function(data){
                //console.log(data);
                $('#chat .reply-content').val('');
                var html = template('sendmsg_template',{'content':content});
                $('#chat .records').append(html);
                //layer.msg(data);
            });
        });
    });

    socket.on("sendback",function(data){
        console.log(data);
        var html = template('receivemsg_template',data);
        $('#chat .records').append(html);
    });

    window.onunload = function(){
        console.log('删除用户');
        var from_user = $('#from-user').val();
        socket.emit('deleteuser',from_user,function(data){
            console.log(data);
        });
    }

    $('.write-private').click(function(){
        var index = layer.open({
            type: 1,
            title: '写私信',
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#private')
        });
        $('#private .btn-private').unbind().click(function(){
            var username = $('#to-user').val();
            var content = $('#send-content').val();
            $.ajax({
                url: '/search-user/api',
                type: 'POST',
                dataType: 'json',
                data: {
                    username: username
                },
                success: function(data){
                    if(data.state == 1){
                        var to_user = data.user._id;
                        var from_user = $('#from-user').val();
                        var param = {
                            from_user: from_user,
                            to_user: to_user,
                            content: content
                        };
                        $.ajax({
                            url: '/message-add/api',
                            type: 'POST',
                            dataType: 'json',
                            data: param,
                            success: function(data){
                                if(data.state==1){
                                    $.ajax({
                                        url: '/friend-add/api',
                                        type: 'POST',
                                        dataType: 'json',
                                        data: param,
                                        success: function(data){
                                            if(data.state == 1){
                                                $('#send-content').val('');
                                                layer.close(index);
                                                layer.msg('私信成功');
                                            }
                                        },
                                        error: function(xhr){
                                            console.log(xhr);
                                        }
                                    });
                                }
                            },
                            error: function(xhr,textStatus,errorThrown){
                                console.log(xhr);
                            }
                        });
                    }else{
                        layer.msg('没有这个用户，请换一个用户名');
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            });
        });
    });
});