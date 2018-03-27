var modal_alert = require('./modules/modal_alert/modal_alert');
var modal_confirm = require('./modules/modal_confirm/modal_confirm');
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