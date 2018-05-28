var modal_alert = require('./modules/modal_alert/modal_alert');

$('#create_css_btn').click(function(){
    $("#create_css_template").modal('show');

    $('#create_css_form').on('submit', function (e) {
        e.preventDefault();
        create_css('#css_name',false,function () {
            $('#create_css_template').modal('hide');
            location.reload();
        }, function (message) {
          modal_alert(message);
        });
        return false;
      });  
})

$('#create_partial_css_btn').click(function(){
    $("#create_partial_css_template").modal('show');

    $('#create_partial_css_form').on('submit', function (e) {
        e.preventDefault();
        create_css('#partial_css_name',true,function () {
            $('#create_partial_css_template').modal('hide');
            location.reload();
        }, function (message) {
          modal_alert(message);
        });
        return false;
      });  
})

function create_css(id,is_parial,success,fail){
    var css_name = $.trim($(id).val());

    if(css_name == 'libs'){
        modal_alert('不要建立名为libs的js和css文件')
        return false;
    }

    $.ajax({
        url:'/page/create_css',
        type:'POST',
        dataType:'json',
        data:{
            css_name,
            is_parial:is_parial
        }
    })
    .done(function(json){
        if(json.re){
            success&& success();
        }
    })
    .fail(function(error){
        fail&&fail();
    })

}