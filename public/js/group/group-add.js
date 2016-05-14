/**
 * Created by haojin on 2016/4/14 0020.
 */
$(function(){

});

var cropper;
function init()
{
    //绑定
    cropper = new ImageCropper(300, 300, 100, 100);
    cropper.setCanvas("cropper");
    //cropper.addPreview("preview180");
    cropper.addPreview("preview100");
    cropper.addPreview("preview50");
    //检测用户浏览器是否支持imagecropper插件
    if(!cropper.isAvaiable())
    {
        alert("Sorry, your browser doesn't support FileReader, please use Firefox3.6+ or Chrome10+ to run it.");
    }
}

//打开本地图片
function selectImage(fileList)
{
    cropper.loadImage(fileList[0]);
}

//旋转图片
function rotateImage(e)
{
    switch(e.target.id)
    {
        case "rotateLeftBtn":
            cropper.rotate(-90);
            break;
        case "rotateRightBtn":
            cropper.rotate(90);
            break;
    }
}

//上传图片
function saveImage()
{
    //选个你需要的大小
    var imgData = cropper.getCroppedImageData(180, 180);
    //console.log("上传了："+imgData);
    var groupname = $('#groupname').val();
    var info = $('#info').val();
    var admin_id = $('#admin_id').val();
    $.ajax({
        url: '/group-add/api',
        type: 'POST',
        dataType: 'json',
        data: {
            groupname: groupname,
            info: info,
            head_image: imgData,
            admin_id: admin_id
        },
        success: function(data){
            if(data.state==1){
                layer.msg('创建成功！');
                setTimeout(function(){
                    window.location.href = 'follow';
                },1000);
            }else{

            }
        },
        error: function(){

        }
    });
}