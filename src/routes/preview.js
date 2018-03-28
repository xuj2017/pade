const express = require('express');
const router = express.Router();
const file = require('../common/files');
const pahbs = require('../lib/pahbs');
const pawebpack = require('../lib/pawebpack');

router.get('/:pagename([a-zA-z0-9_-]+)', function (req, res, next) {
    let pagename = req.params.pagename;
    let filepath = './page/' + pagename + '.hbs';
    if (file.exists(filepath)) {
      res.send(pahbs.compile(filepath));
    } else {
      next();
    }
  });

  router.get('/js/:jsname([a-zA-z0-9_-]+).js', function (req, res, next) {
    let jsname = req.params.jsname;
    let filepath = './js/' + jsname + '.js';
  
    let filecontent = pawebpack.readJS(jsname)
    if (filecontent != null) {
      res.setHeader("Content-Type", 'application/x-javascript')
      res.send(filecontent)
    } else {
      next();
    }
  });

module.exports = router