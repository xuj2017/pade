const express = require('express')
const router = express.Router();
const configfile = require('../lib/config');
const jsonresult = require('../lib/jsonresult');
const proxy = require('../lib/proxy');

let newproxy = null;

router.get('/', function (req, res, next) {
    var proxy_list = configfile.get().proxy;
    // console.log(proxy_list)
    res.render('proxy', {
        title: '代理',
        config: global.config,
        proxy_list: configfile.get().proxy
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

    var resultjson = new jsonresult(true, '', null)
    res.json(resultjson);
})

router.post('/open', function (req, res) {
    let rules = JSON.parse(req.body.rules);
    let portnum = parseInt(req.body.portnum);
    if (newproxy == null) {
        newproxy = new proxy({
            rules: rules,
            portnum: portnum
        });
    }
    newproxy.open();
    var resultjson = new jsonresult(true, '', null)
    res.json(resultjson);
});

router.get('/close', function (req, res) {
    if (newproxy != null) {
        newproxy.close();
        newproxy = null;
    }
    var resultjson = new jsonresult(true, '', null)
    res.json(resultjson);
});
module.exports = router;