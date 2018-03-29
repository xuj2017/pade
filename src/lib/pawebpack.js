const path = require('path');
const mfs = require('./memoryfs');
const log = require('../common/log');
const files = require('../common/files');
const memory_file = require('./memory_file');
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/module/[id]-one.css');
const extractLESS = new ExtractTextPlugin({
    filename: 'css/module/[id]-two.css'
});


module.exports = {
    start() {
        log('开启webpack')
        let _self = this;
        _self.watching = undefined;
        let pageJs = files.getPageJs();
        // console.log(pageJs)
        if (pageJs.length == 0) {
            return Promise.resolve()
        }
        let webpackconfig_entry = {};
        pageJs.forEach(v => {
            if (v.path.indexOf('./') != 0) {
              v.path = './' + v.path
            }
            webpackconfig_entry[v.name] = v.path;
          });
        // console.log(webpackconfig_entry,111111)
        return new Promise((resolve, reject) => {
            let webpack_config = {
                resolve: {
                    modules: [
                      path.join(global.workdir, 'js', 'modules')
                    ],
                    extensions: ['.ts', '.tsx', '.js', '.jsx']
                  },
                entry: webpackconfig_entry,
                output: {
                    path: path.join(global.workdir, 'bundle', 'js'),
                    //publicPath: '/js',
                    filename: '[name].js'
                  },
                resolveLoader: {
                    alias: {
                        "style-loader": path.join(global.appdir, 'node_modules', 'style-loader'),
                        "css-loader": path.join(global.appdir, 'node_modules', 'css-loader'),
                        "less-loader": path.join(global.appdir, 'node_modules', 'less-loader'),
                        "file-loader": path.join(global.appdir, 'node_modules', 'file-loader'),
                        "babel-loader": path.join(global.appdir, 'node_modules', 'babel-loader'),
                        "awesome-typescript-loader": path.join(global.appdir, 'node_modules', 'awesome-typescript-loader'),
                        "raw-loader": path.join(global.appdir, 'node_modules', 'raw-loader'),
                        "base64-image-loader": path.join(global.appdir, 'node_modules', 'base64-image-loader')
                    }
                },
                module: {
                    rules: [{
                            test: /\.(hbs|txt|html)$/,
                            use: 'raw-loader'
                        },
                        {
                            test: /_base64\.(gif|png|jpg)$/,
                            use: 'base64-image-loader'
                        },
                        {
                            test: /\.css$/,
                            use: extractCSS.extract({
                                fallback: "style-loader",
                                use: "css-loader"
                            })
                        },
                        {
                            test: /\.less$/i,
                            use: extractLESS.extract([{
                                loader: 'css-loader',
                                options: {
                                    sourceMap: false
                                }
                            }, {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: false
                                }
                            }])
                        },
                        {
                            test: /\.(png|jpg|gif|jpeg)$/,
                            use: [{
                                loader: "file-loader",
                                options: {
                                    outputPath: 'img/',
                                    //publicPath: 'img'
                                    name: '[hash:10].[ext]'
                                }
                            }]
                        },
                        {
                            test: /\.tsx?$/,
                            use: [{
                                loader: "awesome-typescript-loader",
                                options: {
                                    configFileName: 'feide.config.json'
                                }
                            }]
                        }
                    ]
                },
                devtool: 'inline-source-map',
                plugins: [
                    extractCSS,
                    extractLESS
                ]
            }
            let compiler = webpack(webpack_config);
            // console.log(compiler)
            compiler.outputFileSystem = mfs;

            _self.watching = compiler.watch({
                aggregateTimeout: 500,
                ignored: /(node_modules|bundle)/
            }, (error, status) => {
                if (error == null) {
                    log('webpack编译成功', 'green')
                    resolve()
                } else {
                    log('webpack编译失败', 'red')
                    reject(error)
                }

                _self.makeModuleStyleFile()
            })
        })
    },
    stop() {
        let _self = this;
        return new Promise((resolve) => {
            if (_self.watching != undefined) {
                _slef.watching.close(() => {
                    log('关闭webpack')

                    setTimeout(function () {
                        resolve();
                    }, 500)
                })
            } else {
                resolve()
            }
        })
    },
    restart() {
        log('重启webpack');
        return new Promise((resolve, reject) => {
            this.stop().then(() => {
                return this.start()
            }).then(() => {
                log('重启webpack成功', 'green')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    makeModuleStyleFile() {
        mfs.readdir(path.join(global.workdir, 'bundle', 'js', 'css', 'module'), function (error, result) {
            if (error != undefined) {
                if (error.errno == 34) {
                    return false
                }
                log('模块Less生成失败！ ' + error.message, 'red')
                console.info(error);
                return false;
            }
            let modulestyle = [];
            result.forEach(v => {
                modulestyle.push('/*' + v + '*/\n')
                modulestyle.push(mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', 'css', 'module', v), 'utf-8'))
            })
            memory_file.modulestyle = modulestyle.join('')
            files.writeFileSync(path.join('css', '_partial', '_module_style.less'), memory_file.modulestyle)

        })
    },
    readJS(pagename) {
        // console.log(pagename)
        try {
            // console.log(mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', pagename + '.js'), 'utf-8'))
            return mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', pagename + '.js'), 'utf-8')
        } catch (error) {
            return null
        }
    },
    readCssBgimg: function (imgname) {
        return mfs.readFileSync(path.join(global.workdir, 'bundle', 'js', 'img', imgname));
    }
}