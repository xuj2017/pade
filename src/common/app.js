var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
const glob = require('glob')
var hbs = require('hbs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('./log');
var webpack = require('webpack');
var webpackConfig = require('../../webpack.config');

// var index = require('../routes/index');
// var users = require('../routes/users');
// var init = require('../routes/init');

var app = express();

// view engine setup
app.set('views', path.join(global.appdir, 'views'));
app.set('view engine', 'hbs');

let routes_list ={};

glob.sync('./src/routes/*.js',{
  cwd: global.appdir
}).forEach(item => {
  let filename = path.basename(item,'.js');
  routes_list[filename] = require(path.join(global.appdir,'src','routes',filename))
})


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));


// var compiler = webpack(webpackConfig)

// var devMiddleware = require('webpack-dev-middleware')(compiler, {
//   publicPath: webpackConfig.output.publicPath
// })

// var hotMiddleware = require('webpack-hot-middleware')(compiler, {
//   log: () => {}
// })

// app.use(devMiddleware)
// app.use(hotMiddleware)

hbs.registerHelper('partial', function (name, context) {
  var partialhbs = fs.readFileSync(name, 'utf-8');
  var template = hbs.handlebars.compile(partialhbs);
  var result = template({
    name: 'hello'
  });
  return new hbs.handlebars.SafeString(result);
});

var blocks = {};
hbs.registerHelper('extend', function (name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function (name, context) {
  var val = (blocks[name] || []).join('\n');
  // clear the block
  blocks[name] = [];
  return val;
});

hbs.registerHelper('randoms',function(value){
  return parseInt(value)+Math.random();
})

function fillzero(num){
  if(num < 10){
    return '0' + num;
  }
  return num.toString();
}

hbs.registerHelper('showTime', function (date) {
  var thisdate = new Date(date);
  return thisdate.getFullYear() + '/' + (thisdate.getMonth() + 1) + '/' + thisdate.getDate() + ' ' + thisdate.getHours() + ':' + fillzero(thisdate.getMinutes());
});

hbs.registerHelper('varable',function(data){
  return JSON.stringify(data).toString();
})

hbs.registerHelper('extname',function(data){
  return path.extname(data);
})

hbs.registerHelper('showFileSize', function (size) {
  var size = parseInt(size);
  var out = size;
  var hz = '';
  if (size > 1024 * 1024) {
    out = size / (1024 * 1024);
    hz = 'MB';
  }
  else if(size > 1024){
    out = size / 1024;
    hz = 'KB';    
  }
  else{
    hz = 'B';    
  }
  
  if(size > 1024){
    if(out >= 100){
      out = out.toFixed(0);
    }
    else if(out >= 10){
      out = out.toFixed(1);
    }
    else{
      out = out.toFixed(2);
    }    
  }


  return out + ' ' + hz;
});

hbs.registerHelper('tslink', function (path) {
  if (path.substring(path.length - 3) == '.ts') {
    return path.substring(0, path.length - 2) + 'js'
  }
  return path
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(global.appdir, 'public')));

for(let v in routes_list){
  if(v == 'index') app.use('/',routes_list[v])

  app.use('/'+v,routes_list[v])
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
module.exports = function(port){
  return new Promise( (resolve,reject) =>{
    app.listen(port,function(){
      resolve();
      log("前端项目管理服务启动 端口号:" + port, 'green');
    })
  })
}
