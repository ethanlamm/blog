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
      /^[a-zA-Z]\w{5,15}$/,
      "密码需要以字母开头, 长度在6~16之间, 只能包含字母、数字和下划线 "
    );
  ctx
    .validateBody("password2")
    .required("确认密码是必填项")
    .eq(ctx.vals.password, "两次密码不一致");
}
function userValidator(ctx) {
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
      /^[a-zA-Z]\w{5,15}$/,
      "密码需要以字母开头, 长度在6~16之间, 只能包含字母、数字和下划线 "
    );
}
module.exports = {
  registerValidator,
  userValidator
};
