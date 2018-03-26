const fs = require('fs');
const exists = require('fs-exists-sync');
const handlebars = require('handlebars');
const mkdir = require('mkdirp');
const path = require('path');
const glob = require('glob');

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
        let template = fs.readFileSync(path.join(global.appdir,'src','template',filename+'.hbs'),'utf-8');
        let file_content = handlebars.compile(template)(options);
        this.writeFileSync(filepath,file_content)
    },
    /**
     * 获取文件接班信息
     * @param {any} globpath 文件路径
     * @param {any} options glob配置
     */
    getFileBaseInfo(globpath,options){
        return new Promise( (resolve,reject)=>{
            glob(globpath,options,function(error,files){
                if(error){
                    reject(error)
                }
                resolve(files.map(v=>{
                    return {
                        name:path.basename(v,path.extname(v)),
                        filename:path.basename(v),
                        path:v
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
    getFileInfo(globpath,options){
        return new Promise( (resolve,reject) =>{
            this.getFileBaseInfo(globpath,options).then(files=>{
                resolve(files.map(v =>{
                    let stat = fs.lstatSync(v.path)
                    return {
                        name:v.name,
                        filename:v.filename,
                        path:v.path,
                        size:stat.size,
                        mtime:stat.mtime,
                        ctime:stat.atime
                    }
                }))
            }).catch(error => {
                reject(error)
            })
        })
    }
}

module.exports = files