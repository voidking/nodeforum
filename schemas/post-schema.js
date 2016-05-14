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
        return this.find({author:id}).exec(cb);
    },
    findByGroupId: function(id,cb){
        return this.find({group:id})
            .populate('group')
            .exec(cb);
    },
    findTen: function(cb){
        return this.find({}).limit(10).exec(cb);
    }
};

module.exports = PostSchema;