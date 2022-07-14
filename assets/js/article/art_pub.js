$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()


    // 定义获取 文章分类 的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类识别!')
                }

                layer.msg('获取文章分类成功')
                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                // 将 模板字符串 渲染到页面上
                $('#cate_id').html(htmlStr)
                // 调用form.render() 重新渲染表格
                form.render()
            }
        })
    }

    // 图片裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 选择 照片 作为封面
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的change事件 
    $('#coverFile').on('change', function (e) {
        // 拿到 文件列表
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }

        // 将 图片文件 转换为 对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 监听 文章发表的状态,默认为已发布
    var art_state = '已发布'

    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 监听表单的submit事件,
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止默认提交行为
        e.preventDefault()

        // 2.创建form.data对象 获取表单中的数据
        var fd = new FormData($(this)[0])

        // 3. 将 文章发布状态 追加 fd对象中
        fd.append('state', art_state)

        // fd.forEach(function (v, k) {
        //     console.log(k, v)
        // })

        // 4. 将封面裁剪过后的文件，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 5. 将文件对象 存储到 fd中
                fd.append('cover_img', blob)

                // 6. 发起ajax请求 实现添加文章
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果 发送的数据是fd格式的 需要添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败! ')
                }

                layer.msg('发布文章成功! ')
                // 跳转到 文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})