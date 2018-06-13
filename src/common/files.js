const fs = require('fs');
const exists = require('fs-exists-sync');
const handlebars = require('handlebars');
const mkdir = require('mkdirp');
const path = require('path');
const glob = require('glob');
const page_data = require('./page_data');
const log = require('./log');

let files = {
    /**
     * 用于判断文件是否存在
     * 
     * @param {any} filepath 文件名
     * @returns 
     */
    exists(filepath) {
        return exists(filepath);
    },
    /**
     * 用于创建文件并写入内容
     * 
     * @param {any} filepath 文件名
     * @param {any} content 内容
     * @param {any} options 参数
     */
    writeFileSync(filepath, content, options) {
        this.createDirectory(filepath);
        // console.log('lalala')
        fs.writeFileSync(filepath, content, options);
        log(`创建文件${filepath}成功`, 'green')
    },
    /**
     * 创建目录
     * @param {any} filepath 
     */
    createDirectory(filepath) {
        // console.log('目录')
        var dir = path.dirname(filepath);
        if (exists(dir)) return
        mkdir.sync(dir);
    },
    /**
     * 使用预设模板创建文件
     * @param {any} filename 文件名
     * @param {any} filepath 路径
     * @param {any} options 参数数据
     */
    createFileByTemplate(filename, filepath, options) {
        let template = fs.readFileSync(path.join(global.appdir, 'src', 'template', filename + '.hbs'), 'utf-8');
        let file_content = handlebars.compile(template)(options);
        this.writeFileSync(filepath, file_content)
    },
    /**
     * 获取文件接班信息
     * @param {any} globpath 文件路径
     * @param {any} options glob配置
     */
    getFileBaseInfo(globpath, options) {
        return new Promise((resolve, reject) => {
            glob(globpath, options, function (error, files) {
                if (error) {
                    reject(error)
                }
                resolve(files.map(v => {
                    return {
                        name: path.basename(v, path.extname(v)),
                        filename: path.basename(v),
                        path: v
                    }
                }))
            })
        })
    },
    /**
     * 获取文件详细信息
     * 
     * @param {any} globpath 文件路径
     * @param {any} options glob配置
     */
    getFileInfo(globpath, options) {
        return new Promise((resolve, reject) => {
            this.getFileBaseInfo(globpath, options).then(files => {
                resolve(files.map(v => {
                    let stat = fs.lstatSync(v.path)
                    return {
                        name: v.name,
                        filename: v.filename,
                        path: v.path,
                        size: stat.size,
                        mtime: stat.mtime,
                        ctime: stat.atime
                    }
                }))
            }).catch(error => {
                reject(error)
            })
        })
    },
    /**
     * 创建新页面
     * 
     * @param {any} name 文件名
     * @param {any} options 相关选项
     */
    createNewPage(name, options) {
        var _self = this;
        return new Promise((resolve, reject) => {
            try {
                _self.createFileByTemplate('new_page', path.join(global.workdir, 'page', name + '.hbs'), options);
                if (options.extra_js) {
                    _self.createFileByTemplate('new_pagejs', path.join(global.workdir, 'js', name + '.js'), options);
                }
                if (options.extra_less) {
                    _self.createFileByTemplate('new_pageless', path.join(global.workdir, 'css', name + '.less'), options);
                }
                if (options.page_layout) {
                    page_data.save(path.join(global.workdir, 'page', name + '.hbs'), {
                        layout: options.page_layout
                    })
                }
                resolve('success');
            } catch (error) {
                reject();
            }
        })
    },
    /**
     * glob相对路径转换为node相对路径
     * 
     * @param {any} pathstr 
     * @returns 
     */
    globPathToNodePath(pathstr) {
        if (pathstr.indexOf('./') != 0 && pathstr.indexOf(':') < 0) {
            pathstr = './' + pathstr;
        }
        return pathstr
    },
    /**
     * 获取文件信息
     * @param {any} globpath 
     * @param {any} options 
     */
    getFileBaseInfoSync(globpath, options) {
        return glob.sync(globpath, options).map(v => {
            return {
                name: path.basename(v, path.extname(v)),
                filename: path.basename(v),
                path: this.globPathToNodePath(v)
            }
        })
    },
    /**
     * 复制文件
     * @param {any} source 
     * @param {any} target 
     */
    copyFile(source, target) {
        // console.log(source, target);
       return new Promise((resolve, reject) => {
            let readStream = fs.createReadStream(source);
            this.createDirectory(target);

            readStream.once('error', (err) => {
                reject(error)
            })

            readStream.once('end', () => {
                resolve()
            })
            readStream.pipe(fs.createWriteStream(target));
        })
    },
    /**
     * 获取js文件信息
     * 
     * @returns 
     */
    getPageJs() {
        return this.getFileBaseInfoSync('js/*.{js,jsx,ts,tsx}', {})
    },
    /**
     * 获取css文件信息
     * 
     * @returns 
     */
    getPageLess() {
        return this.getFileBaseInfoSync('css/*.{css,less,scss}', {})
    },
    /**
     * 获取页面信息
     * 
     * @returns 
     */
    getPageHbs() {
        return this.getFileBaseInfoSync('page/**/*.hbs', {
            ignore: 'page/+(_layout|_partial)/*.hbs'
        })
    },
    /**
     * 获取libs js文件信息
     */
    getLibsJs(){
        return this.getFileBaseInfoSync('libs/**/*.js',{})
    },
    /**
     * 获取libs css文件信息
     */
    getLibsCss(){
        return this.getFileBaseInfoSync('libs/**/*.css',{})
    },
    /**
     * 获取libs文件内容
     */
    getLibsContent(type){
        let pageList;
        if(type === 'js'){
            pageList = this.getLibsJs();
        }else if(type === 'css'){
            pageList = this.getLibsCss();
        }else{
            return ''
        }
        let result = [];

        pageList.sort()

        pageList.forEach(function (v) {
            result.push(fs.readFileSync(v.path, 'utf-8'));
        });      
        
        return result.join('\n');
    },
    /**
     * 获取模块列表
     */
    getModules(){
        return new Promise((resolve,reject)=>{
            const paModule = require('../lib/paModules');
            this.getFileBaseInfo('js/modules/*/',{}).then(modules=>{
                modules.forEach(v=>{
                    v.json = paModule.getModulePackageJson(v.name);
                })
                resolve(modules)
            }).catch(error=>{
                reject(error)
            })
        })
    },
    /**
     * 获取sprite图片列表
     */
    getSpriteImg(){
        return this.getFileBaseInfoSync('css/_sprite/*.{jpg,png,gif}',{})
    }
}

module.exports = files