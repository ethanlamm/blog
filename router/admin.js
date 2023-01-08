const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const AdminController = require("../controller/AdminController")
const config = require("../config/index.js")

const router = new Router();

router.prefix("/admin")

// 具体操作交给对应的 controller 来实现

// 注册
router.post("/register", AdminController.register)

// 登录 
router.post("/login", AdminController.login)

// 获取用户
router.get("/user/info", jwtAuth({ secret: config.security.secretKey }), AdminController.getUserInfo)

module.exports = router;