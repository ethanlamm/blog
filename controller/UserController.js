const { registerValidator, loginValidator, updateValidator } = require("../validators/user.js");
const UserModel = require("../models/UserModel")
const LoginManager = require("../services/login")
const res = require("../helpers/response-helper.js")
const bcrypt = require("bcryptjs")

class UserController {
    // 注册
    static async register(ctx, next) {

        // 第一件事：先进行数据校验，通过后，再向下走
        registerValidator(ctx)

        // 第二件事：获取用户名和密码
        // ✨isAdmin 可根据前端不同的表单，携带isAdmin=true，或者不携带
        let { nickname, password2, isAdmin } = ctx.vals;
        // console.log('isAdmin',isAdmin);

        // 第三件事：判断数据库中否有同名的用户名
        let currentUser = await UserModel.findOne({ nickname });
        // 若存在，抛出对应错误
        if (currentUser) {
            throw new global.errs.Existing("用户已存在", 900)
        }

        // // 第四件事：需要把用户入库
        let user = await UserModel.create({
            nickname,
            password: password2,
            // ✨当isAdmin=true时，mongoDB会加入isAdmin属性；当isAdmin=undefined时，则不会加入isAdmin属性
            isAdmin
        });

        // // 返回数据
        ctx.body = res.json(user)
    }

    // 登录
    static async login(ctx, next) {
        // 校验
        loginValidator(ctx)

        // 得到前端传递的用户名和密码
        let { nickname, password } = ctx.vals;

        // 验证用户名、密码、颁发token
        let user = await LoginManager.adminLogin({ nickname, password })

        // 返回数据 包含 nickname 和 token
        ctx.body = res.json(user)
    }

    // 登录后获取用户信息
    static async getUserInfo(ctx, next) {
        // 可在 ctx.state.user(默认) 获取用户信息
        // ctx.state.user.data 就是颁发 token 时使用的 data 数据，即用户_id
        // console.log(ctx.state.user)

        // ❗❗这里不需要前端传数据，携带登录后返回token即可
        const _id = ctx.state.user.data;

        // 依据_id到数据库查找用户信息
        const userInfo = await UserModel.findById({ _id });
        if (!userInfo) {
            throw new global.errs.AuthFailed("用户不存在")
        }

        const { nickname, isAdmin } = userInfo

        // 返回数据（注意某些数据的私密性） ✨添加 isAdmin 字段
        ctx.body = res.json({ _id, nickname, isAdmin })
    }

    // 获取用户列表 ———— 管理员权限
    static async getUserList(ctx, next) {
        // 携带token
        const _id = ctx.state.user.data;

        // query传参 type
        // type = admin  => 查看所有管理员列表
        // type = user   => 查看所有普通用户列表
        // type 不传     => 查看所有用户列表(包含管理员各普通用户)
        const type = ctx.query?.type?.trim()
        const { pageIndex = 1, pageSize = 10 } = ctx.request.body

        // 依据_id到数据库查找用户信息，查看是否为管理员
        const user = await UserModel.findOne({ _id });
        if (!user) {
            throw new global.errs.AuthFailed("用户不存在")
        }

        if (!user.isAdmin) {
            throw new global.errs.Forbidden("用户权限不足")
        }

        // 查询条件
        let filter
        if (!type) {
            filter = {}
        } else if (type === 'user') {
            // 普通用户没有 isAdmin 字段
            filter = { isAdmin: null }
        } else {
            // 管理员用户没有 isAdmin=true
            filter = { isAdmin: true }
        }

        const totalSize = await UserModel.find(filter).countDocuments()
        const userList = await UserModel
            .find(filter, { password: 0 }) // 不返回password字段
            .skip(parseInt(pageIndex - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .sort({ _id: -1 })

        // 返回数据
        ctx.body = res.json({
            userList,
            totalSize,
            pageIndex: parseInt(pageIndex),
            pageSize: parseInt(pageSize)
        })
    }

    // 更新用户信息
    static async updateUserInfo(ctx, next) {
        // 验证
        updateValidator(ctx)
        // 携带token
        const _id = ctx.state.user.data;
        // 提交的表单
        const { nickname, oldPassword, newPassword } = ctx.vals

        // 1.依据_id到数据库查找用户
        const user = await UserModel.findOne({ _id });
        if (!user) {
            throw new global.errs.AuthFailed("用户不存在")
        }

        // 2.nickname 重复
        const hasSameName = await UserModel.findOne({ _id: { $ne: _id }, nickname })
        if (hasSameName) {
            throw new global.errs.Existing("用户名已存在，请更换")
        }

        // 3.对比旧密码
        const correct = bcrypt.compareSync(oldPassword, user.password);
        if (!correct) {
            throw new global.errs.AuthFailed("旧密码不正确")
        }

        // 4.更新用户信息
        await UserModel.findByIdAndUpdate({ _id },
            { nickname, password: newPassword },
            { runValidators: true }
        )

        // 返回数据
        ctx.body = res.success('更新用户信息成功')
    }
}

// 导出去一个类
module.exports = UserController;