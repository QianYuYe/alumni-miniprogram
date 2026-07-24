// ===================================================
// 应用配置 — 部署前请修改以下字段
// ===================================================
const CONFIG = {

  // ===== 环境切换 =====
  USE_MOCK: false,              // true=使用模拟数据, false=连接真实阿里云服务器
  ENV: 'development',          // 'development' | 'production'

  // ===== 阿里云服务器地址 =====
  API_BASE_URL: 'https://xixixiaoyou.online',
  // 提示: 后端路由已包含 /api 前缀，例如 https://你的域名.com/api/login

  // ===== 请求超时 =====
  REQUEST_TIMEOUT: 15000,      // 毫秒

  // ===== 应用信息 =====
  COLLEGE_NAME: '西南交通大学希望学院',
  VERSION: '1.0.0',
  PAGE_SIZE: 10,
  CACHE_EXPIRE: 30,            // 缓存有效期（分钟）
  
  // 学校院系列表
  DEPARTMENTS: [
    '计算机科学与技术学院',
    '电子信息工程学院',
    '数学与统计学院',
    '物理科学与技术学院',
    '化学与分子科学学院',
    '生命科学学院',
    '经济与管理学院',
    '法学院',
    '文学院',
    '历史学院',
    '哲学学院',
    '外国语学院',
    '新闻与传播学院',
    '艺术学院',
    '马克思主义学院',
    '体育学院',
    '医学院',
    '药学院',
    '护理学院',
    '公共卫生学院',
    '口腔医学院',
    '土木建筑工程学院',
    '水利水电学院',
    '电气与自动化学院',
    '动力与机械学院',
    '资源与环境科学学院',
    '测绘学院',
    '遥感信息工程学院',
    '印刷与包装系',
    '国际教育学院'
  ],
  
  // 入学年份范围
  ENROLLMENT_YEARS: (() => {
    const currentYear = new Date().getFullYear() + 1
    const years = []
    for (let i = currentYear; i >= currentYear - 81; i--) {
      years.push(i)
    }
    return years
  })(),
  
  // 校友标签
  ALUMNI_TAGS: [
    '技术大牛',
    '学术研究',
    '教育行业',
    '医疗健康',
    '法律顾问',
    '文化艺术',
    '政府单位',
    '公益达人'
  ]
}

module.exports = CONFIG
