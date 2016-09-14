/**
 * Created by Administrator on 2016/8/31.
 */
//后台页面路由
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //渲染后台页面 admin/admin.html
    res.render('admin/admin');
});

module.exports = router;
