const jsonfile = require('jsonfile');
const path = require('path');

module.exports = {
    save(json){
        jsonfile.writeFileSync(path.join(global.workdir,'pade.config.json'),json,{space:2});
    },
    get(){
        return jsonfile.readFileSync(path.join(global.workdir,'pade.config.json'));
    }
}