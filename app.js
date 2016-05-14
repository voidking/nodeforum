/**
 * Created by haojin on 2016/3/20 0020.
 */
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var routes = require('./routes/index');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('./config');
var webRouter = require('./web-router');

app.use(session({
    secret: config.cookieSecret,
    key: config.key,//cookie name
    cookie:{maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        url: 'mongodb://localhost/forum'
    }),
    resave:true,
    saveUninitialized: true
}));

app.set('views','./views');
app.set('view engine','ejs');
app.use(flash());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));


//app.listen(port);


// routes
// routes(app);
app.use('/', webRouter);

var socket_event = require('./socket-event');

io.on('connection', socket_event);

http.listen(port);

console.log('forum started at port:'+port);