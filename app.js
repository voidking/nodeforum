/**
 * Created by haojin on 2016/3/20 0020.
 */
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var path = require('path');

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'business_components')));
app.listen(port);

//index page
app.get('/',function(req,res){
    res.render('index',{
        title: '首页'
    });
});

console.log('forum started at port:'+port);