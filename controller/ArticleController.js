const { articleValidator } = require("../validators/article");
const ArticleModel = require("../models/ArticleModel")
const CommentController = require("./CommentController");
const res = require("../helpers/response-helper.js")
const config = require("../config/index.js")

class ArticleController {
    // 创建文章
    static async create(ctx, next) {
        articleValidator(ctx)

        // 获取标题，标题不能重复
        const { title } = ctx.request.body;
        const hasArticle = await ArticleModel.findOne({ title })
        if (hasArticle) {
            throw new global.errs.Existing("文章标题已存在，请更换标题")
        }

        // 创建
        await ArticleModel.create(ctx.request.body)
        ctx.body = res.success("创建成功")
    }

    // 获取文章列表
    //   1）获取所有文章
    //   2）根据某个分类，获取某个分类下的所有的文章
    //   3）根据关键字，获取含有此关键字的文章
    //   4）根据某个分类 + 关键字获取文章
    static async getArticleList(ctx, next) {
        const {                 // 更理想的传参应该是
            category_id = null, // query，可选
            keyword = null,     // query，可选
            pageIndex = 1,      // body，默认第1页
            pageSize = 10       // body，默认每页10条数据
        } = ctx.query

        // 查询条件
        let filter

        if (category_id && !keyword) {
            // 1.只传 category_id
            filter = { category_id }
        } else if (!category_id && keyword) {
            // 2.只传 keyword
            filter = {
                // 模糊匹配，i 忽略大小写
                keyword: {
                    $regex: new RegExp(keyword, "i"),
                }
            }
        } else if (category_id && keyword) {
            // 3.都传
            filter = {
                category_id,
                keyword: {
                    $regex: new RegExp(keyword, "i"),
                }
            }
        } else {
            // 4.都不传，则查询所有
            filter = {}
        }

        // 根据查询条件得到符合条件的文章总数
        const totalSize = await ArticleModel.find(filter).countDocuments();

        const articleList = await ArticleModel
            .find(filter)
            .skip(parseInt(pageIndex - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .sort({ _id: -1 })
            // 连表查询 https://blog.csdn.net/elliott_yoho/article/details/53537147
            .populate("category_id");

        // 返回数据
        ctx.body = res.json({
            content: articleList,
            totalSize,
            pageIndex: parseInt(pageIndex),
            pageSize: parseInt(pageSize)
        });
    }

    // 更新文章
    static async updateArticleById(ctx, next) {
        // 表单验证
        articleValidator(ctx)

        const _id = ctx.params._id;
        const { title } = ctx.request.body;

        // 根据_id找文章
        const article = await ArticleModel.findOne({ _id });
        if (!article) {
            throw new global.errs.NotFound("没有找到相关文章")
        }

        // 除当前要修改的文章外，title不能重复
        const hasArticle = await ArticleModel.findOne({ _id: { $ne: _id }, title })
        if (hasArticle) {
            throw new global.errs.Existing("文章标题已存在，请更换")
        }

        // 更新
        await ArticleModel.findByIdAndUpdate({ _id }, ctx.request.body)

        ctx.body = res.json("文章更新成功")
    }

    // 根据ID获取文章详情
    static async getArticleDetailById(ctx, next) {
        const _id = ctx.params._id;

        const articleDetail = await ArticleModel.findById({ _id }).populate("category_id");
        if (!articleDetail) {
            throw new global.errs.NotFound("没有找到相关文章")
        }

        // ✨获取文章后，浏览量 +1
        await ArticleModel.findByIdAndUpdate({ _id }, { browse: ++articleDetail.browse })

        // todo:获取文章下的所有的评论
        const commentList = []; // 现在评论内容是空

        ctx.body = res.json({
            articleDetail,
            commentList
        })
    }

    // 根据ID删除文章
    static async deleteArticleById(ctx, next) {
        const _id = ctx.params._id;

        const article = await ArticleModel.findByIdAndDelete({ _id })

        if (!article) {
            throw new global.errs.NotFound("没有找到相关文章")
        }

        ctx.body = res.success("文章删除成功")
    }

    // 上传文章封面
    static async uploadCoverImg(ctx, next) {
        let imgPath = config.host + ":" + config.port + "/" + "images/" + ctx.req.file.filename;
        // ctx.body = res.json(imgPath)
        ctx.body = res.json(ctx.req.file.filename)
    }

    // 根据ID获取文章详情 
    // static async getArticleDetailById(ctx, next) {
    //     const _id = ctx.params._id;
    //     //   文章详情的内容
    //     const articleDetail = await ArticleModel.findById({
    //         _id
    //     }).populate(
    //         "category_id"
    //     );
    //     if (!articleDetail) throw new global.errs.NotFound("没有找到相关分类");
    //     // 更新文章浏览器数 browse
    //     await ArticleModel.findByIdAndUpdate({
    //         _id
    //     }, {
    //         browse: ++articleDetail.browse
    //     });
    //     const {
    //         data,
    //         pageIndex,
    //         pageSize,
    //         totalSize
    //     } =
    //         await CommentController.targetComment({
    //             target_id: articleDetail._id
    //         });

    //     ctx.body = res.json({
    //         articleDetail,
    //         commentList: data,
    //         pageIndex,
    //         pageSize,
    //         commentCount: totalSize,
    //         totalSize,
    //     });
    // }
}

// 导出去一个类
module.exports = ArticleController;