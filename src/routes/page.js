const express = require('express');
const router = express.Router();
const file = require('../common/files');
const jsonresult = require('../lib/jsonresult');

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

module.exports = router;
