const error_message = require('./modules/eroor_message');

$('#header_nav li:eq(0)').addClass('active');

$('#create_libs_btn').on('click',()=>{
    $('#create_libs_modal').modal('show');

    $('#create_libs_form').on('submit',(e)=>{
        e.preventDefault();
        
        let create_libs_uploadFile = "";
        let create_libs_uploadUrl = "";

        if($("#create_libs_uploadFile").is(':visible')){
            create_libs_uploadFile = $("#create_libs_uploadFile").val();
        }else{
            create_libs_uploadUrl = $.trim($("#create_libs_uploadUrl").val())
        }

        if(create_libs_uploadFile !== '' || create_libs_uploadUrl !== ''){
            create_libs(create_libs_uploadFile,create_libs_uploadUrl,()=>{
                location.reload();
            },()=>{
                error_message($('#error_message'), '发生未知错误');
            })
        }else{
            error_message($('#error_message'), '请选择一种上传文件的方式！');
        }

        return false;
    })

})


function create_libs(create_libs_uploadFile,create_libs_uploadUrl,success,error){
    if(create_libs_uploadFile !==''){
        let data = new FormData();
        data.append('create_libs_uploadFile',$("#create_libs_uploadFile")[0].files[0])
        $.ajax({
            url:'/libs/create_libsUpload',
            type: 'POST',
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false,
            success(json){
                if(json.re && success){
                    success();
                }else{
                    error && error(json.message)
                }
            },
            error(err){
                error(error.message)
            }
        })
        return false;
    }

    if(create_libs_uploadUrl !== ''){
        $.ajax({
            url:'/libs/create_libsUrl',
            type: 'POST',
            dataType: 'json',
            data: {
                create_libs_uploadUrl: create_libs_uploadUrl
            },
            success(json){
                if(json.re && success){
                    success();
                }else{
                    error && error(json.message)
                }
            },
            error(err){
                error(error.message)
            }
        })
        return false;
    }

    return false;
}