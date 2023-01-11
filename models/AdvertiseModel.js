const mongoose = require('mongoose');
const moment = require('moment')

const AdvertiseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, //广告标题
  },
  link: {
    type: String,
    required: true,
  },
  // createAt: {
  //   type: Date,
  //   require: true,
  //   default: Date.now,
  //   // 处理时间
  //   get(val) {
  //     return moment(val).format('YYYY-MM-DD HH:mm:ss')
  //   }
  // },
  createdAt: { type: String },    // 需要设置 type: String
  updatedAt: { type: String },    // 需要设置 type: String
}, {
  timestamps: {
    currentTime: () => moment().format('YYYY-MM-DD HH:mm:ss')
  }
})

// AdvertiseSchema.set('toJSON', { getters: true });

const AdvertiseModel = mongoose.model('Advertise', AdvertiseSchema);
// 4.向外暴露model
module.exports = AdvertiseModel;