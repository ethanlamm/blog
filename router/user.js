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

// 获取用户信息(登录后)：先用 koa-jwt 验证 token，验证通过后，可在 ctx.state.user(默认) 获取用户信息
router.get("/user", jwtAuth({ secret: config.security.secretKey }), UserController.getUserInfo)

// 获取用户列表 ———— 管理员权限
router.get("/userList", jwtAuth({ secret: config.security.secretKey }), UserController.getUserList)

// 更新用户信息 用户_id从token中获取
router.put("/user", jwtAuth({ secret: config.security.secretKey }), UserController.updateUserInfo)


module.exports = router;