const log = require('../common/log.js');
const path = require('path');
const fs = require('fs');
module.exports = {
    compileStyle(filepath) {
        log(`编译${filepath}`);
        let extname = path.extname(filepath);
        let cssfile = fs.readFileSync(filepath, 'utf-8');
        // console.log(extname)
        if (extname == '.less') {
            // console.log(222)
            const less = require('less');
            return new Promise((resolve, reject) => {
                less.render(cssfile, {
                    filename: filepath
                }, function (e, output) {
                    //console.info(output.map)
                    if (e != null) {
                        log('编译' + filepath + '失败', 'red')
                        console.info(e);
                        reject(e);
                    } else {
                        log('编译' + filepath + '成功', 'green')
                        // console.log(output.css)
                        resolve(output.css);
                    }
                });
            })
        } else if (extname == '.scss') {
            const sass = require('node-sass');
            return new Promise((resolve, reject) => {
                sass.render({
                    data: cssfile,
                    includePaths: [path.join(global.workdir, 'css')]
                }, function (e, result) {
                    if (e != null) {
                        log('编译' + filepath + '失败', 'red')
                        console.info(e);
                        reject(e);
                    } else {
                        log('编译' + filepath + '成功', 'green')
                        resolve(result.css.toString());
                    }
                })
            })
        } else if (extname == '.css') {
            return new Promise((resolve, reject) => {
                fs.readFile(filepath, 'utf-8', (err, data) => {
                    if (err != null) {
                        log('读取' + filepath + '失败', 'red')
                        console.info(err);
                        reject(err);
                    } else {
                        log('读取' + filepath + '成功', 'green')
                        resolve(data);
                    }
                })
            })
        }
    }
}