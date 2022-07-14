$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()
    // 初始化文章分类列表，从服务器获取数据 并 通过模板引擎渲染
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)

                // 调用模板引擎，返回 html的字符串
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 因为 添加文章分类 的 弹出层不是 默认在 页面内的，
    // 所以要使用 事件委托的方法添加点击事件
    // 发起ajax请求添加文章分类

    // 添加按钮功能
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('新增文章分类失败!')
                }

                // 新增成功 todo
                // 重新渲染页面
                initArtCateList()
                layer.msg('新增文章分类成功!')
                // 根据索引号，关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 编辑按钮功能
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })
    })
    // 提交编辑内容
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章类别失败!')
                }

                layer.msg('修改文章类别成功!')
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    // 删除文章
    $('tbody').on('click', '.btn-del', function () {
        var id = $(this).attr('data-id')
        // console.log(id)  
        layer.confirm('确认删除该分类?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败!')
                    }
                    layer.msg('删除文章分类成功!')
                    layer.close(index)
                    initArtCateList()
                }
            })

        })
    })
})