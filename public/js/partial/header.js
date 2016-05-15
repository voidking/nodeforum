/**
 * Created by haojin on 2016/4/10 0010.
 */

$(function(){
    var register_index = 0;
    var login_index = 0;
    //弹出注册窗口
    $('.register').click(function(){
        register_index = layer.open({
            type: 1,
            title: false,
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('.register-body')
        });
    });

    //隐藏注册窗口
    $('.register-body .btn-cancel').click(function(){
        layer.close(register_index);
    });

    //从注册框跳转登录框
    $('.register-body .log').click(function(){
        layer.close(register_index);
        login_index = layer.open({
            type: 1,
            title: false,
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('.login-body')
        });
    });

    //确认注册
    $('.register-body .btn-register').click(function(event){
        event.preventDefault();
        var $inputs = $('.register-body input');
        var username = $inputs.first().val();
        var password = $inputs.eq(1).val();
        var password2 = $inputs.last().val();
        if(username==''){
            $('.register-body .error').html('用户名不能为空！');
            $('.register-body .error').show();
            return;
        }
        if(password != password2){
            $('.register-body .error').html('两次输入密码不一致！');
            $('.register-body .error').show();
            return;
        }
        $.ajax({
            url: '/register/api',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username,
                password: password
            },
            success: function(data){
                if(data.state==1){
                    layer.msg('注册成功,请登录！');
                    setTimeout(function(){
                        layer.close(register_index);
                        login_index = layer.open({
                            type: 1,
                            title: false,
                            skin: 'layui-layer-demo', //样式类名
                            closeBtn: 0, //不显示关闭按钮
                            shift: 2,
                            shadeClose: true, //开启遮罩关闭
                            content: $('.login-body')
                        });
                    },1000);
                }else{
                    $('.register-body .error').html('用户名已经注册！');
                    $('.register-body .error').show();
                }
            },
            error: function(){

            }
        });
    });
    //隐藏错误提示信息
    $('.register-body input').focus(function(){
        $('.register-body .error').hide();
    });

    //弹出登录窗口
    $('.login').click(function(){
        login_index = layer.open({
            type: 1,
            title: false,
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('.login-body')
        });
    });
    //隐藏登录窗口
    $('.login-body .btn-cancel').click(function(){
        layer.close(login_index);
    });
    //从登录框跳转注册框
    $('.login-body .reg').click(function(){
        layer.close(login_index);
        register_index = layer.open({
            type: 1,
            title: false,
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('.register-body')
        });
    });
    //确认登录
    $('.login-body .btn-login').click(function(event){
        event.preventDefault();
        var $inputs = $('.login-body input');
        var username = $inputs.first().val();
        var password = $inputs.last().val();
        $.ajax({
            url: '/login/api',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username,
                password: password
            },
            success: function(data){
                if(data.state==1){
                    layer.msg('登录成功！');
                    setTimeout(function(){
                        var host = $('#host').val();
                        //window.location.href = host;
                        location.reload();
                    },1000);
                }else{
                    $('.login-body .error').html('用户名或密码错误！');
                    $('.login-body .error').show();
                    $('.login-body input').focus(function(){
                        $('.login-body .error').hide();
                    });
                }
            },
            error: function(){

            }
        });
    });

    //弹出注销框
    $('.user-thin .user-icon').click(function(e){
        $('.user-thin .about-me').show();
        $(document).one("click", function(){
            $('.user-thin .about-me').hide();
        });
        e.stopPropagation();
    });
});
