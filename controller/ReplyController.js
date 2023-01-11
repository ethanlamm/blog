const { replyValidator } = require("../validators/reply");
const ReplyModel = require("../models/ReplyModel")
const CommentModel = require("../models/CommentModel")
const res = require("../helpers/response-helper.js")

class ReplyController {
    // 创建回复
    static async createReply(ctx, next) {
        // 验证
        replyValidator(ctx)

        const { comment_id } = ctx.vals;

        let comment = await CommentModel.findById({ _id: comment_id })

        if (!comment) {
            throw new global.errs.NotFound("没有找相关评论")
        }

        const reply = await ReplyModel.create(ctx.vals)

        ctx.body = res.json(reply)
    }

    // 获取回复列表
    static async getReplyList(ctx, next) {
        // 两种情况：1）不传comment_id，找所有回复列表 2）传入comment_id，找相应评论的回复
        const comment_id = ctx.query?.comment_id?.trim();
        const { pageIndex = 1, pageSize = 10 } = ctx.request.body

        let filter
        if (!comment_id) {
            // 找所有回复列表
            filter = {}
        } else {
            // 找相应评论的回复列表
            filter = { comment_id }
        }

        const totalSize = await ReplyModel.find(filter).countDocuments()
        const replyList = await ReplyModel.find(filter)
            .skip(parseInt(pageIndex - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .sort({ _id: -1 })

        ctx.body = res.json({
            replyList,
            totalSize,
            pageIndex: parseInt(pageIndex),
            pageSize: parseInt(pageSize)
        })
    }

    // 获取某条回复的详情
    static async getReplyDetailById(ctx, next) {
        const _id = ctx.params._id;

        let replyDetail = await ReplyModel.findById(_id);
        if (!replyDetail) {
            throw new global.errs.NotFound("没有相关的回复")
        }
        // 返回数据
        ctx.body = res.json(replyDetail)
    }

    // 修改，编辑，更新回复
    static async updateReplyById(ctx, next) {
        const _id = ctx.params._id;
        let reply = await ReplyModel.findByIdAndUpdate(_id, ctx.request.body);
        if (!reply) {
            throw new global.errs.NotFound("没有相关的回复")
        }
        ctx.body = res.success("修改回复成功")
    }

    // 删除评论
    static async deleteReplyById(ctx, next) {
        const _id = ctx.params._id;
        let reply = await ReplyModel.findByIdAndDelete(_id);
        if (!reply) {
            throw new global.errs.NotFound("没有相关的回复")
        }
        ctx.body = res.success("删除回复成功")
    }
}
// 导出去一个类
module.exports = ReplyController;