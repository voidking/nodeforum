/**
 * Created by haojin on 2016/4/17 0017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostCollectSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId},
    posts: [{type: Schema.Types.ObjectId,ref: 'Post'}]
});

PostCollectSchema.statics= {
    findByUserId: function(user_id,cb){
        return this.findOne({user_id:user_id})
            .populate('posts')
            .exec(cb);
    }
};

module.exports = PostCollectSchema;