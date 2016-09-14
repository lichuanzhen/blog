var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//引入session模块
var session = require("express-session");

var routes = require('./routes/home/index');
var users = require('./routes/admin/users');
//引入博客文章模块
var posts = require('./routes/home/posts');
//引入后台模块
var admin = require('./routes/admin/admin');
//载入分类模块
var cats = require('./routes/admin/cats');
//载入文章模块
var article  = require('./routes/admin/posts');

var app = express();
//使用session中间件
app.use(session({
  secret: 'admin',
  resave: false,
  saveUninitialized: true,
  cookie:{}
  //cookie: {maxAge:1000 * 60 }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
//后台静态资源解析
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use('/', routes);

//app.use('/users', users);
//博客文章路由
app.use('/posts',posts);
//后台首页路由
app.use("/admin/index",checkLogin);
app.use('/admin/index',admin);
//后台分类路由
app.use("/admin/cats",checkLogin);
app.use('/admin/cats',cats);
//后台文章路由
app.use("/admin/posts",checkLogin);
app.use('/admin/posts',article);
//后台登录路由
app.use("/admin/users",users);
//编写一个中间件，用于判断用户是否有权访问
function checkLogin(req,res,next){
//    是否有登录标识
  if(!req.session.isLogin){
    res.redirect("/admin/users/login")
  }
  next();
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
