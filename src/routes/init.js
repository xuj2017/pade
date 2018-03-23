var express = require('express');
var router = express.Router();
var files = require('../common/files');
var path = require("path");
var jsonfile = require('jsonfile');
var jsonresult = require('../lib/jsonresult')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('init', {
       title: '初始化项目',
       layout:'',
       workdir:global.workdir
    });
});

router.post('/init_project',function(req,res,next){
    let project_name = req.body.project_name;
    let server_port = req.body.server_port;
    let new_file = req.body.new_file;

    console.log('start')
    files.createFileByTemplate('new_config',path.join(global.workdir,'pade.config.json'),{
        project_name:project_name,
        server_port:server_port
    })

    if(new_file>0){
        ["css","js","libs","page", "public","css/_partial","css/_sprite","js/modules","page/_layout", "page/_partial"].forEach( item => {
            files.createDirectory(path.join(global.workdir,item,path.delimiter))
        })
    }
    console.log('end')
    global.config = jsonfile.readFileSync('./pade.config.json');
    console.log(global.config)
    var result = new jsonresult(true,'Success',null);
    console.log('result')
    res.json(result)
})

module.exports = router;
