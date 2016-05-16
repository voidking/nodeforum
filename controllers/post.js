/**
 * Created by haojin on 2016/4/27 0027.
 */

var config = require('../config');
var uuid = require('node-uuid');
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
var PostCollect = require('../models/post-collect-model');

var request = require('request');
var lodash = require('lodash');


// 发布帖子
exports.post_add = function(req,res){
    var group_id = req.body.group_id;
    res.render('./post/post-add',{
        title: '发布帖子',
        user: req.session.user,
        host: config.host,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        group_id: group_id
    });
}

exports.post_add_api = function(req,res){
    var param = req.body;
    param.position = JSON.parse(param.position);
    var post = new Post(param);
    post.save();
    res.json({
        state: 1,
        post_id: post._id
    });
}

// 删除帖子
exports.post_delete_api = function(req, res){
    var postId = req.body.postId;
    Post.findById(postId,function(err,post){
        post.remove();
        Comment.findByPostId(postId,function(err, comments){
            comments.forEach(function(comment){
                comment.remove();
            });
            At.findByPostId(postId,function(err, ats){
                ats.forEach(function(at){
                    at.remove();
                });
                res.json({
                    state: 1
                });
            });
        });
    });
}

exports.pic_add_api = function(req, res){

    var qiniu = require('qiniu');

    //需要填写你的 Access Key 和 Secret Key
    qiniu.conf.ACCESS_KEY = 'JEBuh6qG9FPI6atoycgdoypwOZJWuzYk1YXnC-6c';
    qiniu.conf.SECRET_KEY = 'IBAa_7Mkj2_ROefIRcwVjcVEK9PVFDvzrtPiL9nO';

    //要上传的空间
    bucket = 'forum';

    //上传到七牛后保存的文件名
    //key = 'my-nodejs-logo.png';
    key = uuid.v1();

    //构建上传策略函数
    function uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        return putPolicy.token();
    }

    //生成上传 Token
    token = uptoken(bucket, key);

    //要上传文件的本地路径
    filePath = req.body.filePath;

    //构造上传函数
    function uploadFile(uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId);
                res.json({
                    state: 1
                });
            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });
    }
    //调用uploadFile上传
    uploadFile(token, key, filePath);
}

exports.qn_upload = function(req,res){
    var qn = require('qn');
    var client = qn.create({
        accessKey: 'JEBuh6qG9FPI6atoycgdoypwOZJWuzYk1YXnC-6c',
        secretKey: 'IBAa_7Mkj2_ROefIRcwVjcVEK9PVFDvzrtPiL9nO',
        bucket: 'forum',
        domain: 'http://7xstti.com2.z0.glb.clouddn.com'
    });

    var imageData = req.body.imageData;
    var key = uuid.v1();
    imageData = imageData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(imageData, 'base64');
    client.upload(dataBuffer, {
        key: key
    }, function(err, result) {
        if (err) {
            res.json({
                state: false,
                imgname: imageName,
                imgurl: "",
                imghash: ""
            });
        } else {
            res.json({
                state: true,
                imgname: result.key,
                imgurl: result.url,
                imghash: result.hash
            });
        }
    });
}


// 帖子详情
exports.post_detail = function(req, res){
    var postId = req.params.id;
    var userId = req.session.user._id;
    Post.findById(postId,function(err, post){
        if(post){
            // 直接修改create_at无效，所以添加一个属性
            post.create_at_string = moment(post.create_at).format(time_style);
            Comment.findByPostId(postId,function(err, comments){
                if(comments){
                    comments.forEach(function(comment,index){
                        // 这里需要给comment赋值，我靠！ejs渲染和ajax获取渲染不同！！！
                        comment.create_at_string = moment(comment.create_at).format(time_style);
                        //comment._doc.create_at_string = moment(comment.create_at).format(time_style);
                        comment.floor = index + 2;
                    });
                }else{
                    comments = [];
                }
                PostCollect.findByUserId(userId,function(err,collect){
                    if(!collect){
                        collect = {};
                        collect.posts = [];
                    }
                    var star = false;
                    for(var i=0;i<collect.posts.length;i++){
                        if(postId==collect.posts[i]._id){
                            star = true;
                        }
                    }
                    res.render('./post/post-detail',{
                        //title: '帖子详情',
                        title: post.title + '-' + post.group.groupname,
                        user: req.session.user,
                        host: config.host,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString(),
                        post: post,
                        comments: comments,
                        star: star
                    });
                });
            });
        }else{
            res.redirect('/error');
        }
    });
}

