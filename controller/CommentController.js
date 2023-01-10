const { commentValidator } = require("../validators/comment");
const CommentModel = require("../models/CommentModel")
const ArticleModel = require("../models/ArticleModel")
const ReplyModel = require("../models/ReplyModel")
const res = require("../helpers/response-helper.js")

class CommentController {
    // 创建评论
    static async createComment(ctx, next) {
        // 验证
        commentValidator(ctx)

        // ✨要拿到验证之后的数据 ctx.vals✨
        const { target_id } = ctx.vals
        const hasArticle = await ArticleModel.findById({ _id: target_id })
        if (!hasArticle) {
            throw new global.errs.NotFound("所评论文章不存在")
        }

        // 创建评论 使用验证后的数据 ctx.vals
        const comment = await CommentModel.create(ctx.vals)
        // 返回数据
        ctx.body = res.json(comment)
    }

    // 获取所有评论
    static async getCommentList(ctx, next) {
        const { pageIndex = 1, pageSize = 10 } = ctx.query
        const totalSize = await CommentModel.find().countDocuments();
        const commentList = await CommentModel
            .find()
            .skip(parseInt(pageIndex - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .sort({ _id: -1 });

        ctx.body = res.json({
            data: commentList,
            totalSize,
            pageIndex: parseInt(pageIndex),
            pageSize: parseInt(pageSize)
        })
    }

    // 获取评论的详情
    static async getCommentDetailById(ctx, next) {
        const _id = ctx.params._id;

        const commentDetail = await CommentModel.findById({ _id });

        if (!commentDetail) {
            throw new global.errs.NotFound("没有找到相关的评论信息")
        }

        // todo: 获取改评论下面的回复
        const replyList = [];

        ctx.body = res.json({
            commentDetail,
            replyList
        })
    }

    // 更新评论
    static async updateCommentById(ctx, next) {
        const _id = ctx.params._id;
        // ❗body只需要传最新的 content 即可，注意需要 trim() 处理(手动验证)
        const content = ctx.request.body.content.trim()

        const comment = await CommentModel.findOne({ _id });
        if (!comment) {
            throw new global.errs.NotFound("没有找到相关评论")
        }

        // 更新评论
        await CommentModel.findByIdAndUpdate({ _id }, { content }, { runValidators: true })

        ctx.body = res.success("更新评论成功")
    }

    // 删除评论
    static async deleteCommentById(ctx, next) {
        const _id = ctx.params._id;

        // category是删除前的category
        const comment = await CommentModel.findByIdAndDelete({ _id });

        if (!comment) {
            throw new global.errs.NotFound("没有找到相关评论")
        }

        ctx.body = res.json("删除评论成功")
    }

    // 下面两个方法用于一个文章下的所有评论
    static async getTargetComment(ctx, next) {
        const commentList = await CommentController.targetComment(ctx.query);
        ctx.status = 200;
        ctx.body = res.json(commentList);
    }
    static async targetComment(params = {}) {
        // target_id: 文章id
        const {
            target_id,
            pageIndex = 1,
            pageSize = 4
        } = params;
        // 评论总数量
        const totalSize = await CommentModel.find({
            target_id,
        }).countDocuments();
        // 获取所有的评论
        const commentList = await CommentModel.find({
            target_id,
        })
            .skip(parseInt(pageIndex - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .sort({
                _id: -1,
            })
            .lean();
        //  2.获取评论下回复列表
        // Promise.all()
        let newCommentList = await Promise.all(
            commentList.map(async (comment) => {
                let replyList = await ReplyModel.find({
                    comment_id: comment._id,
                });
                comment.replyList = replyList;
                return comment;
            })
        );

        return {
            data: newCommentList,
            pageIndex: parseInt(pageIndex),
            pageSize: parseInt(pageSize),
            totalSize,
        };
    }
}

// 导出去一个类
module.exports = CommentController;