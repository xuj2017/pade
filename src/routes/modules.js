const path = require('path');
const express = require('express');
const router = express.Router();
const jsonResult = require('../lib/jsonresult');
const files = require('../common/files');

router.get('/', (req, res, next)=>{
    files.getModules().then(modules=>{
      res.render('modules',{
        title: 'Modules', 
        config: global.config,
        modules:modules
      })
    })
    
});

//创建模块
router.post('/create_module',(req,res,next)=>{
  let create_module_options = {};
  create_module_options.module_name = req.body.module_name;
  create_module_options.module_description = req.body.module_description;
  create_module_options.module_template = req.body.module_template;
  create_module_options.create_md = req.body.create_md;

  let paModules = require('../lib/paModules');
  let result;
  if(paModules.exists(create_module_options.module_name)){
     result =new jsonResult(false,'已有此模块',null)
    res.json(result)
    return false;
  }
  paModules.create(create_module_options).then( ()=>{
     result = new jsonResult(true,'成功',null)
     res.json(result)
  }).catch( (error)=>{
     result = new jsonResult(false,error.message,null)
     res.json(result)
  })
})

module.exports = router;