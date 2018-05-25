const app = require('express');
const router = app.Router();
const path = require('path');
const tools = require('../lib/tools');
const fs = require('fs');

router.get('/',(req,res,next)=>{
    let filePath = req.query.path;
    let extname = path.extname(filePath);
    let highlight_extname = '';
    switch(extname){
        case '.hbs':
            highlight_extname = 'Handlebars'
            break;
        case '.js':
            highlight_extname = 'Javascript'
            break;
        case '.less':
            highlight_extname = 'Less'
            break;   
        case '.scss':
            highlight_extname = 'SCSS'
            break;            
        case '.css':
            highlight_extname = 'CSS'
            break;
        case '.html':
            highlight_extname = 'HTML'
            break;
        case '.json':
            highlight_extname = 'JSON'
            break;
        case '.md':
            highlight_extname = 'Markdown'
            break;      
        default:
            break;
    }

    let fileSource = fs.readFileSync(filePath,"utf-8");

    res.render('codeview',{
        title:"查看代码",
        config:global.config,
        filePath:filePath,
        fileSource:fileSource,
        highlight_extname:highlight_extname
    })

})

router.get('/raw',(req,res,next)=>{
    let filePath = req.query.path;
    console.log(filePath)
    tools.readBigFile(filePath, content=>{
        console.log(content)
        res.setHeader("Content-Type", 'text/plain; charset=utf-8');
        res.send(content);
    })
})

module.exports = router;