/**
 * Created by haojin on 2016/5/12 0012.
 */

var User = require('./models/user-model');
var Message = require('./models/message-model');
var FriendCollect = require('./models/friend-collect-model');


//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/forum');

var users = {};
var socket_event = function(socket) {

    socket.on('disconnect', function () {
        //console.log('user disconnected');
    });

    socket.on("adduser", function (from_user, callback) {
        if (from_user in users) {
            users[from_user] = socket;
            callback(true);
        } else {
            socket.user_id = from_user;
            users[socket.user_id] = socket;
            callback(true);
        }
    });

    socket.on('deleteuser', function (from_user, callback) {
        if (from_user in users) {
            delete users[from_user];
            callback(true);
        }
    });

    socket.on("privatemsg", function (data, callback) {
        var param = {
            from_user: data.from_user,
            to_user: data.to_user,
            content: data.content
        };
        var message = new Message(param);
        message.save();
        if (data.to_user in users) {
            User.findById(data.from_user,function(err,user){
                users[data.to_user].emit('sendback', {'content': data.content,'friend':user});
                callback(true);
            });
        } else {
            callback('对方未登录，已留言');
        }

    });
}

module.exports = socket_event;