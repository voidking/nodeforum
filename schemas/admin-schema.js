/**
 * Created by haojin on 2016/3/20 0020.
 */
var mongoose = require('mongoose');
var AdminSchema = new mongoose.Schema({
    adminname: {type: String},
    password: {type: String}
});

AdminSchema.statics= {
    fetch: function(cb){
        return this
            .find({})
            .exec(cb);
    }
};

module.exports = AdminSchema;