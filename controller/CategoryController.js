const { categoryValidator } = require("../validators/category");
const CategoryModel = require("../models/CategoryModel")
const ArticleModel = require("../models/ArticleModel")
const res = require("../helpers/response-helper.js")

class CategoryController {
    // 创建分类
    static async create(ctx, next) {
        // 1.验证 title keyowrd
        categoryValidator(ctx)

        // 2.分类是否存在: title 不能重复
        const { title, keyword } = ctx.request.body;
        const hasCategory = await CategoryModel.findOne({ title });
        if (hasCategory) {
            throw new global.errs.Existing("分类名已存在")
        }

        // 3.不存在，则新建分类
        await CategoryModel.create({
            title, keyword
        });

        // 4.返回
        ctx.body = res.success("创建分类成功")
    }


    // 获取所有分类
    static async getCategoryList(ctx, next) {
        // 获取query传参，若没有则是默认值
        const { pageIndex = 1, pageSize = 10 } = ctx.query;
        // 获取整个分类的总数
        const totalSize = await CategoryModel.find().countDocuments();
        // 获取分类list，根据id倒序
        const categoryList = await CategoryModel.find()
            .skip(parseInt(pageIndex - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .sort({
                _id: -1,
            });

        // 返回数据
        ctx.body = res.json({
            data: categoryList,
            totalSize,
            pageIndex: parseInt(pageIndex),
            pageSize: parseInt(pageSize),
        });
    }

    // 根据ID获取某个分类
    static async getCategoryDetailById(ctx, next) {
        const _id = ctx.params._id;
        const categoryDetail = await CategoryModel.findById({ _id });

        if (!categoryDetail) {
            throw new global.errs.NotFound("没有找到相关的分类信息")
        }
        ctx.body = res.json({
            categoryDetail,
        })
    }

    // 更新分类
    static async updateCategoryById(ctx, next) {
        const _id = ctx.params._id;
        // console.log(_id);

        // 校验name和keyword
        categoryValidator(ctx)
        const { name, keyword } = ctx.request.body;

        // category是更新前的category
        const category = await CategoryModel.findByIdAndUpdate({ _id }, { name, keyword });

        if (!category) {
            throw new global.errs.NotFound("没有找到相关分类")
        }

        ctx.body = res.json("更新成功")
    }

    // 删除分类
    static async deleteCategoryById(ctx, next) {
        const _id = ctx.params._id;

        // category是删除前的category
        const category = await CategoryModel.findByIdAndDelete({ _id });

        if (!category) {
            throw new global.errs.NotFound("没有找到相关分类")
        }

        ctx.body = res.json("删除成功")
    }


}

// 导出去一个类
module.exports = CategoryController;