!function(t){var s={};function n(e){if(s[e])return s[e].exports;var r=s[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=s,n.d=function(t,s,e){n.o(t,s)||Object.defineProperty(t,s,{configurable:!1,enumerable:!0,get:e})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(s,"a",s),s},n.o=function(t,s){return Object.prototype.hasOwnProperty.call(t,s)},n.p="",n(n.s=9)}({8:function(t,s){var n=["public文件夹里面都是不需要做任何处理的文件，发布的时候将原封不动的复制到指定文件夹。","libs文件夹里面的内容不会被编译，里面的所有的js和css文件会被合并成 js/libs.js 和 css/libs.css。","样式文件支持三种格式，less,scss,css，其中css格式不会进行编译处理。","js文件支持三种形式，原生的js，需要Babel.js处理的ES6语法js，和Typescript，默认是原生的js，Babel.js需要在设置中开启才能使用。","系统不提供删除文件的功能（本来是有的），因为在Node.js里面删除文件不会进入回收站，会直接彻底删除。","代理服务是前后端结合开发的利器，代理掉其他网站的接口是最常用的方法"],e=Math.floor(Math.random()*n.length),r=$('<div class="jumbotron"><h3>Tips</h3><p class="content"></p><p><a class="btn btn-primary btn-lg next_tips">下一条</a> <a class="btn btn-primary btn-lg pre_tips">上一条</a></p></div>');function i(t){$(".content",r).text(n[t]+"("+(t+1)+"/"+n.length+")")}i(e),r.on("click",".next_tips",function(){++e==n.length&&(e=0),i(e)}),r.on("click",".pre_tips",function(){-1==--e&&(e=n.length-1),i(e)}),t.exports=function(t){t.html(r)}},9:function(t,s,n){n(8)($("#tips")),$.ajax({url:"/home/newver",type:"GET",dataType:"json",success:function(t){if(t.re&&t.result.isnew){var s=$('<div class="alert alert-dismissible alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button>有新版本！ 新版本号：<span id="newver">'+t.result.newver+"</span></div>");$("#hasnew").html(s)}}})}});