#!/usr/bin/env node
var argv = require('yargs')
.usage('Usage:$0 <command> [options]')
  .alias('h','help')
  .alias('v','version')
  .help('h')
  .argv;



const path = require('path');

global.workdir = process.cwd();//工作目录
global.appdir = __dirname;

// console.log(global.workdir,global.appdir);

