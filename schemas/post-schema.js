/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PostSchema = new mongoose.Schema({
    title: {type: String},
    content: {type: String},
    author: { type: Schema.Types.ObjectId, ref: 'User'},
    group: {type: Schema.Types.ObjectId, ref: 'Group'},
    image_urls: [{type: String}],
    position: {
        open: {type: Boolean, default: false},
        longitude: {type: String},
        latitude: {type: String},
        address: {type: String}
    },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

PostSchema.statics= {
    fetch: function(cb){
        return this.find({})
            .populate('group')
            .exec(cb);
    },
    findById: function(id,cb){
        return this.findOne({_id:id})
            .populate('author')
            .populate('group')
            .exec(cb);
    },
    findByAuthorId: function(id,cb){
        return this.find({author:id})
            .populate('group')
            .exec(cb);
    },
    findByGroupId: function(id,cb){
        return this.find({group:id})
            .populate('group')
            .exec(cb);
    },
    findNine: function(cb){
        return this.find({})
            .populate('group')
            .sort({create_at: -1})
            .limit(9)
            .exec(cb);
    },
    findTen: function(cb){
        return this.find({})
            .populate('group')
            .sort({create_at: -1})
            .limit(10)
            .exec(cb);
    },
    findByPostIds: function(postIds,cb){
        return this.find({_id:{$in: postIds}})
            .sort({create_at: -1})
            .exec(cb);
    },
    findByPage: function(groupId,pageSize,pageIndex,cb){
        return this.find({group: groupId})
            .sort({create_at: -1})
            .skip(pageSize*(pageIndex-1))
            .limit(pageSize)
            .exec(cb);
    }
};

module.exports = PostSchema;