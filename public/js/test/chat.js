/**
 * Created by haojin on 2016/5/11 0011.
 */
$(function(){

    //var socket = io.connect('http://localhost:3001');
    var socket = io.connect();
    $("#adduser").on("click",function(){
        var from_user = $('#from-user').val();
        socket.emit("adduser",from_user,function(data){
            console.log(data);
        });
    });

    $('#deleteuser').on('click',function(){
        var from_user = $('#from-user').val();
        socket.emit('deleteuser',from_user,function(data){
            console.log(data);
        });
    });

    $("#sendprivate").on("click",function(){
        var from_user = $('#from-user').val();
        var to_user = $('#to-user').val();
        var content = $('#content').val();
        var data = {
            from_user: from_user,
            to_user: to_user,
            content: content
        };
        socket.emit("privatemsg",data,function(data){
            console.log(data);
        });
    });

    socket.on("sendback",function(data){
        console.log(data);
    });


//    window.onbeforeunload = function() {
//        return 'onbeforeunload';
//    }

    window.onunload = function(){
        console.log('删除用户');
        var from_user = $('#from-user').val();
        socket.emit('deleteuser',from_user,function(data){
            console.log(data);
        });
    }
});
