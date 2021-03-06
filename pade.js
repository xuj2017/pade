#!/usr/bin/env node

global.workdir = process.cwd();
global.appdir = __dirname;

var app = require('./src/common/app');
var files = require('./src/common/files');

if (!files.exists('./pade.config.json')) {
    let port = 8000 + Math.floor(Math.random() * 999 - 1)

    app(port).then(function () {
        let opn = require('opn');
        opn('http://localhost:' + port + '/init/', {
            app: 'chrome'
        });
    })

    return false;
}

const jsonfile = require('jsonfile');
global.config = jsonfile.readFileSync('./pade.config.json'); //项目设置


const file_make = require('./src/lib/file_make');
const file_watch = require('./src/lib/file_watch');
file_make.makeSprite();//编译Sprite
file_watch.watch_sprite.start();//监听sprite


const pawebpack =require('./src/lib/pawebpack');
pawebpack.start();

app(global.config.server_port).then(function () {
    let opn = require('opn');
    opn('http://localhost:' + global.config.server_port + '/', {
        app: 'chrome'
    });
})