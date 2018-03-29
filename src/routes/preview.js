const express = require('express');
const router = express.Router();
const file = require('../common/files');
const pahbs = require('../lib/pahbs');
const pawebpack = require('../lib/pawebpack');
const file_make = require('../lib/file_make');

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

  router.get('/css/:cssname([a-zA-z0-9_-]+).css', function (req, res, next) {
      let cssname = req.params.cssname;
      let filepath = `./css/${cssname}.less`;
      if (file.exists(filepath)) {
        //   console.log(11)
        file_make.compileStyle(filepath).then(function (css) {
            // console.log(css)
          res.setHeader("Content-Type", 'text/css; charset=utf-8');
          res.send(css);
        }).catch(function (e) {
          next(e)
        });
      }
      else{
        filepath = './css/' + cssname + '.scss';
        if (file.exists(filepath)) {
          file_make.compileStyle(filepath).then(function (css) {
            res.setHeader("Content-Type", 'text/css; charset=utf-8');
            res.send(css);
          }).catch(function (e) {
            next(e)
          });
        }
        else{
          filepath = './css/' + cssname + '.css';
          if (file.exists(filepath)) {
            file_make.compileStyle(filepath).then(function (css) {
              res.setHeader("Content-Type", 'text/css; charset=utf-8');
              res.send(css);
            }).catch(function (e) {
              next(e)
            });
          }
          else{
            next();
          }      
        }
      }
  })
module.exports = router