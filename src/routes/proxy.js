const express = require('express')
const router = express.Router();
const config = require('../lib/config');
const jsonresult = require('../lib/jsonresult');

router.get('/', function (req, res, next) {
    res.render('proxy', {
        title: '代理',
        config: global.config,
        proxy_list: config.get().proxy
    })
})

router.post('/save', function (req, res, next) {
    var portnum = req.body.portnum | 0;
    var rules = JSON.parse(req.body.rules);
    global.config.proxy = {
        proxy_port: portnum,
        proxy_rules: rules
    };

    configfile.save(global.config);

    var resultjson = require(true, '', null)

    res.json(resultjson);
})

module.exports = router;