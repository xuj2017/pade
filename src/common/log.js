const argv = require('minimist')(process.argv.slice(2))
const colors = require('colors');
const moment = require('moment');

var isShow = false;

if(argv.log == true){
    isShow = true;
}

module.exports = function(text,color){
    // log(text,color){
        if(!isShow){
            return false
        }

        if(color != undefined){
            console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss:SSS")}] ${colors[color](text)}`)
        }else{
            console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss:SSS")}] ${text}`)
        }
    // }
}

// 颜色种类
// text colors
// black
// red
// green
// yellow
// blue
// magenta
// cyan
// white
// gray
// grey