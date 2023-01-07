/**
 * 定义 ctx.body 响应数据类型
 * ctx.body = {...}
 */
class Resolve {
  // 提示成功，没有返回信息
  success(msg = "success", errorCode = 1, code = 200) {
    return {
      msg,
      errorCode,
      code,
    };
  }
  // 提示成功，有返回信息
  json(data, msg = "success", errorCode = 1, code = 200) {
    return {
      msg,
      errorCode,
      code,
      data,
    };
  }
}
const res = new Resolve();
module.exports = res;
