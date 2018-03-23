var express = require('express');
var router = express.Router();
var checknew = require('../lib/checknew');
var jsonresult = require('../lib/jsonresult')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' ,config:global.config});
});

router.get('/index2',function(req,res,next){
  res.render('home/index2',{
    lauout:null
  })
})

router.get('/home/newver',function(req,res,next){
  checknew.hasnew().then( isnew=>{
    let resultjson = new jsonresult(true,'',isnew)
    res.json(resultjson)
  }).catch(error=>{
    let resultjson = new jsonresult(false,error.message,null);
    res.json(resultjson)
  })
})

module.exports = router;
