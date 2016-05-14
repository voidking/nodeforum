/**
 * Created by haojin on 2016/4/27 0027.
 */

var config = require('../config');
var moment = require('moment');
moment.locale('zh-cn');
var time_style = 'MMM Do YYYY, HH:mm:ss';

var Admin = require('../models/admin-model');
var User = require('../models/user-model');
var Group = require('../models/group-model');
var GroupCollect = require('../models/group-collect-model');
var Post = require('../models/post-model');
var Comment = require('../models/comment-model');
var At = require('../models/at-model');
var FriendCollect = require('../models/friend-collect-model');
var Message = require('../models/message-model');

var request = require('request');
var eventproxy = require('eventproxy');

// 消息
exports.message = function(req, res){
    var userId = req.session.user._id;
    At.findByToUser(userId,function(err, ats){
        if(!ats){
            ats = [];
        }
        for(var i=0;i<ats.length;i++){
            ats[i].create_at_string = moment(ats[i].create_at).format(time_style);
        }
        FriendCollect.findByUserId(userId,function(err, collect){
            if(!collect){
                collect = {};
                collect.friends = [];
            }
            var eq = new eventproxy();
            eq.after('getmessages',collect.friends.length,function(list){
                //console.log(list);
                list.forEach(function(messages,index){
                    messages.forEach(function(message){
                        message.create_at_string = moment(message.create_at).format(time_style);
                    });
                });
                var newmsgs = [];
                for(var i=0;i<list.length;i++){
                    var msglength = list[i].length;
                    var newmsg = list[i][msglength-1];
                    newmsgs.push(newmsg);
                }
                res.render('./message/message',{
                    title: '消息',
                    user: req.session.user,
                    host: config.host,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString(),
                    ats: ats,
                    list: list,
                    newmsgs: newmsgs
                });
            });
            collect.friends.forEach(function(user){
                Message.findByUserIds(userId,user._id,function(err,messages){
                    if(messages){
                        eq.emit('getmessages',messages);
                    }
                });
            });
        });
    });
}

exports.message_add_api = function(req, res){
    var param = {
        from_user: req.body.from_user,
        to_user: req.body.to_user,
        content: req.body.content
    };
    var message = new Message(param);
    message.save();
    res.json({
        state: 1
    });
}

exports.friend_add_api = function(req, res){
    var from_user = req.body.from_user;
    var to_user = req.body.to_user;
    var ep = new eventproxy();
    ep.all('addmyfriend','addhisfriend',function(result1,result2){
        if(result1==true && result2==true){
            res.json({
                state: 1
            });
        }
    });
    FriendCollect.findByUserId(from_user,function(err, collect){
        if(!collect){
            var newCollect = new FriendCollect({
                user_id: from_user,
                friends: [to_user]
            });
            newCollect.save();
        }else{
            var has_add = false;
            for(var i=0;i<collect.friends.length;i++){
                if(collect.friends[i]._id == to_user){
                    has_add = true;
                }
            }
            if(has_add == false){
                collect.friends.push(to_user);
                collect.save();
            }
        }
        ep.emit('addmyfriend',true);
    });
    FriendCollect.findByUserId(to_user,function(err, collect){
        if(!collect){
            var newCollect = new FriendCollect({
                user_id: to_user,
                friends: [from_user]
            });
            newCollect.save();
        }else{
            var has_add = false;
            for(var i=0;i<collect.friends.length;i++){
                if(collect.friends[i]._id == from_user){
                    has_add = true;
                }
            }
            if(has_add == false){
                collect.friends.push(from_user);
                collect.save();
            }
        }
        ep.emit('addhisfriend',true);
    });
}

exports.message_get_api = function(req, res){
    var my_id = req.session.user._id;
    var friend_id = req.body.friend_id;
    Message.findByUserIds(my_id,friend_id,function(err, messages){
        res.json({
            state: 1,
            messages: messages
        });
    });
}