const express = require('express');
const router = express.Router();
const file = require('../common/files');
const jsonresult = require('../lib/jsonresult');
const path = require('path');
const page_data = require('../common/page_data');

//hbs页面
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

//js页面
router.get('/js', function(req, res, next) {
 file.getFileInfo('js/*.js',{
    ignore:'js/modules/*.js'
  }).then( result =>{
    res.render('pageJs',{
      title:'js列表',
      config:global.config,
      jsPage:result
    })
  }).catch( error=>{
  })

});

//css页面
router.get('/css', function(req, res, next) {
  var cssBasePage = file.getFileInfo('css/*.less');
  var cssPartialPage = file.getFileInfo('css/_partial/*.less');

  Promise.all([cssBasePage,cssPartialPage]).then(result =>{
    res.render('pageCss',{
      title:'css列表',
      config:global.config,
      cssBasePage:result[0],
      cssPartialPage:result[1]
    })
  })

  // file.getFileInfo('css/*.less',{
  //    ignore:'css/+(_partial|_sprite)/*.less'
  //  }).then( result =>{
  //    res.render('pageCss',{
  //      title:'css列表',
  //      config:global.config,
  //      cssPage:result
  //    })
  //  }).catch( error=>{
  //  })
 
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

//创建js页
router.post('/create_js',function(req,res,next){
  var js_name= req.body.js_name;
  let resultjson = new jsonresult(true, '', null)
  try {
    file.writeFileSync(path.join('js',js_name+'.js'),`//${js_name}`,'utf-8')
  } catch (error) {
    resultjson.re = false;
    resultjson.message = error.message;
  }
  res.json(resultjson);
})

//创建css页
router.post('/create_css',function(req,res,next){
  var css_name= req.body.css_name;
  var cssPath = '';
  if(req.body.is_parial == 'true'){
    cssPath = '_partial'
  }
  let resultjson = new jsonresult(true, '', null)
  try {
    file.writeFileSync(path.join('css',cssPath,css_name+'.less'),`//${css_name}`,'utf-8')
  } catch (error) {
    resultjson.re = false;
    resultjson.message = error.message;
  }
  res.json(resultjson);
})

 /**
   * 获取页面数据
   */
  router.get('/get_page_data',(req,res,next)=>{
    let pagePath= req.query.pagePath;
    let resultjson = new jsonresult(true,'',page_data.get(pagePath));
    res.json(resultjson);
  })

//保存页面数据
router.post('/save_page_data',(req,res,next)=>{
  let pageData = JSON.parse(req.body.pageData);
  let filePath = req.body.filePath;
  let resultjson;
  try {
    page_data.save(filePath,pageData);
    resultjson = new jsonresult(true,'',null)
  } catch (error) {
    resultjson = new jsonresult(false,error.message,null)    
  }
  res.json(resultjson);
})

module.exports = router;
