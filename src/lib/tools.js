const fs = require("fs");

module.exports = {
    getFileNameFromUrl(url){
        let lastXg = url.lastIndexOf('/')+1;
        return url.substring(lastXg)
    },
    readBigFile(filePath,callback){
        let stream = fs.createReadStream(filePath);
        let data = '';
        stream.on('data',(chunk)=>{
            data += chunk;
        })
        stream.on('end',()=>{
            callback(data);
        })
    },
    getFileNameFromPath(url){
        let lastXg = url.lastIndexOf('\\');
        return url.substring(lastXg+1);
    },
    getFilenameNoSuffixFromUrl(url){
        let fileName = this.getFileNameFromPath(url);
        if(fileName.lastIndexOf('.')>0){
            return fileName.substring(0,fileName.lastIndexOf('.'))
        }
        return fileName;
    }
}