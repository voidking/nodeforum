/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var FriendCollectSchema = require('../schemas/friend-collect-schema');
var FriendCollect = mongoose.model('FriendCollect',FriendCollectSchema);

module.exports = FriendCollect;