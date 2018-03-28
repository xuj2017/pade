const  path = require('path');
const exists = require('fs-exists-sync');
const jsonfile = require('jsonfile')
const _ = require('lodash');
const fs = require('fs');

module.exports = {
    //获取相应的模板数据json文件路径
    getDataPath:function(filepath){
        let basename = path.basename(filepath, '.hbs');
        return path.join(path.dirname(filepath), basename + '.json');
    },
    save:function(filepath,data){
        let datafile_path = this.getDataPath(filepath);
        let filedata = {};
        if(exists(datafile_path)){
            filedata = jsonfile.readFileSync(datafile_path)
        }
        filedata = _.extend(filedata,data)
        jsonfile.writeFileSync(datafile_path,filedata,{spaces:2})
    },
    get(filepath){
        let datafile_path = this.getDataPath(filepath);
        if(exists(datafile_path)){
            return jsonfile.readFileSync(datafile_path)
        }else{
            return {};
        }
    }
}