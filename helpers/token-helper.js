// 颁布令牌  generateToken生成令牌

const jwt = require('jsonwebtoken');
const generateToken = function (_id) {
  const secretKey = global.config.security.secretKey
  const expiresIn = global.config.security.expiresIn
  const token = jwt.sign(
    {
      data: _id, // 由于签名不是加密,令牌不要存放敏感数据
      exp: expiresIn // 有效时间
    }, secretKey
  )
  return token
}
module.exports = {
  generateToken
}