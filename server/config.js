/**
 * 后端配置 - 部署前修改
 */
const path = require('path')

module.exports = {
  // 服务端口
  PORT: process.env.PORT || 3000,

  // 运行环境
  ENV: process.env.NODE_ENV || 'development',

  // JWT 密钥（生产环境请更换为随机字符串）
  JWT_SECRET: process.env.JWT_SECRET || 'alumni-circle-secret-key-2026',

  // Token 有效期（天）
  JWT_EXPIRES_IN: '7d',

  // SQLite 数据库路径
  DB_PATH: path.join(__dirname, 'data', 'alumni.db'),

  // 文件上传目录
  UPLOAD_DIR: path.join(__dirname, 'uploads'),

  // 分页默认值
  PAGE_SIZE: 10,

  // 学院列表（与前端保持一致）
  DEPARTMENTS: [
    '计算机科学与技术学院', '电子信息工程学院', '数学与统计学院',
    '物理科学与技术学院', '化学与分子科学学院', '生命科学学院',
    '经济与管理学院', '法学院', '文学院', '历史学院', '哲学学院',
    '外国语学院', '新闻与传播学院', '艺术学院', '马克思主义学院',
    '体育学院', '医学院', '药学院', '护理学院', '公共卫生学院',
    '口腔医学院', '土木建筑工程学院', '水利水电学院', '电气与自动化学院',
    '动力与机械学院', '资源与环境科学学院', '测绘学院', '遥感信息工程学院',
    '印刷与包装系', '国际教育学院'
  ]
}
