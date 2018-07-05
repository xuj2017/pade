const log = require('../common/log');
const files = require('../common/files');
const mkdirp = require('mkdirp');
const pawebpack = require('./pawebpack');
const UglifyJS = require("uglify-js");
const fs = require('fs')
const file_make = require('./file_make');
const CleanCSS = require('clean-css');
const glob = require('glob');
const mfs = require('./memoryfs');
const path = require('path');
const pahbs = require('./pahbs');
const memory_file = require('./memory_file')

module.exports = {
    publish(config) {
      return  new Promise((resolve, reject) => {
            let publish_promise_list = [
                this.publishJs(config),
                this.publishCss(config),
                this.publishLibsJs(config),
                this.publishLibsCss(config),
                this.publishSprite(config),
                this.publishPublicFile(config),
                this.publishModuleFile(config)
            ]

            if (config.publish_page) {
                publish_promise_list.push(this.publishPage(config))
            }
            log('开始发布，目标位置:' + config.publish_folder)

            Promise.all(publish_promise_list).then(function () {
                log('发布全部成功', 'green')
                resolve();
            }).catch(function (error) {
                log('发布失败', 'red')
                console.error(error)
                reject(error);
            });
        });
    },
    /**
     * 发布页面
     * @param {any} config 
     */
    publishPage(config) {
        return new Promise(function (resolve, reject) {
          let pages = files.getPageHbs();
          mkdirp(config.publish_folder, function (err) {
            if (err) {
              reject(err);
              return false;
            }
            pages.forEach(v => {
              let output = pahbs.compile(v.path);
              fs.writeFileSync(path.join(config.publish_folder, v.name + '.html'), output, 'utf-8');
            });
            resolve();
          });
        });
      },
    /**
     * 发布js文件
     * 
     * @param {any} config 
     * @returns 
     */
    publishJs(config) {
        return new Promise((resolve, reject) => {
            let jss = files.getPageJs();
            mkdirp(path.join(config.publish_folder, 'js'), function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                jss.forEach(v => {
                    let jscontent = pawebpack.readJS(v.name);
                    if (config.publish_compress) {
                        let uglifyjs_option = {
                            ie8: true,
                            sourceMap: {
                                url: v.name + ".js.map",
                                includeSources: true
                            }
                        }
                        uglifyjs_option.compress = {}
                        uglifyjs_option.compress.drop_console = true

                        var uglifyjs_result = UglifyJS.minify(jscontent, uglifyjs_option);
                        if (uglifyjs_result.error != undefined) {
                            log('压缩js失败！ ' + uglifyjs_result.error.message, 'red')
                            reject(uglifyjs_result.error)
                        } else {
                            fs.writeFileSync(path.join(config.publish_folder, 'js', v.name + '.js'), uglifyjs_result.code, 'utf-8');
                            let mapfile = uglifyjs_result.map;
                            mapfile = mapfile.replace('"sources":["0"]', '"sources":["' + v.name + '.js"]')
                            fs.writeFileSync(path.join(config.publish_folder, 'js', v.name + '.js.map'), mapfile, 'utf-8')
                        }
                    }else{
                        fs.writeFileSync(path.join(config.publish_folder, 'js', v.name + '.js'), jscontent, 'utf-8')
                    }
                })
                resolve();
            })
        })
    },
    /**
     * 发布css文件
     * 
     * @param {any} config 
     */
    publishCss(config){
        return new Promise( (resolve,reject)=>{
            let csss = files.getPageLess();
            mkdirp(path.join(config.publish_folder, 'css'), function (err) {
                if (err) {
                  reject(err);
                  return false;
                }
        
                let css_options = { compatibility: 'ie7' }
        
                Promise.all(csss.map(v => file_make.compileStyle(v.path))).then(result => {
                  result.forEach((v, i) => {
                    let output = '';
                    if (config.publish_compress) {
                      output = (new CleanCSS(css_options).minify(v)).styles;
                    }
                    else {
                      output = v
                    }
        
                    fs.writeFileSync(path.join(config.publish_folder, 'css', csss[i].name + '.css'), output, 'utf-8');
                  });
                  resolve();
                }).catch(error => {
                  reject(error)
                });
        
              });
        })
    },
    /**
     * 发布公共文件
     * 
     * @param {any} config 
     * @returns 
     */
    publishPublicFile(config){
        log('开始发布public文件夹');
        return new Promise( (resolve, reject)=>{
            glob('public/**/*.*', function (error, public_files) {
              if (error != undefined) {
                reject(error)
              }
              public_files.forEach(v => {
                files.copyFile(v, path.join(config.publish_folder, v.substring(7)))
                log('复制 ' + v + ' 成功', 'green')
              })
              resolve()
            })
          })
    },
    publishModuleFile(){
        return new Promise(function (resolve, reject) {
            mfs.readdir(path.join(global.workdir, 'bundle', 'js', 'img'), function (error, result) {
              if (error != null) {
                if(error.errno == 34){
                  resolve()
                }
                else{
                  reject(error)
                }
              }
              else {
                result.forEach(v => {
                  let content = mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', 'img', v))
                  files.writeFileSync(path.join(config.publish_folder, 'css', 'img', v), content)
                  resolve()
                })
              }
            })
        })
    },
    /**
     * 发布libsjs
     * 
     * @returns 
     */
    publishLibsJs(config){
        return new Promise( (resolve,reject)=>{
            let jss = files.getLibsJs();
            if(jss.length>0){
                mkdirp(path.join(config.publish_folder,'js'),(error)=>{
                    if(error){
                        reject(error);
                        return false;
                    }
                    let output = files.getLibsContent('js');

                    if(config.publish_compress){
                        let uglifyjs_option={
                            ie8: true,
                            sourceMap: {
                                url: "libs.js.map",
                                includeSources: true
                            }
                        }
                    
                        uglifyjs_option.compress = {};
                        uglifyjs_option.compress.drop_console = true;

                        let uglifyjs_result = UglifyJS.minify(output,uglifyjs_option);
                        if(uglifyjs_result.error !== undefined){
                            reject(uglifyjs_result.error);
                        }else{
                            fs.writeFileSync(path.join(config.publish_folder,'js','libs.js'),uglifyjs_result.code,'utf-8');
                            if(true){
                                let mapFile = uglifyjs_result.map;
                                mapFile = mapFile.replace('"sources":["0"]','"sources":["libs.js"]')
                                fs.writeFileSync(path.join(config.publish_folder,'js','libs.js.map'),mapFile,'utf-8')
                            }
                        }
                    }else{
                        fs.writeFileSync(path.join(config.publish_folder,'js','libs.js'),output,'utf-8');
                    }
                    resolve();
                })
            }
            resolve();
        })
    },
    /**
     * 发布libscss
     * 
     */
    publishLibsCss(config){
        return new Promise( (resolve,reject)=>{
            let csss = files.getLibsCss();
            if(csss.length>0){
                mkdirp(path.join(config.publish_folder,'css'),error=>{
                    if(error){
                        reject(error);
                        return false;
                    }

                    let output = files.getLibsContent('css');
                    fs.writeFileSync(path.join(config.publish_folder,'css','libs.css'),output,'utf-8')
                    resolve();
                })
            }
            resolve();
        })
    },
    /**
     * 发布雪碧图
     */
    publishSprite(config){
        return new Promise( (resolve,reject)=>{
            if(memory_file.sprite_img == undefined){
                resolve();
                return false;
            }
            files.writeFileSync(path.join(config.publish_folder, 'css', 'img', 'sprites.png'), memory_file.sprite_img);
            resolve()
        })
    }
    
}