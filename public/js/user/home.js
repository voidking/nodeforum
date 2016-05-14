/**
 * Created by haojin on 2016/3/20 0020.
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


    // 截图
    var cropper = new ImageCropper(300, 300, 100, 100);
    cropper.setCanvas("cropper");
    cropper.addPreview("preview100");
    //检测用户浏览器是否支持imagecropper插件
    if(!cropper.isAvaiable())
    {
        alert("Sorry, your browser doesn't support FileReader, please use Firefox3.6+ or Chrome10+ to run it.");
    }
    // 选择图片
    $('#choose-image').click(function(){
        $('#input').click();
        $('#input').unbind().change(function(){
            var file = $('#input').get(0).files[0];
//            var fileReader = new FileReader();
//            fileReader.readAsDataURL(file);
//            fileReader.onload = function(e) {}
            cropper.loadImage(file);
        });
    });
    // 保存图片
    $('#save-image').click(function(){
        var path = $('#input').val();
        if(!path || path==''){
            return;
        }
        //设定保存的图片大小
        var imgData = cropper.getCroppedImageData(180, 180);
        //console.log("上传了："+imgData);
        $.ajax({
            url: '/change-head-image/api',
            type: 'POST',
            dataType: 'json',
            data: {
                head_image: imgData
            },
            success: function(data){
                if(data.state==1){
                    layer.msg('头像设置成功！');
                    window.location.reload();
                }
            },
            error: function(xhr,textStatus){
                console.log(xhr);
            }
        });
    });
    // 修改密码
    $('#save-pwd').click(function(){
        var pwd_old = $('#pwd-old').val();
        var pwd_new = $('#pwd-new').val();
        var pwd_again = $('#pwd-again').val();
        if(pwd_old==''){
            layer.msg('旧密码不能为空');
            return;
        }
        if(pwd_new == ''){
            layer.msg('新密码不能为空');
            return;
        }
        if(pwd_again == '' ){
            layer.msg('再次输入不能为空');
            return;
        }
        if(pwd_new != pwd_again){
            layer.msg('两次输入密码不一致');
            return;
        }
        var param = {
            pwd_old: pwd_old,
            pwd_new: pwd_new,
            pwd_again: pwd_again
        };
        $.ajax({
            url: '/change-pwd/api',
            type: 'POST',
            dataType: 'json',
            data: param,
            success: function(data){
                if(data.state == 1){
                   layer.msg('密码修改成功！');
                   window.location.reload();
                }else{
                    layer.msg('旧密码错误');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    })
    // 修改个人信息
    $('#save-info').click(function(){
        var intro = $('#intro').val();
        $.ajax({
            url: '/change-info/api',
            type: 'POST',
            dataType: 'json',
            data: {
                intro: intro
            },
            success: function(data){
                if(data.state == 1){
                    layer.msg('搞好了');
                    window.location.reload();
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    });

});