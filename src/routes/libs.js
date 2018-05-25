const path = require('path');
const express = require('express');
const router = express.Router();
const jsonResult = require('../lib/jsonresult');
const files = require('../common/files');
const multer = require('multer');
const upload = multer();
const request = require('request');
const tools = require('../lib/tools');

router.get('/', function(req, res, next) {
  let globPath = 'libs/**/*.*';
  files.getFileInfo(globPath,{

  }).then(files =>{
    res.render('libs', { 
      title: 'libs文件' ,
      config:global.config,
      files:files
    });
  }).catch(error=>{
    res.render('libs', { 
      title: 'libs文件' ,
      config:global.config,
      files:[]
    });
  })
});

/**
 *本地文件上传
 */
router.post('/create_libsUpload',upload.single('create_libs_uploadFile'),(req,res,next)=>{
 
    files.writeFileSync(path.join(global.workdir,`libs/${req.file.originalname}`),req.file.buffer);
    let resultJson = new jsonResult(true,'',null)

    res.json(resultJson)
})

/**
 * 新建公共库url下载
 */
router.post('/create_libsUrl',(req,res,next)=>{
  let libsUrl = req.body.create_libs_uploadUrl;

  let resultJson;
  request(libsUrl,(error,response,body)=>{
    if(error !== null){
      resultJson = new jsonResult(false,error,null);
    }else{
      files.writeFileSync(path.join(global.workdir, 'libs/' + tools.getFileNameFromUrl(libsUrl)), body);
      resultJson = new jsonResult(true,'',null)
    }
    res.json(resultJson);
  })

})

module.exports = router;
