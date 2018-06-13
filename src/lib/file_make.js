const log = require('../common/log.js');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const spritesmith = require('spritesmith');

const memory_file = require('./memory_file');
const tools = require('./tools');
const files = require('../common/files');

module.exports = {
    /**
     * 编译css
     * @param {*} filepath 
     */
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
    },
    /**
     * 获取sprite列表
     */
    getSpriteFileList(){
        return new Promise((resolve,reject)=>{
            glob('./css/_sprite/*.{png,jpg,gif}',{

            },(error,files)=>{
                if(error){
                    reject(error)
                }else{
                    resolve(files)
                }
            })
        } )
    },
    /**
     * 编译雪碧图
     */
    compileSprite(files){
        return new Promise((resolve,reject)=>{
            spritesmith.run({
                src:files
            },(error,result)=>{
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            })
        })
    },
    /**
     * sprite css
     */
    coordinatesCss(coordinates){
        let css = `
.icon{
    background:url(img/sprites.png) no-repeat 0 0;
    display:inline-block;
}`;

        Object.keys(coordinates).forEach((v,i)=>{
            let item = coordinates[v];
            let itemName = path.basename(v);
            css += `
.icon_${tools.getFilenameNoSuffixFromUrl(itemName)}{
    width:${item.width}px;
    height:${item.height}px;
    background-position:-${item.x}px -${item.y}px;
};
            `
        })

        return css;
    },
    /**
     * 编译sprite
     */
    makeSprite(){
        this.getSpriteFileList().then(sprites => {
            log('合并Sprite图片')
            this.compileSprite(sprites).then(result=>{
                memory_file.sprite_img = result.image;
                memory_file.sprite_css = this.coordinatesCss(result.coordinates);
                files.writeFileSync(path.join('css','_partial','_sprite.less'),memory_file.sprite_css);
                log('合并Sprite图片成功')
            }).catch(error=>{
                log('合并Sprite图片失败','red')
            })
        }).catch(error=>{
            log('合并Sprite图片失败','red')
        })
    }
}