/**
 * Created by haojin on 2016/4/17 0017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ReplySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    replies: {type: [Schema.Types.ObjectId]}
});
