!function(o){var e={};function t(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return o[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}t.m=o,t.c=e,t.d=function(o,e,r){t.o(o,e)||Object.defineProperty(o,e,{configurable:!1,enumerable:!0,get:r})},t.r=function(o){Object.defineProperty(o,"__esModule",{value:!0})},t.n=function(o){var e=o&&o.__esModule?function(){return o.default}:function(){return o};return t.d(e,"a",e),e},t.o=function(o,e){return Object.prototype.hasOwnProperty.call(o,e)},t.p="",t(t.s=3)}([function(o,e){o.exports=function(o){new class{constructor(o){console.log(o),void 0==o&&(o="发生位置错误"),"string"==typeof o&&(o={content:o}),this.options=o}show(){var o=$('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">提示</h4></div><div class="modal-body"><p>'+this.options.content+'</p></div><div class="modal-footer"><button type="button" class="btn btn-primary">确定</button></div></div></div></div>');$("body").append(o),o.modal("show"),o.on("click",".btn-primary",function(){o.modal("hide")}),o.on("hidden.bs.modal",function(e){o.remove(),this.options.onClose&&this.options.onClose()}.bind(this))}}(o).show()}},,,function(o,e,t){const r=t(0);({getRuleHtml:()=>Handlebars.compile($("#create_proxy_rule_template").html())({}),add(){$("#proxy_rules").append(this.getRuleHtml())},bind(){var o=this;$("#add_proxy_rule").click(function(){o.add()}),$("#proxy_rules").on("click",".rule_moveup",function(){var o=$(this).parents(".proxy_rules_item"),e=o.index();0!=e&&$(".proxy_rules_item").eq(e-1).before(o)}),$("#proxy_rules").on("click",".rule_movedown",function(){var o=$(this).parents(".proxy_rules_item"),e=o.index();e!=$(".proxy_rules_item").length-1&&$(".proxy_rules_item").eq(e+1).after(o)}),$("#proxy_rules").on("click",".delete_rule",function(){$(".proxy_rules_item").length>1?$(this).parents(".proxy_rules_item").remove():modal_alert({content:"最后一条规则不能删除！"})}),$("#save_proxy").click(function(){let o=$("#portnum").val();var e=[];return $(".proxy_rules_item").each(function(o,t){e.push({route:$(".porxy_route",$(t)).val(),url:$(".porxy_url",$(t)).val()})}),console.log(o),$.ajax({url:"/proxy/save",type:"POST",dataType:"json",data:{rules:JSON.stringify(e),portnum:o}}).done(function(o){o.re&&($("#save_proxy_tips").show(),setTimeout(function(){$("#save_proxy_tips").hide()},3e3))}).fail(function(o){r(o.message)}),!1})},init(){this.bind()}}).init(),$("#open_proxy_form").on("submit",function(o){o.preventDefault();var e=$("#portnum").val(),t=[];return $(".proxy_rules_item").each(function(o,e){t.push({route:$(".porxy_route",$(e)).val(),url:$(".porxy_url",$(e)).val()})}),$.ajax({url:"/proxy/open",type:"POST",dataType:"json",data:{rules:JSON.stringify(t),portnum:e}}).done(function(o){console.info(o),o.re&&($("#open_proxy").prop("disabled",!0),$("#close_proxy").prop("disabled",!1),$("#portnum").add(".porxy_route").add(".porxy_url").add(".rule_moveup").add(".rule_movedown").add(".delete_rule").add("#add_proxy_rule").prop("disabled",!0))}).fail(function(o){}).always(function(){}),!1}),$("#close_proxy").on("click",function(){$.ajax({url:"/proxy/close",type:"GET",dataType:"json",data:{}}).done(function(o){o.re&&($("#open_proxy").prop("disabled",!1),$("#close_proxy").prop("disabled",!0),$("#portnum").add(".porxy_route").add(".porxy_url").add(".rule_moveup").add(".rule_movedown").add(".delete_rule").add("#add_proxy_rule").prop("disabled",!1))}).fail(function(o){}).always(function(){})})}]);