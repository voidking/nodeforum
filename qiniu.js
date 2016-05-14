/**
 * Created by haojin on 2016/5/3 0003.
 */
var qiniu = require('qiniu');
var uuid = require('node-uuid');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'JEBuh6qG9FPI6atoycgdoypwOZJWuzYk1YXnC-6c';
qiniu.conf.SECRET_KEY = 'IBAa_7Mkj2_ROefIRcwVjcVEK9PVFDvzrtPiL9nO';

//要上传的空间
bucket = 'forum';

//上传到七牛后保存的文件名
//key = 'my-nodejs-logo.png';
key = uuid.v1();

//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}

//生成上传 Token
token = uptoken(bucket, key);

//要上传文件的本地路径
filePath = './public/img/index/node.jpg';

//构造上传函数
function uploadFile(uptoken, key, localFile) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
}

//调用uploadFile上传
uploadFile(token, key, filePath);