const path = require('path');

module.exports = {
    newver:null,
    /**
     * 获取新版本
     * 
     * @returns 
     */
    get(){
        let _self =this;
        return new Promise( (resolve,reject) => {
            if(_self.newver = null){
                let request = require('request');
                request('https://registry.npm.taobao.org/pade',function(error,response,body){
                    if(error){
                        reject(error)
                    }else{
                        let npmjson = JSON.parse(body);
                        let newver = npmjson['dist-tags'].latest
                        _self.newver = newver;
                        resolve(newver)
                    }
                })
            }else{
                return resolve(_self.newver)
            }
        })
    },
    /**
     * 检测新版本
     */
    hasnew(){
        let _self = this;
        let jsonfile = require('jsonfile');
        let nowver = jsonfile.readFileSync(path.join(global.appdir,'package.json')).version
        return new Promise( (resolve,reject)=>{
            _self.get().then(newver=>{
                resolve({
                    isnew:_self.compareNew(newer,nowver),newer:newver
                })
            }).catch(error=>{
                reject(error)
            })
        })
    },
    /**
     * 比较版本号
     * @param {any} newver 新版本号 
     * @param {any} nowver 现在版本号
     */
    compareNew(newver,nowver){
        let newver_array = newver.split('.')
        let nowver_array = nowver.split('.')
        if(newver_array[0] > nowver_array[0]) return true
        if(newver_array[1] > nowver_array[1]) return true
        if(newver_array[2] > nowver_array[2]) return true
        return false
    }
}

