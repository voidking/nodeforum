/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GroupSchema = new mongoose.Schema({
    groupname: {type: String},
    info: {type: String},
    head_image: {type: String},
    admin_id: { type: Schema.Types.ObjectId}
});

GroupSchema.statics= {
    fetch: function(cb){
        return this.find({}).exec(cb);
    },
    findById: function(id,cb){
        return this.findOne({_id:id}).exec(cb);
    },
    findByAdminId: function(id,cb){
        return this.find({admin_id:id}).exec(cb);
    },
    findTen: function(outGroupIds,cb){
        return this.find({_id:{$nin:outGroupIds}}).limit(10).exec(cb);
    }
};

module.exports = GroupSchema;