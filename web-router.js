/**
 * Created by haojin on 2016/4/27 0027.
 */
var express = require('express');
var config = require('./config');
var site = require('./controllers/site');
var user = require('./controllers/user');
var group = require('./controllers/group');
var post = require('./controllers/post');
var message = require('./controllers/message');
var test = require('./controllers/test');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/forum');

var router = express.Router();

// 测试相关
router.get('/test/cropper',test.cropper);// 截图
router.get('/test/chat',test.chat);// 聊天
router.get('/test/baidu-map',test.baidu_map);

// 主页
router.get('/', site.index);

// 消息相关
router.get('/message',message.message);
router.post('/message-add/api',message.message_add_api);
router.post('/friend-add/api',message.friend_add_api);
router.post('/message-get/api',message.message_get_api);

// 用户相关
router.get('/user/home',user.home);// 个人中心
router.post('/register/api',user.register_api);//注册
router.post('/login/api',user.login_api);//登录
router.get('/logout',user.logout);//退出
router.post('/change-head-image/api',user.change_head_image_api);// 修改头像
router.post('/change-pwd/api',user.change_pwd_api);// 修改密码
router.post('/change-info/api',user.change_info_api);// 修改个人信息
router.post('/search-user/api',user.search_user_api);// 根据用户名查找用户

// 群组相关
router.get('/group-add',checkLogin);//新建群组
router.get('/group-add',group.group_add);
router.post('/group-add/api',group.group_add_api);
router.get('/follow',checkLogin);//关注群组页面
router.get('/follow',group.follow);
router.get('/group/:id',group.group_detail);// 群组详情
router.post('/follow-add/api',group.follow_add_api);// 关注群组
router.post('/follow-delete/api',group.follow_delete_api);// 取消关注群组
router.get('/discover',checkLogin);// 发现
router.get('/discover',group.discover);

// 帖子相关
router.post('/post-add',checkLogin); // 发布帖子
router.post('/post-add',post.post_add);
router.post('/post-add/api',post.post_add_api);// 发布帖子api
router.post('/pic-add/api',post.pic_add_api);
router.post('/qn-upload',post.qn_upload);// 上传图片
router.get('/post/:id',checkLogin);// 查看帖子
router.get('/post/:id',post.post_detail);
router.post('/post-delete/api',post.post_delete_api);// 删除帖子api
router.post('/comment-add/api',post.comment_add_api);// 评论帖子api
router.post('/comment-getall/api',post.comment_getall_api);// 获取帖子所有评论api
router.post('/comment-delete/api',post.comment_delete_api);// 删除评论api
router.post('/at-add/api',post.at_add_api);// @其他用户

// 404
router.get('*',site.error404);

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '请先登录!');
        res.redirect('back');//返回之前的页面
        //res.redirect('/');//返回首页
    }else{
        next();
    }
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        res.redirect('back');//返回之前的页面
    }
    next();
}


module.exports = router;