const AdminModel = require("../models/AdminModel")
const bcrypt = require("bcrypt")
const { generateToken } = require("../helpers/token-helper.js")

class LoginManager {
    static async adminLogin({ nickname, password }) {

        // 查找数据库中是否有此用户名和密码
        const user = await AdminModel.findOne({ nickname });
        if (!user) {
            throw new global.errs.AuthFailed("用户名不存在")
        }

        // 对比两次密码是否一致
        const correct = bcrypt.compareSync(password, user.password);
        if (!correct) {
            throw new global.errs.AuthFailed("密码不正确")
        }

        // 说明用户名存在，密码正确
        // 不要放敏感令牌
        let token = generateToken(user._id);

        return {
            nickname: user.nickname,
            token
        }
    }
}

module.exports = LoginManager;