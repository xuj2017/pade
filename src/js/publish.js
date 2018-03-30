var modal_alert = require('./modules/modal_alert/modal_alert')
$('#create_publish_btn').click(function () {
    $('#create_publish_template').modal('show');
    $('#create_publish_form').on('submit', function (e) {
        e.preventDefault();
        create_publish(function () {
            $('#create_publish_template').modal('hide');
            location.reload()
        }, function (message) {
            modal_alert(message.toString());
        })
    })
})

function create_publish(success, fail) {
    var publish_name = $.trim($('#publish_name').val());
    var publish_folder = $.trim($('#publish_folder').val());
    var publish_page = $('#publish_page').is(':checked');
    var publish_compress = $('#publish_compress').is(':checked');
    $.ajax({
            url: '/publish/create_publish',
            type: 'POST',
            dataType: 'json',
            data: {
                publish_name,
                publish_folder,
                publish_page,
                publish_compress
            }
        })
        .done(function (json) {
            if (json.re) {
                if (success) {
                    success && success();
                }
            } else {
                if (fail) {
                    fail && fail(json.message);
                }
            }
        })
        .fail(function (error) {
            if (fail) {
                fail && fail(error.message);
            }
        })
}
$('.publish_publish_btn').click(function () {
    var index = $(this).data('index');
    // console.log(index)
    $.ajax({
            url: '/publish/publish',
            type: 'POST',
            dataType: 'json',
            data: {
                index
            },
        })
        .done((json) => {
            if (json.re) {
                modal_alert('发布成功！');
            } else {
                modal_alert('发布失败！' + json.message);
            }
        })
        .fail(function (error) {
            modal_alert(error.message);
        })
})