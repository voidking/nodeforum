/**
 * Created by haojin on 2016/3/20 0020.
 */
var mongoose = require('mongoose');
var AdminSchema = require('../schemas/admin-schema');
var Admin = mongoose.model('Admin',AdminSchema);

module.exports = Admin;