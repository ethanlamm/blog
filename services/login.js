const UserModel = require("../models/UserModel")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../helpers/token-helper.js")

class LoginManager {
    static async adminLogin({ nickname, password }) {

        // 1.查找数据库中是否有此用户名和密码
        const user = await UserModel.findOne({ nickname });
        if (!user) {
            throw new global.errs.AuthFailed("用户名不存在")
        }

        // 2.对比两次密码是否一致
        const correct = bcrypt.compareSync(password, user.password);
        if (!correct) {
            throw new global.errs.AuthFailed("密码不正确")
        }

        // 3.用户名存在，密码正确，生成token
        // token不要敏感信息，一般使用用户的id
        let token = generateToken(user._id);

        // 4.返回数据
        return {
            nickname: user.nickname,
            token
        }
    }
}

module.exports = LoginManager;