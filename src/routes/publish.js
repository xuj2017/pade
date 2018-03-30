const express = require('express');
const router = express.Router();
const config = require('../lib/config');
const jsonresult = require('../lib/jsonresult');
const publish = require('../lib/publish');

router.get('/',function(req,res,next){
    res.render('publish',{
        config:global.config,
        title:'项目发布'
    })     
})

router.post('/create_publish',function(req,res,next){
    // console.log('create_publish')
    var publish_name = req.body.publish_name;
    var publish_folder = req.body.publish_folder;
    var publish_page = req.body.publish_page == 'true'? true:false;
    var publish_compress = req.body.publish_compress == 'true'? true:false;
    if(global.config.publish == undefined){
        global.config.publish = []
    }
    global.config.publish.push({
        publish_name,publish_folder,publish_page,publish_compress
    })
    config.save(global.config);
    let result = new jsonresult(true,'Success',null)
    res.json(result);
})

router.post('/publish',function(req,res,next){
    console.log(111)
    var index = req.body.index | 0;
    console.log(index)
    var config = global.config.publish[index];
    console.log(config)
    publish.publish(config).then( function(){
        let resultjson = new jsonresult(true, '', null);
        res.json(resultjson);
    }).catch(function(){
        let resultjson = new jsonresult(false, error.message, null);
        res.json(resultjson);    
    })

})

module.exports = router;