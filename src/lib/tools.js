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
    }
}