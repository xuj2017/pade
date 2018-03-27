const fs = require('fs');
const exists = require('fs-exists-sync');
const handlebars = require('handlebars');
const mkdir = require('mkdirp');
const path = require('path');
const glob = require('glob');
const page_data = require('./page_data');

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
        console.log('lalala')
        fs.writeFileSync(filepath, content, options);
    },
    /**
     * 创建目录
     * @param {any} filepath 
     */
    createDirectory(filepath) {
        console.log('目录')
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
    }
}

module.exports = files