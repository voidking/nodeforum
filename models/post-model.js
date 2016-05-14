/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var PostSchema = require('../schemas/post-schema');
var Post = mongoose.model('Post',PostSchema);

module.exports = Post;