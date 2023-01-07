/**
 * 数据库连接操作
 * mongoose是一个使用nodeJS来操作mongoDB数据库的开源库
 * mongoose里面封装了连接数据库、创建collection和document CRUD的操作
 */
const mongoose = require("mongoose");
const config = require("../config");

// 连接数据库
mongoose.connect(`mongodb://${config.db.host}/${config.db.dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("链接数据库成功");
});
