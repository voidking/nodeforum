/**
 * Created by haojin on 2016/4/9 0009.
 */

var config = require('../config');
var mongoose = require('mongoose');
var Admin = require('../models/admin-model');
var User = require('../models/user-model');
var Group = require('../models/group-model');
var GroupCollect = require('../models/group-collect-model');
var Post = require('../models/post-model');
mongoose.connect('mongodb://localhost/forum');

module.exports = function(app) {
    //测试
    app.get('/test',function(req,res){
        res.render('test',{

        });
    });
    //首页
    app.get('/',function(req,res){
        Post.fetch(function(err,posts){
            res.render('index',{
                title: '首页',
                user: req.session.user,
                host: config.host,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                posts: posts
            });
        });
    });
    //个人中心
    app.get('/my',function(req,res){
        res.render('my',{
            title: '个人中心',
            user: req.session.user,
            host: config.host,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    //关注
    app.get('/follow',checkLogin);
    app.get('/follow',function(req,res){
        var adminId = req.session.user._id;
        var userId = req.session.user._id;
        Group.findByAdminId(adminId,function(err,adminGroups){
            if(adminGroups.length > 0){
                GroupCollect.findByUserId(userId,function(err,collect){
                    if(collect){
                        res.render('follow',{
                            title: '关注',
                            user: req.session.user,
                            host: config.host,
                            success: req.flash('success').toString(),
                            error: req.flash('error').toString(),
                            adminGroups: adminGroups,
                            followGroups: collect.groups
                        });
                    }else{
                        res.render('follow',{
                            title: '关注',
                            user: req.session.user,
                            host: config.host,
                            success: req.flash('success').toString(),
                            error: req.flash('error').toString(),
                            adminGroups: adminGroups,
                            followGroups: ''
                        });
                    }

                });
            }else{
                res.render('follow',{
                    title: '关注',
                    user: req.session.user,
                    host: config.host,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString(),
                    adminGroups: '',
                    followGroups: ''
                });
            }

        });
    });

    //发现
    app.get('/discover',checkLogin);
    app.get('/discover',function(req,res){
        var userId = req.session.user._id;
        GroupCollect.findByUserId(userId,function(err,collect){
            if(collect){
                var outGroups = collect.groups;
                var outGroupIds = [];
                for (var i=0;i<outGroups.length;i++){
                    var id = outGroups[i]._id;
                    outGroupIds.push(id);
                }
                Group.findTen(outGroupIds,function(err,groups){
                    res.render('discover',{
                        title: '发现',
                        user: req.session.user,
                        host: config.host,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString(),
                        groups: groups
                    });
                });
            }else{
                Group.findTen([],function(err,groups){
                    res.render('discover',{
                        title: '发现',
                        user: req.session.user,
                        host: config.host,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString(),
                        groups: groups
                    });
                });
            }
        });
    });

    //消息
    app.get('/message',function(req,res){
        res.render('message',{
            title: '消息',
            user: req.session.user,
            host: config.host,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    //注册
    app.post('/register/api', function (req, res) {
        var username = req.body.username,
            password = req.body.password;
        console.log(req.body);
        //判断用户名是否被注册
        User.findByUsername(username,function(err,user){
            if(!user){
                var newUser = new User({
                    username: username,
                    password: password
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
    });


    //登录
    app.post('/login/api',function(req,res){
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
    });

    //退出
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');//登出成功后跳转到主页
    });

    //创建群组
    app.get('/group-add',checkLogin);
    app.get('/group-add',function(req,res){
        res.render('group-add',{
            title: '新建群组',
            user: req.session.user,
            host: config.host,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/group-add/api',function(req,res){
        var param = req.body;
        var group = new Group(param);
        group.save();
        res.json({
            state: 1
        });
    });
    // 群组详情
    app.get('/group/:id',function(req,res){
        var groupId = req.params.id;
        var userId = req.session.user._id;
        Group.findById(groupId,function(err,group){
            GroupCollect.findByUserId(userId,function(err,collect){
                var follow = false;
                for(var i=0;i<collect.groups.length;i++){
                    if(groupId==collect.groups[i]._id){
                        follow = true;
                    }
                }
                Post.findByGroupId(groupId,function(err,posts){
                    res.render('group-detail',{
                        title: '群组详情',
                        user: req.session.user,
                        host: config.host,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString(),
                        group: group,
                        follow: follow,
                        posts: posts
                    });
                });

            });
        });

    });
    // 关注群组
    app.post('/follow-add/api',function(req,res){
        var groupId = req.body.groupId;
        var userId = req.session.user._id;
        GroupCollect.findByUserId(userId,function(err,collect){
            if(!collect){
                var newCollect = new GroupCollect({
                    user_id: userId,
                    groups: [groupId]
                });
                newCollect.save();
                res.json({
                    state: 1
                });
            }else{
                collect.groups.push(groupId);
                collect.save();
                res.json({
                    state: 1
                });
            }
        });
    });
    app.post('/follow-delete/api',function(req,res){
        var groupId = req.body.groupId;
        var userId = req.session.user._id;
        GroupCollect.findByUserId(userId,function(err,collect){
            for(var i=0;i<collect.groups.length;i++){
                if(collect.groups[i]._id == groupId){
                    collect.groups.remove(groupId);
                    collect.save();
                    res.json({
                        state: 1
                    });
                }
            }
        });
    });

    // 发布帖子
    app.post('/post-add',checkLogin);
    app.post('/post-add',function(req,res){
        var group_id = req.body.group_id;
        res.render('post-add',{
            title: '发布帖子',
            user: req.session.user,
            host: config.host,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            group_id: group_id
        });
    });
    app.post('/post-add/api',function(req,res){
        var param = req.body;
        var post = new Post(param);
        post.save();
        res.json({
            state: 1
        });
    });
    //404
    app.get('*',function(req,res){
        User.fetch(function(err,users){
            res.render('404',{
                host:config.host,
                title: '404',
                users: users
            });
        });
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '请先登录!');
            res.redirect('back');//返回之前的页面
            //res.redirect('/');//返回首页
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');//返回之前的页面
        }
        next();
    }
};

