/**
 * Created by haojin on 2016/4/17 0017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupCollectSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId},
    groups: [{type: Schema.Types.ObjectId,ref: 'Group'}]
});

GroupCollectSchema.statics= {
    findByUserId: function(user_id,cb){
        return this.findOne({user_id:user_id})
            .populate('groups')
            .exec(cb);
    }
};

module.exports = GroupCollectSchema;