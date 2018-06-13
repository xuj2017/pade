const path = require('path');
const express = require('express');
const router = express.Router();
const jsonResult = require('../lib/jsonresult');
const files = require('../common/files');
const memory_file =require('../lib/memory_file');

router.get('/', (req, res, next)=>{
    res.render('sprite',{
        title: 'CSS Sprite',
        spriteList:files.getSpriteImg(),
        spriteCSS:memory_file.sprite_css || '',
        config:global.config
    })
});


module.exports = router;