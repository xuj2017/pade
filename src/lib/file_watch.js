//文件变得监听

const log = require('../common/log');
const chokidar = require('chokidar');
const file_make = require('./file_make');
const _ = require('lodash');
const pawebpack = require('./pawebpack');

let watch_sprite = {
    start(){
        this.watch = chokidar.watch('./css/_sprite/*.{png,jpg,gif}',{
            persistent:true,
            ignoreInitial:true,
        });

        this.watch.on('all',(event,filePath)=>{
            log('文件变动'+event+' '+filePath,'yellow');
            file_make.makeSprite();
        }).on('ready',()=>{
            log("开始监视./css/_sprite/*.{jpg,png,gif}")
        })
    },
    stop(){
        this.watch.close();
    }
}

let watch_webpackjs = {
    start(callback){
        this.watch = chokidar.watch('./js/*.{js,jsx,ts,tsx}',{
            persistent:true,
            ignoreInitial:true,
        });

        this.watch.on('all',(event,filePath)=>{
            if(event == 'add' || event == 'unlink'){
                log('监听到文件变动'+event+' '+filePath,'yellow');
                this.reStart();
            }
        }).on('ready',()=>{
            log('开始监听./js/*.{js,jsx,ts,tsx}文件变动')
        })
    },
    stop(){
        this.watch.close();
    },
    reStart(){
        pawebpack.restart();
    }
}

module.exports = {
    watch_sprite,watch_webpackjs
}