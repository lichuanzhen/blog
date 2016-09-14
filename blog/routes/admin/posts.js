/**
 * Created by Administrator on 2016/8/31.
 */
//后台文章路由  ---控制器
var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

var DB_STR = "mongodb://localhost:27017/tn_blog";
//文章分类页面
router.get('/', function(req, res, next) {
    //到数据库查找信息
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
    //  获取数据口中的posts集合
        var c = db.collection("posts");
        //console.log(c);
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            // 返回数据 渲染后台文章分类页面 admin/article_list.html
            res.render('admin/article_list',{data:docs});
        })
    })
});
// 显示文章添加页面
router.get('/add', function(req, res, next) {
    //获取数据 cats中的title;
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
    //    获取cats集合
        var c = db.collection("cats");
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            // 获得数据 渲染文章添加页面 admin/article_add.html
            res.render('admin/article_add',{data:docs});
        })
    })

});
//显示文章修改页面
router.get('/edit', function(req, res, next) {
    //获取查询字符串
    var id = req.query.id;
    //到数据库查找信息
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        //  获取数据口中的posts集合
        var c = db.collection("posts");
        //console.log(c);
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            console.log(docs);
            // 返回数据 渲染后台文章分类页面 admin/article_list.html
            res.render('admin/article_edit',{data:docs[0]});
            })
        })
    });
//文章添加动作
router.post("/add",function(req,res,next){
    //   获取传递的数据
    var cat = req.body.cat;
    var title = req.body.title;
    var summary = req.body.summary;
    var content = req.body.content;
    var time = new Date();
    //对数据进行额外的处理 添加时间 创建一个对象
    var post ={
        "cat":cat,
        "title":title,
        "summary":summary,
        "content":content,
        "time":time
    }
    //  将得到的数据添加到数据库中
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
    //    获得数据空中的集合
        var c = db.collection("posts");
        c.insert(post,function(err,result){
            if(err){
                res.send(err);
                return;
            }
            res.send("添加文章成功，<a href='/admin/posts'> 返回文章列表</a>")
        })
    })
});
//文章更新动作
router.post("/edit",function(req,res){
    //获取更新的数据
    //   获取传递的数据
    var id = req.body.id;
    var cat = req.body.cat;
    var title = req.body.title;
    var summary = req.body.summary;
    var content = req.body.content;
    var time = new Date();
    //对数据进行额外的处理 添加时间 创建一个对象
    var post ={
        "cat":cat,
        "title":title,
        "summary":summary,
        "content":content,
        "time":time
    }
    //更新数据库
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        //获取posts集合 完成更新操作
        var c = db.collection("posts");
        c.update({_id:ObjectId(id)},{$set:post},function(err,result){
            if(err){
                res.send(err);
                return;
            }else{
                res.send("更新成功，<a href='/admin/posts'>返回列表</a>")
            }
        })
    })
});
//文章更新动作
router.get("/delete",function(req,res){
    // 获取id
    var id = req.query.id;
    // 通过id找到cats中的文档并删除
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return ;
        }
        //    获取posts集合 删除对应的文档
        var c = db.collection("posts");
        c.remove({_id:ObjectId(id)},function(err,result){
            if(err){
                res.send(err);
                return;
            }else{
                res.redirect("/admin/posts")
            }
        })
    })
})
module.exports = router;