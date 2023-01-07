const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const AdminController = require("../controller/AdminController")
const config = require("../config/index.js")

const router = new Router();

router.prefix("/admin")

// router.post("/register", (ctx, next) => {
//     // 按理说，我们需要在这里，得到前端传递过来数据
//     // 连接数据库，插入数据到数据库
//     // ....
//     ctx.body = "注册管理员"
// })

// 注册
router.post("/register", AdminController.register)

// 登录 
router.post("/login", AdminController.login)

// 获取用户
router.get("/user/info", jwtAuth({ secret: config.security.secretKey }), AdminController.getUserInfo)

module.exports = router;