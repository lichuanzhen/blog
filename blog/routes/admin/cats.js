/**
 * Created by Administrator on 2016/8/31.
 */
//后台分类路由
var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

var DB_STR = "mongodb://localhost:27017/tn_blog";
//显示分类列表
router.get('/', function(req, res, next) {
    //链接数据库 找到cats结合 获取结合中的数据
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err)
        }
        var c = db.collection("cats");
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            //渲染后台分类页面 admin/category_list.html  发送回去
            res.render('admin/category_list',{data:docs});
        })
    })
});
//显示分类添加页面
router.get('/add', function(req, res, next) {
    //渲染分类添加页面 admin/category_list.html
    res.render('admin/category_add');
});
//分类添加动作
router.post("/add",function(req,res){
    //1.获取表单提交过来的数据
    var title = req.body.title;
    var sort = req.body.sort;
    console.log(title,sort);
    //2.对提交过来的数据进行相应的判断和验证
    //3.将数据保存到数据库中，并完成页面的跳转
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        //获取cats集合
        var c = db.collection("cats");
        //插入数据
        c.insert({title:title,sort:sort},function(err,result){
            if(err){
                res.send(err);
                return;
            }else{
               res.send('插入成功<a href="/admin/cats">返回列表页</a>')
            }
        })
    })
})
//显示分类编辑页面
router.get('/edit', function(req, res, next) {
    //获取查询字符串
    var id = req.query.id;
    //查询数据库 获取相应的id文档列表
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        //获得cats集合
        var c = db.collection("cats");
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            //渲染分类编辑页面 admin/category_edit.html
            res.render('admin/category_edit',{data:docs[0]});
        })
    })

});
//分类更新动作
router.post("/edit",function(req,res){
    //获取更新的数据
    var title = req.body.title;
    var sort = req.body.sort;
    var id = req.body.id;
    //更新数据库
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        //获取cats集合 完成更新操作
        var c = db.collection("cats");
        c.update({_id:ObjectId(id)},{$set:{title:title,sort:sort}},function(err,result){
            if(err){
                res.send(err);
                return;
            }else{
                res.send("更新成功，<a href='/admin/cats'>返回列表</a>")
            }
        })
    })
});
//删除分类动作
router.get("/delete",function(req,res){
    // 获取id
    var id = req.query.id;
    // 通过id找到cats中的文档并删除
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return ;
        }
    //    获取cats集合 删除对应的文档
        var c = db.collection("cats");
        c.remove({_id:ObjectId(id)},function(err,result){
            if(err){
                res.send(err);
                return;
            }else{
                res.redirect("/admin/cats")
            }
        })
    })
})
module.exports = router;
