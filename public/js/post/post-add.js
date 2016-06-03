/**
 * Created by haojin on 2016/4/14 0020.
 */
$(function(){

    // 百度地图定位
    var baidu_position = {};
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(118.895144,31.92596);
    map.centerAndZoom(point,12);

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            //alert('您的位置：'+r.point.lng+','+r.point.lat);
            console.log(r);
            baidu_position = r;
        }
        else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true})
    //关于状态码
    //BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
    //BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
    //BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
    //BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
    //BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
    //BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
    //BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
    //BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
    //BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)

    $('#position .glyphicon').click(function(){
        var address = baidu_position.address.province
                        + baidu_position.address.city
                        + baidu_position.address.district
                        + baidu_position.address.street;
        $('#baidu-address .address').html(address);
        $('#baidu-address .address').attr({
            'data-address': address
        });
        var index = layer.open({
            type: 1,
            title: '选择位置',
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 1, //不显示关闭按钮
            shift: 2,
            shadeClose: true, //开启遮罩关闭
            content: $('#baidu-address')
        });
        $('#baidu-address').unbind().on('click','.item',function(){
            $('#baidu-address .item').removeClass('active');
            $(this).addClass('active');
            var address = $(this).attr('data-address');
            if(address==''){
                $('#position .glyphicon').removeClass('active');
                $('#position .address').html('');
            }else{
                $('#position .glyphicon').addClass('active');
                $('#position .address').html(address);
            }
            layer.close(index);
        });
    });

    // 上传图片
    $('.icon-picture').click(function(){
        $('#picture').click();
        $('#picture').unbind().on('change',function(){
            var fileNumber = $('#picture').get(0).files.length;
            if(fileNumber==0){
                return;
            }
            var file = $('#picture').get(0).files[0];
            console.log(file);
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
//                var fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
//                var now = new Date();
//                var fileName = now.getTime() + 'langting' + parseInt(Math.random() * 20) + fileType;
                $(".addimage").text("上传中...");
                $('.icon-picture').hide();
                $('.icon-loading').css({
                    'display': 'inline-block'
                });
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/qn-upload',
                    data: {
                        imageData: e.target.result
                    },
                    success: function(data) {
                        if (data.state == true) {
                            setTimeout(function() {
                                $(".addimage").text("添加图片");
                                $('.icon-loading').hide();
                                $('.icon-picture').show();
                                var html = template('pic_template',data);
                                $('.pictures').append(html);
                            }, 1500);
                        } else {
                            alert("上传失败");
                        }
                    },
                    error: function(){

                    }
                });
            }
        });


    });

    // 删除图片
    $('.pictures').on('click','.icon-delete',function(){
        $(this).parents('.pic').remove();
    });

    $('#confirm').click(function(){
        var title = $('#title').val();
        var content = $('#content').val();
        var author = $('#author_id').val();
        var group = $('#group_id').val();
        var image_urls = [];
        var $imgs = $('.pictures .pic img');
        $imgs.each(function(index, el){
            var url_old = $(el).attr('src');
            var url_new = url_old.substring(0,url_old.indexOf('?'));
            image_urls.push(url_new);
        });
        if(title == ''){
            layer.msg('标题不能为空');
            return;
        }
        if(content == ''){
            layer.msg('内容不能为空');
            return;
        }
        var position = {};
        position.address = $('#position .address').html();
        if(position.address == ''){
            position.open = false;
            position.longitude = '';
            position.latitude = '';
        }else{
            position.open = true;
            position.longitude = ''+baidu_position.longitude;
            position.latitude = ''+baidu_position.longitude;
        }
        var param = {
            title: title,
            content: content,
            author: author,
            group: group,
            image_urls: image_urls,
            position: JSON.stringify(position)
        };
        var usernames = [];
        var arr = content.split(' ');
        for(var i = 0;i< arr.length;i++){
            if(arr[i].charAt(0) == '@'){
                var username = arr[i].substr(1,arr[i].length-1);
                console.log(username);
                usernames.push(username);
            }
        }
        $.ajax({
            url: '/post-add/api',
            type: 'POST',
            dataType: 'json',
            data: param,
            traditional: true,
            success: function(data){
                if(data.state==1){
                    var post_id = data.post_id;
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
                                layer.msg('发布成功');
                                window.location.href = '/group/'+group;
                            }
                        },
                        error: function(xhr){
                            console.log(xhr);
                        }
                    });
                    //layer.msg('发布成功！');
                    //window.location.href = '/group/'+group;
                }
            },
            error: function(){

            }
        });
    });

    // 表情
    $('.emotion').qqFace({
        id : 'facebox',
        assign:'content',
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

});