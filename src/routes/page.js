const express = require('express');
const router = express.Router();
const file = require('../common/files');
const jsonresult = require('../lib/jsonresult');
const path = require('path');


router.get('/', function(req, res, next) {
  var basePage = file.getFileInfo('page/**/*.hbs',{
    ignore:'page/+(_layout|_partial)/*.hbs'
  })
  var layoutPage = file.getFileInfo('page/_layout/**/*.hbs');
  var partialPage = file.getFileInfo('page/_partial/**/*.hbs');

  Promise.all([basePage,layoutPage,partialPage]).then( result=>{
    res.render('page',{
      title:'页面',
      config:global.config,
      basePage:result[0],
      layoutPage:result[1],
      partialPage:result[2]
    })
  }).catch(error=>{
   
  })

});

//创建普通页面
router.post('/create_page',function(req,res,next){
  var page_name= req.body.page_name;
  var extra_js  = req.body.extra_js == 'true' ? true:false;
  var extra_less = req.body.extra_less == 'true' ? true:false;
  var page_layout = req.body.page_layout ;

  let create_page_options = {
    page_name,extra_js,extra_less,page_layout
  }
  
  file.createNewPage(page_name,create_page_options).then( ret =>{
    let resultjson = new jsonresult(true,'',null)
    res.json(resultjson)
  }).catch( error=>{
    let resultjson = new jsonresult(false, error.message, null);
    res.json(resultjson);
  })
})

//创建模板页面
router.post('/create_layout',function(req,res,next){
  var layout_name= req.body.layout_name;
  let resultjson = new jsonresult(true, '', null)
  try {
    file.createFileByTemplate('new_layout',path.join('page','_layout',layout_name+'.hbs'))
  } catch (error) {
    resultjson.re = false;
    resultjson.message = error.message;
  }
  res.json(resultjson);
})
//创建局部页
router.post('/create_partial',function(req,res,next){
  var partial_name= req.body.partial_name;
  let resultjson = new jsonresult(true, '', null)
  try {
    file.createFileByTemplate('new_partial',path.join('page','_partial',partial_name+'.hbs'))
  } catch (error) {
    resultjson.re = false;
    resultjson.message = error.message;
  }
  res.json(resultjson);
})

module.exports = router;
