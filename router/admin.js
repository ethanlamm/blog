const Router = require("@koa/router");
const koajwt = require("koa-jwt")
const AdminController = require("../controller/AdminController")

const router = new Router();

router.prefix("/admin")

// 具体操作交给对应的 controller 来实现

// 注册
router.post("/register", AdminController.register)

// 登录 
router.post("/login", AdminController.login)

// 获取用户：先用 koa-jwt 验证 token，验证通过后，可在 ctx.state.user(默认) 获取用户信息
router.get("/user/info", koajwt({ secret: global.config.security.secretKey }), AdminController.getUserInfo)

module.exports = router;