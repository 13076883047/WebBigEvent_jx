// 在每次调用$.get()或$.post()或$.ajax()请求的时候
// 都会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // console.log(options.url)

    // 统一为有权限的接口 设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // complete 函数，无论ajax请求成功与否，都会调用这个函数
        // 使用这个函数来 控制访问权限
        console.log('执行了 complete 回调')
        console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
            // 强制 清空token
            localStorage.removeItem('token')
            // 强制 跳转到 login.html
            location.href = '/login.html'
        }

    }
})