const handlebars = require('handlebars');
const fs = require('fs');
const page_data = require('../common/page_data');
const  path = require('path');
module.exports = {
    /**
     * 编译文件
     * @param {path} pagepath 文件路径
     */
    compile(pagepath) {
        this.regHelper();

        let pagefile =fs.readFileSync(pagepath,'utf-8');
        let template = handlebars.compile(pagefile);
        let pagedata = page_data.get(pagepath);
         let pagelayout = pagedata.layout;
         if(!pagelayout){
             pagelayout = '';
             return template(pagedata);
         }

         let layout_path = path.join('page','_layout',pagelayout+'.hbs')
         let layoutfile = fs.readFileSync(layout_path,'utf-8');
         let layout_template = handlebars.compile(layoutfile);

         var layout_data = page_data.get(layout_path);
         layout_data.body = template(pagedata) ;

         return layout_template(layout_data)
    },
    /**
     * 注册相关helper
     */
    regHelper() {
        var blocks = {};
        handlebars.registerHelper('partial', function (name, context) {
            let partial_path = path.join('page', '_partial', name + '.hbs');
            var partialhbs = fs.readFileSync(partial_path, 'utf-8');
            var template = handlebars.compile(partialhbs);
            var pagedata = page_data.get(partial_path);
            var result = template(pagedata);
            return new handlebars.SafeString(result);
        })

        handlebars.registerHelper('extend', function (name, context) {
            var block = blocks[name];
            if (!block) {
                block = blocks[name] = [];
            }
            block.push(context.fn(this));
        });
        handlebars.registerHelper('block', function (name, context) {
            var val = (blocks[name] || []).join('\n');

            if (context.fn && val === '') {
                return context.fn(this)
            }

            blocks[name] = [];
            return val;
        });

        handlebars.registerHelper('randoms', function (value) {
            return parseInt(value) + Math.random();
        })

        handlebars.registerHelper('eachnum', function (value, option) {
            var index = parseInt(value);
            var html = '';
            for (var i = 0; i < index; i++) {
                html += option.fn(this);
            }

            return html;
        })
    }
}