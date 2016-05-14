/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var GroupSchema = require('../schemas/group-schema');
var Group = mongoose.model('Group',GroupSchema);

module.exports = Group;