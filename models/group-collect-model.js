/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var GroupCollectSchema = require('../schemas/group-collect-schema');
var GroupCollect = mongoose.model('GroupCollect',GroupCollectSchema);

module.exports = GroupCollect;