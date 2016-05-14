/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AtSchema = new mongoose.Schema({
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    from_user: { type: Schema.Types.ObjectId, ref: 'User'},
    to_user: { type: Schema.Types.ObjectId, ref: 'User'},
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    content: {type: String},
    has_read: { type: Boolean, default: false }
});

AtSchema.statics= {
    fetch: function(cb){
        return this.find({})
            .sort({'create_at': 1})
            .exec(cb);
    },
    findById: function(id,cb){
        return this.findOne({_id:id})
            .exec(cb);
    },
    findByPostId: function(id,cb){
        return this.find({post: id})
            .populate('from_user')
            .sort({'create_at': 1})
            .exec(cb);
    },
    findNewOne: function(postId,userId,cb){
        return this.find({post: postId,from_user: userId})
            .populate('from_user')
            .sort({'create_at': -1})
            .limit(1)
            .exec(cb);
    },
    findByToUser: function(userId,cb){
        return this.find({to_user: userId})
            .populate('post')
            .populate('from_user')
            .exec(cb);
    }
};

module.exports = AtSchema;