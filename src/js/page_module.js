const modal_alert = require('./modules/modal_alert/modal_alert');

$('#create_module_btn').click(function () {
    $('#create_module_template').modal('show');

    setTimeout(function () {
        $('#module_name').focus()
    }, 500)

    $('#create_module_form').on('submit', function (e) {
        e.preventDefault();
        create_module(function () {
          location.reload();
        }, function (message) {
          modal_alert(message)
        });
        return false
      }); 
})

function create_module(success,fail){
    let module_name = $.trim($('#module_name').val());
    let module_description = $.trim($('#module_description').val());
    let module_template = $('#module_template').val();
    let create_md = $('#create_md').is(':checked');

    $.ajax({
        url:'/modules/create_module',
        type:'POST',
        dataType:'json',
        data:{
            module_name,
            module_description,
            module_template,
            create_md
        },
        success(json){
            if(json.re){
                success && success(json)
            }else{
                fail && fail(json.message)
            }
        },
        error(error){
            fail && fail(error.message)
        }
    })
}
