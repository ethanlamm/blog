const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const UserController = require("../controller/UserController")
const config = require("../config/index.js");

const router = new Router();

// router.prefix("/admin")

// 具体操作交给对应的 controller 来实现

// 注册
router.post("/register", UserController.register)

// 登录 
router.post("/login", UserController.login)

// 获取用户：先用 koa-jwt 验证 token，验证通过后，可在 ctx.state.user(默认) 获取用户信息
router.get("/userInfo", jwtAuth({ secret: config.security.secretKey }), UserController.getUserInfo)

module.exports = router;