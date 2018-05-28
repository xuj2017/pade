var modal_alert = require('./modules/modal_alert/modal_alert');

$('#create_js_btn').click(function(){
    $("#create_js_template").modal('show');

    $('#create_js_form').on('submit', function (e) {
        e.preventDefault();
        create_js(function () {
            $('#create_js_template').modal('hide');
            location.reload();
        }, function (message) {
          modal_alert(message);
        });
        return false;
      });  
})

function create_js(success,fail){
    var js_name = $.trim($('#js_name').val());

    if(js_name == 'libs'){
        modal_alert('不要建立名为libs的js和css文件')
        return false;
    }

    $.ajax({
        url:'/page/create_js',
        type:'POST',
        dataType:'json',
        data:{
            js_name
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