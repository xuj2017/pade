var modal_alert = require('./modules/modal_alert/modal_alert');
var modal_confirm = require('./modules/modal_confirm/modal_confirm');
// var error_message = require('./modules/error_message/error_message');
$('#create_page_btn').click(function(){
    $("#create_page_template").modal('show');
})

console.log(layoutArr)
console.log(JSON.parse(layoutArr.replace(/&quot;/gi,'"')) )