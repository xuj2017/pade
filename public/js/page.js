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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class modal_alert{
    constructor(options){
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
/* 1 */
/***/ (function(module, exports) {

class modal_confirm{
    constructor(options){
        this.option = $.extend({
            title: '提示',
            content: '',
            onCancel: null,
            onConfirm: null
        }.options);
    }
    show(){
        var html = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + this.options.title + '</h4></div><div class="modal-body"><p>' + this.options.content + '</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button> <button type="button" class="btn btn-primary">确定</button></div></div></div></div>');
        $("body").append(html);
        html.modal('show');

        html.on('click', '.btn-primary', function(){
            html.modal('hide');
            if(this.options.onConfirm){
                this.options.onConfirm();
            }
        }.bind(this));

        html.on('hidden.bs.modal', function (e) {
            html.remove();
            if(this.options.onCancel){
                this.options.onCancel();
            }
        }.bind(this));
    }
}

module.exports = options =>{
    var new_modal_confirm = new modal_confirm(options);
    new_modal_confirm.show();
}

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var modal_alert = __webpack_require__(0);
var modal_confirm = __webpack_require__(1);
// var error_message = require('./modules/error_message/error_message');
$('#create_page_btn').click(function(){
    $("#create_page_template").modal('show');

    $('#create_page_form').on('submit', function (e) {
        e.preventDefault();
        create_page(function () {
            $('#create_page_template').modal('hide');
            location.reload();
        }, function (message) {
          console.info(message);
          modal_alert(message);
        });
        return false;
      });  
})

function create_page(success,fail){
    var page_name = $.trim($('#page_name').val());
    var extra_js = $('#extra_js').is(':checked');
    var extra_less = $('#extra_less').is(':checked');
    var page_layout = $('#page_layout').val();

    if(page_name == 'libs' && (extra_js || extra_less)){
        modal_alert('不要建立名为libs的js和css文件')
        return false;
    }

    $.ajax({
        url:'/page/create_page',
        type:'POST',
        dataType:'json',
        data:{
            page_name,
            extra_js,
            extra_less,
            page_layout
        }
    })
    .done(function(json){
        console.log(json)
        if(json.re){
            success&& success();
        }
    })
    .fail(function(error){
        fail&&fail();
    })

}

$('#create_layout_btn').click(function(){
    $('#create_layout_template').modal('show');

    $('#create_layout_form').on('submit',function(e){
        e.preventDefault();
        create_layout(function(){
            $('#create_layout_form').modal('hide');
            location.reload();
        },function (message) {
            console.info(message);
            modal_alert(message);
        })
        // console.log(12313)
    })
})

function create_layout(success, fail) {
    var layout_name = $.trim($('#layout_name').val());
  
    $.ajax({
        url: '/page/create_layout',
        type: 'POST',
        dataType: 'json',
        data: {
          layout_name: layout_name
        }
      })
      .done(function (json) {
        if (json.re) {
          if (success) {
            success();
          }
        } else {
          if (fail) {
            fail(json.message);
          }
        }
      })
      .fail(function (error) {
        if (fail) {
          fail(error.message);
        }
      })
  };

  $('#create_partial_btn').click(function(){
    $('#create_partial_template').modal('show');
    $('#create_partial_form').on('submit',function(e){
        e.preventDefault();
        create_partial(function(){
            $('#create_partial_template').modal('hide');
            location.reload();
        },function (message) {
            console.info(message);
            modal_alert(message);
        })
        // console.log(12313)
    })
})

function create_partial(success, fail) {
    var partial_name = $.trim($('#partial_name').val());
  
    $.ajax({
        url: '/page/create_partial',
        type: 'POST',
        dataType: 'json',
        data: {
            partial_name: partial_name
        }
      })
      .done(function (json) {
        if (json.re) {
          if (success) {
            success();
          }
        } else {
          if (fail) {
            fail(json.message);
          }
        }
      })
      .fail(function (error) {
        if (fail) {
          fail(error.message);
        }
      })
  };

/***/ })
/******/ ]);