/**
 * Created by haojin on 2016/4/17 0017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FriendCollectSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId},
    friends: [{type: Schema.Types.ObjectId,ref: 'User'}]
});

FriendCollectSchema.statics= {
    findByUserId: function(user_id,cb){
        return this.findOne({user_id:user_id})
            .populate('friends')
            .exec(cb);
    }
};

module.exports = FriendCollectSchema;