var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var DB_STR = "mongodb://localhost:27017/tn_blog";
//引入session模块
var session = require("express-session");
/* GET users listing. */
//使用中间件
router.use("/login",checkNotLogin);
//登录界面显示
router.get('/login', function(req, res, next) {
    res.render("admin/login");
});
//用户登录处理
router.post("/signin",function(req,res,next){
  var username = req.body.username;
  var pwd  =req.body.pwd;
  //console.log(username,pwd)
//  到数据库中匹配验证
  MongoClient.connect(DB_STR,function(err,db){
      if(err){
        res.send(err);
        return;
      }
      //找到user 集合
    var c = db.collection("user");
    //console.log(c);
    c.find({username:username,pwd:pwd}).toArray(function(err,result){
        if(err){
          res.send(err);
          return;
        }else{
            console.log(result);
          if(result.length){//result为一个数组
            req.session.isLogin = 1;
            res.render("admin/admin");
          }else{
            res.redirect("/admin/users/login")
          }
        }
    })
  })
});
//用户注销
router.get("/logout",function(req,res,next){
    //清楚session然后跳转
    req.session.isLogin = null;
  res.redirect("/admin/users/login")
});
//判断用户是否已经登录 的中间件
function checkNotLogin (req,res,next){
//    判断如果已经登录了，跳转到首页
    if(req.session.isLogin){
        res.redirect("back");
    }
    next()
}
module.exports = router;
