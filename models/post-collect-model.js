/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var PostCollectSchema = require('../schemas/post-collect-schema');
var PostCollect = mongoose.model('PostCollect',PostCollectSchema);

module.exports = PostCollect;