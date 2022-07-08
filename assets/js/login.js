$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取form对象
    const form = layui.form
    // 通过form.verify()函数 自定义 规则
    form.verify({
        // 自定义一个 密码pwd 的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        repwd: function (value) {
            // 通过形参拿到确认密码框中的内容
            // 通过jquery拿到密码框中的内容
            // 对 两次的内容 进行判断
            // 如果 判断失败 则 return一个提示信息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致!'
            }
        }
    })


    // 监听 注册表单 的提交事件
    const layer = layui.layer
    $('#reg-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起ajax的post请求
        $.post('/api/reguser',
            {
                username: $('#reg-form [name=username]').val(),
                password: $('#reg-form [name=password]').val()
            },
            function (res) {
                if (res.status !== 0) {
                    // 注册失败
                    layer.msg(res.message)
                }
                // 注册成功
                layer.msg('注册成功,请登录!')
                // 模拟 点击行为，自动跳转到登录页面
                $('#link_login').click()
            })
    })

    // 监听 登录表单 的提交事件
    $('#login-form').submit(function (e) {
        e.preventDefault()

        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败,请重试!')
                }

                layer.msg('登录成功!')
                // console.log(res.token)
                // 将token字符串存储到 localStorage 中，便于后续访问有权限的内容
                localStorage.setItem('token', res.token)

                // 跳转到后台首页
                location.href = '/index.html'
            }
        })
    })
})

