const Koa = require("koa");
const app = new Koa();

// 美化json
const json = require("koa-json");
// 接收post参数
const bodyparser = require("koa-bodyparser");
// 控制台美化日志
const logger = require("koa-logger");
// 前端表单校验
const bouncer = require("koa-bouncer");
// 托管静态资源
const static = require("koa-static")
// 解决跨域
const cors = require('@koa/cors');

// 引用项目的配置文件
const config = require("./config");
// 导入连接数据库文件(执行创建并连接数据库操作)
const db = require("./db");

// 引入注册路由的类
const RouterRegister = require('./helpers/router-register-helper')

// errors是一个对象，这个对象中包含了6个定义错误类型的类
const errors = require("./helpers/exceptions-helper");
// 当出现任何的错误时，我们需要错误处理中间件来处理 exceptions-handler 是错误处理中间件
const catchError = require("./middlewares/exceptions-handler");
/**
 * 把errors挂载到global(nodejs的全局对象上)
 * 使用时(即抛出错误)需要 throw new global.errs.ErrorType(params)
 * 即 (普通错误) throw new Error(message)
 */
global.errs = errors;
// 把config挂载到global(nodejs的全局对象上)，用的时候，直接global.config，到时候就不用导入
global.config = config;

// node app.js PORT=5000
// node app.js 没有传参  process.env.PORT是und  整体的值是config.port
// config.port就是3000
const port = process.env.PORT || config.port;

// 错误处理中间件
app.use(catchError);

// 使用中间件
app
  .use(bodyparser())
  .use(bouncer.middleware())
  .use(json())
  .use(logger())
  .use(cors())
  .use(static(__dirname + '/public'))

// 注册路由
RouterRegister.register(app)

// 绑定error事件
app.on("error", function (err, ctx) {
  console.log(err)
  // logger.error('server error', err, ctx)
});

module.exports = app.listen(port, () => {
  console.log(`Server is running at ${config.host}/${port}`);
});
