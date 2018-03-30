/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

class modal_alert{
    constructor(options){
        console.log(options)
        if(options == undefined){
            options = '发生位置错误'
        }
        if(typeof options == 'string'){
            options={
                content:options
            }
        }
        this.options = options;
    }
    show(){
        var html =$('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">提示</h4></div><div class="modal-body"><p>' + this.options.content + '</p></div><div class="modal-footer"><button type="button" class="btn btn-primary">确定</button></div></div></div></div>');
        $('body').append(html);

        html.modal('show');

        html.on('click', '.btn-primary', function(){
            html.modal('hide');
        });
        
        //模态框消失的时候
        html.on('hidden.bs.modal', function (e) {
            html.remove();
            if(this.options.onClose){
                this.options.onClose();
            }
        }.bind(this));
    }
}

module.exports = function(options){
    var new_modal_alert = new modal_alert(options);
    new_modal_alert.show();
};

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

var modal_alert = __webpack_require__(0)

$(':radio').radiocheck();

var port  = location.port;
$('#server_port').val(port)

// modal_alert({
//     content:'初始化成功！由于修改了端口号，请重启',
//     onClose:function(){
//         window.close();
//     }
// })

$('#init_submit_btn').on('click',function(){
    var project_name = $('#project_name').val();
    if(!project_name){
        return false
    }
    var server_port = $('#server_port').val();
    var new_file = $('[name="new_file"]:checked').val();

    console.log(1131123)
    $.ajax({
        url:'/init/init_project',
        type:'POST',
        dataType:'json',
        data:{
            project_name:project_name,
            server_port:server_port,
            new_file:new_file
        }
    })
    .done(function(json){
        console.log(json)
        if(json.re){
            if(server_port == port){
                modal_alert({
                    content:'初始化成功',
                    onClose:function(){
                        self.location='/';
                    }
                })
            }else{
                modal_alert({
                    content:'初始化成功！由于修改了端口号，请重启',
                    onClose:function(){
                        window.close();
                    }
                })
            }
        }else{
            modal_alert(json.message)
        }
    })
    .fail(function(error){
        console.log(error)
        modal_alert(error.message)
    })
})

/***/ })

/******/ });