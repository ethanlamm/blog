const Router = require("@koa/router");
const jwtAuth = require("koa-jwt")
const CategoryController = require("../controller/CategoryController")

const router = new Router();

// PS：后端开发时，可先不验证token（只要之前验证token的流程无误）
// 这样可不用每次测试接口时都传入token
// 到真实上线时，要验证token的接口，则在路由中间件加上token验证即可
// jwtAuth({ secret: config.security.secretKey })

// 创建分类
router.post("/category", jwtAuth({ secret: global.config.security.secretKey }), CategoryController.create)

// 获取所有分类  jwtAuth({ secret: config.security.secretKey }),
router.get("/category", CategoryController.getCategoryList)

// 根据ID获取某个分类  jwtAuth({ secret: config.security.secretKey }), 
router.get("/category/:_id", CategoryController.getCategoryDetailById)

// 更新分类  jwtAuth({ secret: config.security.secretKey }),
router.put("/category/:_id", CategoryController.updateCategoryById)

// 删除分类  jwtAuth({ secret: config.security.secretKey }),
router.delete("/category/:_id", CategoryController.deleteCategoryById)

module.exports = router;