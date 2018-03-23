var modal_alert = require('./modules/modal-alert/modal_alert')

$(':radio').radiocheck();

var port  = location.port;
$('#server_port').val(port)

// modal_alert({
//     content:'初始化成功！由于修改了端口号，请重启',
//     onClose:function(){
//         window.close();
//     }
// })

$('#init_submit_btn').on('click',function(){
    var project_name = $('#project_name').val();
    if(!project_name){
        return false
    }
    var server_port = $('#server_port').val();
    var new_file = $('[name="new_file"]:checked').val();

    console.log(1131123)
    $.ajax({
        url:'/init/init_project',
        type:'POST',
        dataType:'json',
        data:{
            project_name:project_name,
            server_port:server_port,
            new_file:new_file
        }
    })
    .done(function(json){
        console.log(json)
        if(json.re){
            if(server_port == port){
                modal_alert({
                    content:'初始化成功',
                    onClose:function(){
                        self.location='/';
                    }
                })
            }else{
                modal_alert({
                    content:'初始化成功！由于修改了端口号，请重启',
                    onClose:function(){
                        window.close();
                    }
                })
            }
        }else{
            modal_alert(json.message)
        }
    })
    .fail(function(error){
        console.log(error)
        modal_alert(error.message)
    })
})