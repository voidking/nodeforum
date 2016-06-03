/**
 * Created by haojin on 2016/3/20 0020.
 */
$(function(){
    // 删除帖子
    $('.user .post-delete').click(function(){
        var $that = $(this);
        var postId = $('#postId').val();
        var groupId = $('#groupId').val();
        layer.confirm('真的要删除整个帖子吗？', {
            btn: ['是的','算了'] //按钮
        }, function(){ // 是的
            $.ajax({
                url: '/post-delete/api',
                type: 'POST',
                dataType: 'json',
                data: {
                    postId: postId
                },
                success: function(data){
                    if(data.state==1){
                        layer.msg('删除成功', {icon: 1});
                        window.location.href = '/group/'+groupId;
                    }else{

                    }
                },
                error: function(){

                }
            });

        }, function(){ // 算了

        });
    });
    // 评论
    $('.layers').on('click','.glyphicon-comment',function(){
        var $that = $(this);
        var username = $(this).parents('.user').attr('data-username');
        $('#reply .to-user span').html(username);
        $('#reply .reply-content').val('');
        var index = layer.open({
            type: 1,
            title: '跟帖',
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#reply')
        });
        $('#reply .btn-reply').unbind().click(function(e){
            console.log(e.target);
            var content = $('#reply .reply-content').val();
            if(content == ''){
                layer.msg('回复内容不能为空');
                return;
            }

            var postId = $('#postId').val();
            var to_user = $that.parents('.user').attr('data-userId');
            var param = {
                postId: postId,
                to_user: to_user,
                content: content
            };
            $.ajax({
                url: '/comment-add/api',
                type: 'POST',
                dataType: 'json',
                data: param,
                success: function(data){
                    if(data.state==1){
                        layer.close(index);
                        $.ajax({
                            url: '/comment-getall/api',
                            type: 'POST',
                            dataType: 'json',
                            data: {postId: postId},
                            success: function(data,textStatus){
                                var html = template('layer_template',data);
                                $('.comments').empty();
                                $('.comments').append(html);
                                // @其他用户
                                var usernames = [];
                                var arr = content.split(' ');
                                for(var i = 0;i< arr.length;i++){
                                    if(arr[i].charAt(0) == '@'){
                                        var username = arr[i].substr(1,arr[i].length-1);
                                        console.log(username);
                                        usernames.push(username);
                                    }
                                }
                                var post_id = postId;
                                var param2 = {
                                    usernames: usernames,
                                    post_id: post_id,
                                    content: content
                                };
                                $.ajax({
                                    url: '/at-add/api',
                                    type: 'POST',
                                    dataType: 'json',
                                    traditional: true,
                                    data: param2,
                                    success: function(data){
                                        if(data.state == 1){
                                            layer.msg('跟帖成功');
                                        }
                                    },
                                    error: function(xhr){
                                        console.log(xhr);
                                    }
                                });
                            },
                            error: function(xhr, textStatus,errorThrown){
                                console.log(xhr);
                            }
                        });
                    }else{

                    }
                },
                error: function(xhr,textStatus,errorThrown){
                    console.log(xhr);
                }
            });
            //e.stopPropagation();
        });
    });
    // 删除评论
    $('.comments').on('click','.comment-delete',function(){
        $that = $(this);
        layer.confirm('删除该回复？', {
            btn: ['是的','算了'] //按钮
        }, function(){ // 是的
            var postId = $('#postId').val();
            var commentId = $that.parents('.layer').attr('data-commentId');
            $.ajax({
                url: '/comment-delete/api',
                type: 'POST',
                dataType: 'json',
                data: {
                    commentId: commentId
                },
                success: function(data){
                    if(data.state==1){
                        layer.msg('删除成功！');
                        $.ajax({
                            url: '/comment-getall/api',
                            type: 'POST',
                            dataType: 'json',
                            data: {postId: postId},
                            success: function(data,textStatus){
                                var html = template('layer_template',data);
                                $('.comments').empty();
                                $('.comments').append(html);
                            },
                            error: function(xhr, textStatus,errorThrown){
                                console.log(xhr);
                            }
                        });
                    }else{

                    }
                },
                error: function(){

                }
            });

        }, function(){ // 算了

        });
    });

    // 私信
    $('.main-body').on('click','.head-image',function(){
        var $that = $(this);
        var username = $(this).parents('.user').attr('data-username');
        $('#private .to-user span').html(username);
        $('#private .private-content').val('');
        var index = layer.open({
            type: 1,
            title: '私信',
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#private')
        });
        $('#private .btn-private').unbind().click(function(e){
            console.log(e.target);
            var content = $('#private .private-content').val();
            if(content == ''){
                layer.msg('私信内容不能为空');
                return;
            }
            var from_user = $('#userId').val();
            var to_user = $that.parents('.user').attr('data-userId');
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
        });
    });

    // 分享
    $('.icon-share').click(function(){
        layer.open({
            type: 1,
            title: ['分享','text-align:center;padding: 0;'],
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#share')
        });
    });

    // 收藏
    var star = $('#star').val();
    if(star == 'true'){
        $('.banner-body .not-star').hide();
        $('.banner-body .has-star').show();
    }

    $('.banner-body .not-star').click(function(){
        var postId =$('#postId').val();
        var param = {
            postId: postId
        };
        $.ajax({
            url: '/star-add/api',
            type: 'POST',
            dataType: 'json',
            data: param,
            success:function(data){
                if(data.state==1){
                    layer.msg('收藏成功');
                    $('.not-star').hide();
                    $('.has-star').show();
                }
            },
            error:function(error){

            }
        });
    });

    // 取消收藏
    $('.banner-body .has-star').click(function(){
        var postId =$('#postId').val();
        var param = {
            postId: postId
        };
        $.ajax({
            url: '/star-delete/api',
            type: 'POST',
            dataType: 'json',
            data: param,
            success:function(data){
                if(data.state==1){
                    layer.msg('已取消收藏');
                    $('.has-star').hide();
                    $('.not-star').show();
                }
            },
            error:function(error){

            }
        });
    });

    // 举报
    $('.banner-body .icon-report').click(function(){
        var adminId = $('#adminId').val();
        var postId = $('#postId').val();
        var param = {
            adminId: adminId,
            postId: postId
        };
        $.ajax({
            url: '/post-report/api',
            type: 'POST',
            dataType: 'json',
            traditional: true,
            data: param,
            success: function(data){
                if(data.state == 1){
                    layer.msg('举报成功，等待管理员处理');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    });

    // 表情
    $('.emotion').qqFace({
        id : 'facebox',
        assign:'saytext',
        path:'/js/util/qqface/arclist/'	//表情存放的路径
    });
    $(".sub_btn").click(function(){
        var str = $("#saytext").val();
        $("#show").html(replace_em(str));
    });

    function replace_em(str){
        str = str.replace(/\</g,'&lt;');
        str = str.replace(/\>/g,'&gt;');
        str = str.replace(/\n/g,'<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/js/util/qqface/arclist/$1.gif" border="0" />');
        return str;
    }

    function replace_all_em(){
        var $contents = $('.content p');
        $contents.each(function(index,el){
            var str = $(el).html();
            var new_str = replace_em(str);
            $(el).html(new_str);
        });
    }

    replace_all_em();
});