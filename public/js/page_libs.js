!function(e){var t={};function r(a){if(t[a])return t[a].exports;var l=t[a]={i:a,l:!1,exports:{}};return e[a].call(l.exports,l,l.exports,r),l.l=!0,l.exports}r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:a})},r.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=5)}({12:function(e,t){e.exports=function(e,t,r){var a="warning";r&&(a=r),""==e.html()&&e.html('<div class="alert alert-dismissible alert-'+a+'"><button type="button" class="close" data-dismiss="alert">&times;</button><p>'+t+"</p></div>")}},5:function(e,t,r){const a=r(12);$("#header_nav li:eq(0)").addClass("active"),$("#create_libs_btn").on("click",()=>{$("#create_libs_modal").modal("show"),$("#create_libs_form").on("submit",e=>{e.preventDefault();let t="",r="";return $("#create_libs_uploadFile").is(":visible")?t=$("#create_libs_uploadFile").val():r=$.trim($("#create_libs_uploadUrl").val()),""!==t||""!==r?function(e,t,r,a){if(""!==e){let e=new FormData;return e.append("create_libs_uploadFile",$("#create_libs_uploadFile")[0].files[0]),$.ajax({url:"/libs/create_libsUpload",type:"POST",dataType:"json",data:e,processData:!1,contentType:!1,success(e){e.re&&r?r():a&&a(e.message)},error(e){a(a.message)}}),!1}if(""!==t)return $.ajax({url:"/libs/create_libsUrl",type:"POST",dataType:"json",data:{create_libs_uploadUrl:t},success(e){e.re&&r?r():a&&a(e.message)},error(e){a(a.message)}}),!1}(t,r,()=>{location.reload()},()=>{a($("#error_message"),"发生未知错误")}):a($("#error_message"),"请选择一种上传文件的方式！"),!1})})}});