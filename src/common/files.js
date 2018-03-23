const fs = require('fs');
const exists = require('fs-exists-sync');
const handlebars = require('handlebars');
const mkdir = require('mkdirp');
const path = require('path');

let files ={
    /**
     * 用于判断文件是否存在
     * 
     * @param {any} filepath 文件名
     * @returns 
     */
    exists(filepath){
        return exists(filepath);
    },
    /**
     * 用于创建文件并写入内容
     * 
     * @param {any} filepath 文件名
     * @param {any} content 内容
     * @param {any} options 参数
     */
    writeFileSync(filepath,content,options){
        this.createDirectory(filepath);
        fs.writeFileSync(filepath,content,options);
    },
    /**
     * 创建目录
     * @param {any} filepath 
     */
    createDirectory(filepath){
        console.log('目录')
        var dir = path.dirname(filepath);
        if(exists(dir))return
        mkdir.sync(dir);
    },
    /**
     * 使用预设模板创建文件
     * @param {any} filename 文件名
     * @param {any} filepath 路径
     * @param {any} options 参数数据
     */
    createFileByTemplate(filename,filepath,options){
        console.log('模板')
        let template = fs.readFileSync(path.join(global.appdir,'src','template',filename+'.hbs'),'utf-8');
        let file_content = handlebars.compile(template)(options);
        this.writeFileSync(filepath,file_content)
    }
}

module.exports = files