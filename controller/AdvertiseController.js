const AdvertiseModel = require("../models/AdvertiseModel");
const { advertiseValidator } = require("../validators/advertise");
const res = require("../helpers/response-helper");
class ReplyController {
    // 创建广告
    static async createAdvertise(ctx, next) {
        // 验证
        advertiseValidator(ctx);

        const { title } = ctx.vals;
        const hasAdvertise = await AdvertiseModel.findOne({ title });
        if (hasAdvertise) {
            throw new global.errs.Existing("广告名已存在");
        }

        const advertise = await AdvertiseModel.create(ctx.vals);
        ctx.body = res.json(advertise);
    }

    // 获取广告列表
    static async getAdvertiseList(ctx, next) {
        const advertiseList = await AdvertiseModel.find().sort({ _id: -1 });
        ctx.body = res.json(advertiseList);
    }

    // 获取广告详情
    static async getAdvertiseDetailById(ctx, next) {
        const _id = ctx.params._id;
        const advertiseDetail = await AdvertiseModel.findById({ _id });
        if (!advertiseDetail) {
            throw new global.errs.NotFound("广告不存在");
        }
        ctx.body = res.json(advertiseDetail);
    }

    // 更新广告
    static async updateAdvertiseById(ctx, next) {
        // 验证
        advertiseValidator(ctx)

        const _id = ctx.params._id
        const { title } = ctx.vals

        const advertise = await AdvertiseModel.findById({ _id })
        if (!advertise) {
            throw new global.errs.NotFound("广告不存在");
        }

        const hasAdvertise = await AdvertiseModel.findOne({ _id: { $ne: _id }, title })
        if (hasAdvertise) {
            throw new global.errs.NotFound("广告名已存在");
        }

        await AdvertiseModel.findByIdAndUpdate({ _id }, ctx.vals, { runValidators: true })

        ctx.body = res.success("更新广告成功");
    }

    // 删除广告
    static async deleteAdvertiseById(ctx, next) {
        const _id = ctx.params._id;
        const advertiseDetail = await AdvertiseModel.findByIdAndDelete({ _id });
        if (!advertiseDetail) {
            throw new global.errs.NotFound("广告不存在");
        }
        ctx.body = res.success("删除广告成功");
    }
}
module.exports = ReplyController;