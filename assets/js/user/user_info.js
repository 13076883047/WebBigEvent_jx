$(function () {
    var form = layui.form
    var layer = layui.layer

    // 给 nickname 区域添加验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 8 || value.length < 2) {
                return '用户昵称长度必须在2~8个字符!'
            }
        }
    })

    initUserInfo()
    // 初始化表单的用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }

                // 获取到用户信息
                console.log(res)
                // 通过 form.val() 为表单域赋值
                form.val('formUserinfo', res.data)
            }
        })
    }


    // 重置 表单的数据
    $('#btnReset').on('click', function (e) {
        // 1. 阻止表单默认的提交行为
        e.preventDefault()
        // 2. 重新渲染数据
        initUserInfo()
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res)
                    return layer.msg('更新用户信息失败!')
                }

                layer.msg('更新用户信息成功!')
                // 在子页面 调用 父页面的方法，更新头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})