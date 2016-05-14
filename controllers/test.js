/**
 * Created by haojin on 2016/4/27 0027.
 */

var config = require('../config');
var Admin = require('../models/admin-model');
var User = require('../models/user-model');
var Group = require('../models/group-model');
var GroupCollect = require('../models/group-collect-model');
var Post = require('../models/post-model');
var At = require('../models/at-model');

var moment = require('moment');
moment.locale('zh-cn');
var time_style = 'MMM Do YYYY, HH:mm:ss';

// 截图
exports.cropper = function(req, res){
    res.render('./test/cropper',{

    });
}

// socket.io
exports.chat = function(req, res){
    res.render('./test/chat',{
        title: '聊天'
    });
}

// 百度地图
exports.baidu_map = function(req, res){
    res.render('./test/baidu-map',{
        title: '百度地图'
    });
}

