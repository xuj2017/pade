const files = require('../common/files');
const jsonfile = require('jsonfile');
const path = require('path');

let paModule = {
    /**
     * 创建模块
     * @param {Object} options 
     * @returns Promise
     */
    create(options){
        let promise_list = [
            this.createFile(options),
            this.createJson(options)
        ]

        if(options.create_md){
            promise_list.push(this.createMDFile(options))
        }

        return Promise.all(promise_list)
    },
    /**
     * 创建模块js文件
     * @param {Object} options 
     */
    createFile(options){
        return new Promise((resolve,reject)=>{
            let module_template_name = 'new_module_default';
            switch(options.module_template){
                case 'function':
                    module_template_name = 'new_module_function';
                    break;
                case 'object':
                    module_template_name = 'new_module_object';
                    break;
                case 'prototype':
                    module_template_name = 'new_module_prototype';
                    break;
                default:
                    break;
            }
            try {
                files.createFileByTemplate(module_template_name,path.join(global.workdir,'js','modules',options.module_name,'index.js'),options);
                resolve();
            } catch (error) {
                reject(error)    
            }
        })
    },
    /**
     * 创建模块package.json
     * @param {Object} module_info 
     */
    createJson(module_info){
        return new Promise((resolve,reject)=>{
            try {
                if(module_info.module_main === '' || module_info.module_main === undefined){
                    module_info.module_main = 'index.js'
                }
                if(module_info.module_version == '' || module_info.module_version == undefined){
                    module_info.module_version = '1.0.0'
                }
                if(module_info.module_keywords == '' || module_info.module_keywords == undefined){
                    module_info.module_keywords = []
                }else{
                    module_info.module_keywords = module_info.module_keywords.split(',')
                }
                module_info.module_keywords = JSON.stringify(module_info.module_keywords)

                files.createFileByTemplate('new_module_package', path.join(global.workdir, 'js','modules',module_info.module_name, 'package.json'), module_info)
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },
    /**
     * 穿件模板README.md
     * @param {any} options 
     */
    createMDFile(options){
        return new Promise((resolve,reject)=>{
            try {
                files.createFileByTemplate('new_module_md',path.join(global.workdir,'js','modules',options.module_name, 'README.md'), options)
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },
    /**
     * 获取某个模块的信息
     * @param {any} name 
     */
    getModulePackageJson(name){
        let jsonFilePath = path.join(global.workdir,'js','modules',name,'package.json');
        if(files.exists(jsonFilePath)){
            return jsonfile.readFileSync(jsonFilePath)
        }else{
            return null
        }
    },
    /**
     * 判断模块是否已存在
     * @param {any} name 
     */
    exists(name){
        return files.exists(path.join(global.workdir,'js','modules',name))
    }
}

module.exports = paModule;