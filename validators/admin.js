/**
 * 当验证失败时，会自动抛出验证类型的错误
 * 抛出的错误，交给错误处理中间件处理('middlewares/exceptions-handler')
 * 不在这里 try...catch... 
 */
function registerValidator(ctx) {
  ctx
    .validateBody("nickname")
    .required("用户名是必须的") //只是要求有uname字段
    .isString() //确保输入的字段是字符串或者可以转换成字符串
    .trim()
    .isLength(3, 16, "用户名长度必须是3~16位");
  ctx
    .validateBody("password")
    .required("密码是必填项")
    .isLength(6, 16, "密码必须是6~16位字符")
    .match(
      /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/,
      "密码长度必须在6~22位之间，包含字符、数字和 _ "
    );
  ctx
    .validateBody("password2")
    .required("确认密码是必填项")
    .eq(ctx.vals.password, "两次密码不一致");
}
function loginValidator(ctx) {
  ctx
    .validateBody("password")
    .required("密码是必须的")
    .trim()
    .isLength(6, 16, "密码至少6个字符，最多16个字符")
    .match(
      /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/,
      "密码长度必须在6~22位之间，包含字符、数字和 _ "
    );
}
module.exports = {
  registerValidator,
  loginValidator
};
