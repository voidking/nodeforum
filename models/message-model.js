/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var MessageSchema = require('../schemas/message-schema');
var Message = mongoose.model('Message',MessageSchema);

module.exports = Message;