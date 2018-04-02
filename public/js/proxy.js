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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

const model_alert = __webpack_require__(0);


var proxy = {
    getRuleHtml() {
        return Handlebars.compile($("#create_proxy_rule_template").html())({});
    },
    add() {
        $('#proxy_rules').append(this.getRuleHtml());
    },
    bind() {
        var _self = this;
        $('#add_proxy_rule').click(function () {
            _self.add()
        })
        $('#proxy_rules').on('click', '.rule_moveup', function () {
            var thisrule = $(this).parents('.proxy_rules_item');
            var thisindex = thisrule.index();
            if (thisindex != 0) {
                $('.proxy_rules_item').eq(thisindex - 1).before(thisrule);
            }
        });

        $('#proxy_rules').on('click', '.rule_movedown', function () {
            var thisrule = $(this).parents('.proxy_rules_item');
            var thisindex = thisrule.index();
            if (thisindex != ($('.proxy_rules_item').length - 1)) {
                $('.proxy_rules_item').eq(thisindex + 1).after(thisrule);
            }
        });

        $('#proxy_rules').on('click', '.delete_rule', function () {
            if ($('.proxy_rules_item').length > 1) {
                $(this).parents('.proxy_rules_item').remove();
            } else {
                modal_alert({
                    content: '最后一条规则不能删除！'
                });
            }

        });

        $('#save_proxy').click(function () {
            let portnum = $('#portnum').val();
            var rules = [];

            $('.proxy_rules_item').each(function (i, v) {
                rules.push({
                    route: $('.porxy_route', $(v)).val(),
                    url: $('.porxy_url', $(v)).val()
                });
            });
            
            console.log(portnum)

            $.ajax({
                url: '/proxy/save',
                type: 'POST',
                dataType: 'json',
                data: {
                  rules: JSON.stringify(rules),
                  portnum: portnum
                }
              })
              .done(function (json) {
                if (json.re) {
                  $('#save_proxy_tips').show();
                  setTimeout(function () {
                    $('#save_proxy_tips').hide();
                  }, 3000);
                }
              })
              .fail(function (error) {
                model_alert(error.message)
              })
              
            return false;
        })
    },
    init() {
        this.add();
        this.bind();
    }
}

proxy.init();

/***/ })

/******/ });