/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = new mongoose.Schema({
    from_user: { type: Schema.Types.ObjectId, ref: 'User'},
    to_user: { type: Schema.Types.ObjectId, ref: 'User'},
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    content: {type: String},
    has_read: { type: Boolean, default: false }
});

MessageSchema.statics= {
    fetch: function(cb){
        return this.find({})
            .sort({'create_at': 1})
            .exec(cb);
    },
    findById: function(id,cb){
        return this.findOne({_id:id})
            .exec(cb);
    },
    findByUserId: function(id,cb){
        return this.find({$or:[{'from_user': id},{'to_user': id}]})
            .populate('from_user')
            .populate('to_user')
            .exec(cb);
    },
    findByUserIds: function(id1,id2,cb){
        return this.find({$or:[{'from_user': id1, 'to_user': id2},{'from_user': id2,'to_user': id1}]})
            .populate('from_user')
            .populate('to_user')
            .exec(cb);
    }
};

module.exports = MessageSchema;