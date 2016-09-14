/**
 * Created by Administrator on 2016/8/31.
 */
    //博客文章页面路由
var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var DB_STR = "mongodb://localhost:27017/tn_blog";
/* GET home page. */
router.get('/', function(req, res, next) {
    //获取id
    var id= req.query.id;
    console.log(id);
    //链接数据库，获取数据
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        //获取博客文章 posts
        var c = db.collection("posts");
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            console.log(docs);
            // cats 获取分类
            var c1 = db.collection("cats");
            c1.find().toArray(function(err,result){
                if(err){
                    res.send(err);
                    return;
                }
                //  /渲染博客文章页面 article.html
                res.render('home/article',{data:docs[0],data1:result});
            })
        })
    })
});

module.exports = router;
