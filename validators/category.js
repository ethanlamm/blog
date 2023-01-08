function categoryValidator(ctx) {
  ctx.validateBody('title')
    .required('分类 title 名字不能为空')
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