/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var AtSchema = require('../schemas/at-schema');
var At = mongoose.model('At',AtSchema);

module.exports = At;