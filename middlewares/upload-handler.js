// 文件上传处理

const path = require('path')
const multer = require('@koa/multer');

// 文件上传位置
const uploadDir = path.join(__dirname, "../public/images")

// 配置 磁盘存储
const storage = multer.diskStorage({
  // 文件保存路径
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  // 修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split("."); //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
// 加载配置
const upload = multer({
  storage
});
module.exports = upload;