// 评论帖子api
exports.comment_add_api = function(req, res){
    var post = req.body.postId;
    var from_user = req.session.user._id;
    var to_user = req.body.to_user;
    var content = req.body.content;
    var param = {
        post: post,
        from_user: from_user,
        to_user: to_user,
        content: content
    };
    var comment = new Comment(param);
    comment.save();

//    request.post({url: '/at-add/api',form:JSON.stringify(param)},function(error, response, body){
//        console.log('success');
//        console.log(response.statusCode);
//        if (!error && response.statusCode == 200) {
//            res.render('index', {
//                dist:"http://"+config.host+"/"+config.staticDir,
//                host:"http://"+config.host,
//                wap:"http://"+config.host+"/"+config.staticDir,
//                data:JSON.parse(response.body)
//            });
//        }
//    });
    res.json({
        state: 1
    });
}


// 获取所有评论api
exports.comment_getall_api = function(req, res){
    var postId = req.body.postId;
    Comment.findByPostId(postId,function(err,comments){
        if(comments){
            //给comment赋值无效，需要给_doc赋值
            comments.forEach(function(comment,index){
                comment._doc.create_at_string = moment(comment.create_at).format(time_style);
                comment._doc.floor = index + 2;
            });
        }else{
            comments = [];
        }
        res.json({
            state: 1,
            comments: comments
        });
    });
}

// 删除评论api
exports.comment_delete_api = function(req, res){
    var commentId = req.body.commentId;
    Comment.findById(commentId,function(err, comment){
        comment.remove();
        res.json({
            state: 1
        });
    });
}

// @其他用户api
exports.at_add_api = function(req, res){
    var from_user = req.session.user._id;
    var usernames = lodash.isArray(req.body.usernames)?req.body.usernames:[req.body.usernames];
    var post = req.body.post_id;
    var content = req.body.content;
    var success = true;
    for(var i=0;i<usernames.length;i++){
        var username = usernames[i];
        User.findByUsername(username,function(err, user){
            if(user){
                var param = {
                    from_user: from_user,
                    to_user: user._id,
                    post: post,
                    content: content
                };
                var new_at = new At(param);
                success = new_at.save();
            }
        });
    }

    if(success){
        res.json({
            state: 1
        });
    }
}

// 举报帖子api，类似于@其他用户
exports.post_report_api = function(req, res){
    var from_user = req.session.user._id;
    var to_user = req.body.adminId;
    var post = req.body.postId;
    var param = {
        from_user: from_user,
        to_user: to_user,
        post: post,
        content: '举报'
    };
    var new_at = new At(param);
    if(new_at.save()){
        res.json({
            state: 1
        });
    }
}

// 收藏帖子
exports.star_add_api = function(req, res){
    var postId = req.body.postId;
    var userId = req.session.user._id;
    PostCollect.findByUserId(userId,function(err,collect){
        if(!collect){
            var newCollect = new PostCollect({
                user_id: userId,
                posts: [postId]
            });
            newCollect.save();
            res.json({
                state: 1
            });
        }else{
            collect.posts.push(postId);
            collect.save();
            res.json({
                state: 1
            });
        }
    });
}

// 取消收藏帖子
exports.star_delete_api = function(req, res){
    var postId = req.body.postId;
    var userId = req.session.user._id;
    PostCollect.findByUserId(userId,function(err,collect){
        for(var i=0;i<collect.posts.length;i++){
            if(collect.posts[i]._id == postId){
                collect.posts.remove(postId);
                collect.save();
                res.json({
                    state: 1
                });
            }
        }
    });
}

// 我的收藏
exports.mystar = function(req, res){
    var userId = req.session.user._id;
    PostCollect.findByUserId(userId,function(err,collect){
        if(!collect){
            collect = {};
            collect.posts = [];
        }
        var postIds = [];
        for(var i=0;i< collect.posts.length;i++){
            var id = collect.posts[i]._id;
            postIds.push(id);
        }
        Post.findByPostIds(postIds,function(err, posts){
            if(!posts){
                posts = [];
            }
            res.render('./post/mystar',{
                title: '我的收藏',
                user: req.session.user,
                host: config.host,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                posts: posts
            });
        });
    });
}

// 我的帖子
exports.mypost = function(req, res){
    var userId = req.session.user._id;
    Post.findByAuthorId(userId,function(err, posts){
        if(!posts){
            posts = [];
        }
        res.render('./post/mypost',{
            title: '我的帖子',
            user: req.session.user,
            host: config.host,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            posts: posts
        });
    });
}
