/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user-schema');
var User = mongoose.model('User',UserSchema);

module.exports = User;