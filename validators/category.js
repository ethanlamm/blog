function categoryValidator(ctx) {
  ctx.validateBody('name')
    .required('分类 name 名字不能为空')
    .isString()
    .trim()
  ctx.validateBody('keyword')
    .required('分类关键字 keyword 不能为空')
    .isString()
    .trim()
}
module.exports = {
  categoryValidator
}