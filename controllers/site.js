/**
 * Created by haojin on 2016/4/27 0027.
 */

var config = require('../config');
var Admin = require('../models/admin-model');
var User = require('../models/user-model');
var Group = require('../models/group-model');
var GroupCollect = require('../models/group-collect-model');
var Post = require('../models/post-model');

// 主页
exports.index = function(req, res){
    Post.findNine(function(err,posts){
        res.render('index',{
            title: '首页',
            user: req.session.user,
            host: config.host,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            posts: posts
        });
    });
}

// 404
exports.error404 = function(req,res){
    User.fetch(function(err,users){
        res.render('404',{
            host:config.host,
            title: '404',
            users: users
        });
    });
}