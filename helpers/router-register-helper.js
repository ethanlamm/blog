// 集中注册路由

const path = require('path')
const Router = require("@koa/router")
const requireDirectory = require('require-directory')

class RouterRegister {
    static register(app) {
        // 入口方法
        RouterRegister.app = app
        RouterRegister.initLoadRouters()
    }

    static initLoadRouters() {
        function whenLoadModule(router) {
            if (router instanceof Router) {
                /**
                 * 注册路由
                 * router.routes(): 启动路由
                 * router.allowedMethods(): 允许任何请求
                 */
                RouterRegister.app.use(router.routes(), router.allowedMethods())
            }
        }

        /**
        * 引入路由
        * requireDirectory(module, apiDirectory, options)
        * apiDirectory: 文件夹路径，可以是相对路径也可以是绝对路径
        */
        const apiDirectory = path.join(__dirname, "../router")
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })
    }
}

module.exports = RouterRegister