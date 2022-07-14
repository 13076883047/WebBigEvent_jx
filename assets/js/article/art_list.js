$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义一个 美化时间格式 的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + '-' + ss
    }

    // 时间补零
    function padZero(t) {
        return t > 9 ? t : '0' + t
    }

    // 定义一个 查询对象,
    // 未来 要获取文章列表的时候，需要将该对象发送到服务器
    var q = {
        pagenum: 1,     // 页码值
        pagesize: 2,    // 每页显示多少条数据,默认显示两条
        cate_id: '',    // 文章分类的ID
        state: '',     // 文章的发布状态 可选值有：已发布、草稿
    }

    initTable()
    initCate()


    // 初始化 列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }

                console.log(res)

                // 获取到数据后，通过模板引擎渲染表格及其数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化 文章分类下拉选项
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!')
                }

                // 调用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res.data)
                console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                // 通过layui 重新渲染表单区域的UI结构
                form.render()
            }
        })

    }

    // 实现 筛选功能
    $('#cate_id').on('submit', function (e) {
        e.preventDefault()

        // 拿到表单中的数据
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 修改 查询对象中的值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格数据
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 使用laypage.render() 来渲染 分页结构
        laypage.render({
            elem: 'pageBox',      // 分页的区域
            count: total,         // 数据的总数
            limit: q.pagesize,    // 每页显示多少数据
            curr: q.pagenum,      // 默认显示第一页
            layout: ['count', 'limit', 'prev', 'page', 'skip', 'next'],
            limits: [2, 3, 5, 10],

            // 发生页面切换时 会 触发jump回调函数
            // 触发jump函数的两种情况:
            // 1. 点击页码的时候
            // 2. 调用了 laypage.render()方法

            // 通过jump函数 拿到最新的页码值，然后修改查询对象再重新渲染表格
            jump: function (obj, first) {
                // 可以通过first的值，来判断是通过哪种方式 触发 jump回调的
                // 如果first 的 值是true，证明是方法2触发的
                // 否则就是方法1触发的
                console.log(obj.curr)

                // 修改 查询对象的 页码 
                q.pagenum = obj.curr
                // 修改 查询对象的 每页文章数
                q.pagesize = obj.limit

                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 实现文章删除功能
    $('tbody').on('click', '#btn-delete', function () {
        // 获取要删除文章的id
        var id = $(this).attr('data-id')

        // 获取删除按钮的个数
        var len = $('#btn-delete').length

        // 弹出询问是否要删除文章
        layer.confirm('确认删除该文章?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发起ajax请求 删除文章
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }

                    layer.msg('删除文章成功!')
                    // 重新渲染列表
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值 -1 之后
                    // 再重新调用initTabl.e 方法
                    if (len === 1) {
                        // 说明页码上只剩下一条数据
                        // 删除这条数据 后 要 删除对应的页码

                        // 页码值最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})