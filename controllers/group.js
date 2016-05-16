/**
 * Created by haojin on 2016/4/27 0027.
 */
var config = require('../config');
var Admin = require('../models/admin-model');
var User = require('../models/user-model');
var Group = require('../models/group-model');
var GroupCollect = require('../models/group-collect-model');
var Post = require('../models/post-model');

// 新建群组
exports.group_add = function(req,res){
    res.render('./group/group-add',{
        title: '新建群组',
        user: req.session.user,
        host: config.host,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}
exports.group_add_api = function(req,res){
    var param = req.body;
    var group = new Group(param);
    group.save();
    res.json({
        state: 1
    });
}

// 群组详情
exports.group_detail = function(req,res){
    var groupId = req.params.id;
    var userId = req.session.user._id;
    Group.findById(groupId,function(err,group){
        GroupCollect.findByUserId(userId,function(err,collect){
            if(!collect){
                collect = {};
                collect.groups = [];
            }
            var follow = false;
            for(var i=0;i<collect.groups.length;i++){
                if(groupId==collect.groups[i]._id){
                    follow = true;
                }
            }
            Post.findByGroupId(groupId,function(err,posts){
                res.render('./group/group-detail',{
                    //title: '群组详情',
                    title: group.groupname,
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
}

// 关注群组页面
exports.follow = function(req, res, next){
    var adminId = req.session.user._id;
    var userId = req.session.user._id;
    Group.findByAdminId(adminId,function(err,adminGroups){
        var outGroupIds = [];
        if(adminGroups){
            var outGroups = adminGroups;
            for (var i=0;i<outGroups.length;i++){
                var id = outGroups[i]._id;
                outGroupIds.push(id);
            }
        }else{
            adminGroups = [];
        }
        GroupCollect.findByUserId(userId,function(err,collect){
            if(collect){
                var outGroups = collect.groups;
                for (var i=0;i<outGroups.length;i++){
                    var id = outGroups[i]._id;
                    outGroupIds.push(id);
                }
            }else{
                collect = {};
                collect.groups = [];
            }
            Group.findTen(outGroupIds,function(err, recommendGroups){
                if(!recommendGroups){
                    recommendGroups = [];
                }
                res.render('./group/follow',{
                    title: '关注',
                    user: req.session.user,
                    host: config.host,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString(),
                    adminGroups: adminGroups,
                    followGroups: collect.groups,
                    recommendGroups: recommendGroups
                });
            });
        });

    });
}

// 关注群组api
exports.follow_add_api = function(req,res){
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
}

// 取消关注群组
exports.follow_delete_api = function(req,res){
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
}

// 发现
exports.discover = function(req, res){
    var userId = req.session.user._id;
    GroupCollect.findByUserId(userId,function(err,collect){
        var outGroupIds = [];
        if(collect){
            var outGroups = collect.groups;
            for (var i=0;i<outGroups.length;i++){
                var id = outGroups[i]._id;
                outGroupIds.push(id);
            }
        }
        Group.findTen(outGroupIds,function(err,groups){
            if(!groups){
               groups = [];
            }
            Post.findTen(function(err, posts){
                res.render('./group/discover',{
                    title: '发现',
                    user: req.session.user,
                    host: config.host,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString(),
                    groups: groups,
                    posts: posts
                });
            });
        });
    });
}