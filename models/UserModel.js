// 1.引入mongoose
const mongoose = require("mongoose");
// 对密码加盐处理
const bcrypt = require("bcryptjs");
// 配置加盐的位数
const SALT_WORK_FACTOR = 10;
// 2.定义Schema(描述文档结构)
const userSchema = new mongoose.Schema({
  // 用户名
  nickname: { type: String, required: true },
  // 密码
  password: {
    type: String, required: true,
    // 调用了set⽅法，当我们写⼊数据时，bcrypt模块会将存⼊的密码进行哈希密码的加密
    set(val) {
      // 加密生成
      const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
      // 生成hash密码
      const psw = bcrypt.hashSync(val, salt);
      return psw;
    },
  },

  // ✨区分管理员和普通用户
  isAdmin: { type: Boolean }
});

// 3.定义Model(与集合对应,可以操作集合)
const UserModel = mongoose.model("User", userSchema);

// 4.向外暴露
module.exports = UserModel;
