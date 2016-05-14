/**
 * Created by haojin on 2016/3/23 0023.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    username: {type: String,unique: true},
    password: {type: String},
    head_image: {type: String},
    intro: {type: String}
});

UserSchema.methods.hello = function(){
    console.log('helloworld !');
}

UserSchema.methods.addUser = function(user,callback){

}

UserSchema.statics= {
    fetch: function(cb){
        return this.find({}).exec(cb);
    },
    findById: function(id,cb){
        return this.findOne({_id:id}).exec(cb);
    },
    findByUsername: function(username,cb){
        return this.findOne({username:username}).exec(cb);
    },
    findByNameAndPwd: function(username,password,cb){
        return this.findOne({username:username,password:password}).exec(cb);
    }
};

module.exports = UserSchema;