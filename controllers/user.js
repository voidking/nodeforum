/**
 * Created by haojin on 2016/4/27 0027.
 */
var config = require('../config');
var Admin = require('../models/admin-model');
var User = require('../models/user-model');
var Group = require('../models/group-model');
var GroupCollect = require('../models/group-collect-model');
var Post = require('../models/post-model');


// 个人中心
exports.home = function(req, res){
    res.render('./user/home',{
        title: '个人中心',
        user: req.session.user,
        host: config.host,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

// 注册
exports.register_api = function(req, res){
    var username = req.body.username,
        password = req.body.password;
    console.log(req.body);
    //判断用户名是否被注册
    User.findByUsername(username,function(err,user){
        if(!user){
            var newUser = new User({
                username: username,
                password: password,
                head_image: '/img/index/default-head2.jpg'
            });
            newUser.save();
            res.json({
                state: 1
            });
        }else{
            res.json({
                state: 0
            });
        }
    });
}

// 登录
exports.login_api = function(req, res){
    var username = req.body.username,
        password = req.body.password;
    User.findByNameAndPwd(username,password,function(err,user){
        if(!user){
            res.json({
                state: 0
            });
        }else{
            req.session.user = user;
            res.json({
                state:1
            });
        }

    });
}

// 退出
exports.logout = function(req, res){
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');//登出成功后跳转到主页
}

// 修改头像
exports.change_head_image_api = function(req, res){
    var userId = req.session.user._id;
    var head_image = req.body.head_image;
    User.findById(userId,function(err, user){
        user.head_image = head_image;
        if(user.save()){
            req.session.user = user;
            res.json({
                state: 1
            });
        }
    });
}

// 修改密码
exports.change_pwd_api = function(req, res){
    var userId = req.session.user._id;
    var pwd_old = req.body.pwd_old;
    var pwd_new = req.body.pwd_new;
    User.findById(userId,function(err, user){
        if(user.password == pwd_old){
            user.password = pwd_new;
            if(user.save()){
                res.json({
                    state: 1
                });
            }
        }else{
            res.json({
                state: 0
            });
        }
    });
}

// 修改资料
exports.change_info_api = function(req, res){
    var userId = req.session.user._id;
    var intro = req.body.intro;
    User.findById(userId,function(err, user){
        user.intro = intro;
        if(user.save()){
            req.session.user = user;
            res.json({
                state: 1
            });
        }else{
            res.json({
                state: 0
            });
        }
    });
}

// 查找用户
exports.search_user_api = function(req, res){
    var username = req.body.username;
    User.findByUsername(username,function(err, user){
        if(user){
            res.json({
                state: 1,
                user: user
            });
        }else{
            res.json({
                state: 0
            });
        }
    });
}