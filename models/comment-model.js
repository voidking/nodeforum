/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment-schema');
var Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;