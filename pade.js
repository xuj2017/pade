#!/usr/bin/env node

global.workdir = process.cwd();
global.appdir = __dirname;

console.log('global.workdir:' + global.workdir)
console.log('global.appdir:' + global.appdir)

// function createNewPage(a,b){
//     return new Promise( (resolve,reject)=>{
//       console.log(11111)
//       if(a == 1){
//         resolve('qweqweqw')
//       }else{
//           reject('asdasdad');
//       }
//     })
//   }

//   createNewPage(2).then( res=>{
//       console.log(res)
//   }).catch( error=>{
//     console.log(error,111)
//   })
// console.log(123123)
// return;
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

console.log(global.config.server_port)
app(global.config.server_port).then(function () {
    let opn = require('opn');
    opn('http://localhost:' + global.config.server_port + '/', {
        app: 'chrome'
    });
})