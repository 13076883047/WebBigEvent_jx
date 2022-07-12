$(function () {
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })


    // 改变 裁剪区域中的图片
    $('#file').on('change', function (e) {
        // console.log(e)
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片!')
        }

        // 1. 拿到用户选择的图片
        var file = e.target.files[0]
        // 2. 将文件转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 将 裁剪之后的图片 上传到 服务器
    $('#btnUpload').on('click', function () {

        // 1. 获取到 裁剪后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');      // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2. 调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传头像失败!')
                }

                layer.msg('上传头像成功!')
                window.parent.getUserInfo()
            }
        })

    })
})