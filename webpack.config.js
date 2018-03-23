const path = require('path');
const glob = require('glob');

let webpack_entry ={};

glob.sync('./src/js/*.js').forEach(v=>{
    let filename = path.basename(v,'.js')
    webpack_entry[filename] = v;
})


module.exports = {
    entry:webpack_entry,
    output:{
        path: __dirname + "/public/js",
        filename: "[name].js"
    },
    module:{
        rules:[

        ]
    }
}

