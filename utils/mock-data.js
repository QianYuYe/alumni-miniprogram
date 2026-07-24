/**
 * ==================== 模拟数据层 ====================
 * 在后端未就绪时使用，对接真实服务器后可将 CONFIG.USE_MOCK 设为 false
 */

const CONFIG = require('./config')
const { generateId } = require('./util')

// ===== 模拟用户 =====
const MOCK_USERS = [
  { id: 'u001', name: '张明', nickname: '小明同学', realName: '张明', avatar: 'https://picsum.photos/seed/user1/200/200', studentId: '2018001', department: '计算机科学与技术学院', enrollmentYear: 2018, graduationYear: 2022, location: '北京', bio: '热爱技术，持续学习。', tags: ['技术大牛'], isVerified: true, moments: 23, followers: 156, following: 89 },
  { id: 'u002', name: '李婷', nickname: '婷婷子', realName: '李婷', avatar: 'https://picsum.photos/seed/user2/200/200', studentId: '2017002', department: '经济与管理学院', enrollmentYear: 2017, graduationYear: 2021, location: '深圳', bio: '终身学习者，热爱生活。', tags: ['教育行业'], isVerified: true, moments: 45, followers: 230, following: 120 },
  { id: 'u003', name: '王浩', nickname: '法学小王子', realName: '王浩', avatar: 'https://picsum.photos/seed/user3/200/200', studentId: '2019003', department: '法学院', enrollmentYear: 2019, graduationYear: 2023, location: '上海', bio: '法律人，追求公平正义。', tags: ['法律顾问'], isVerified: false, moments: 12, followers: 67, following: 45 },
  { id: 'u004', name: '陈雪', nickname: '雪儿', realName: '陈雪', avatar: 'https://picsum.photos/seed/user4/200/200', studentId: '2016004', department: '医学院', enrollmentYear: 2016, graduationYear: 2021, location: '北京', bio: '医者仁心。', tags: ['医疗健康', '学术研究'], isVerified: true, moments: 8, followers: 89, following: 34 },
  { id: 'u005', name: '赵阳', nickname: '阳光代码', realName: '赵阳', avatar: 'https://picsum.photos/seed/user5/200/200', studentId: '2015005', department: '计算机科学与技术学院', enrollmentYear: 2015, graduationYear: 2019, location: '杭州', bio: '代码改变世界。', tags: ['技术大牛'], isVerified: true, moments: 67, followers: 412, following: 156 },
  { id: 'u006', name: '刘芳', nickname: '芳芳', realName: '刘芳', avatar: 'https://picsum.photos/seed/user6/200/200', studentId: '2020006', department: '新闻与传播学院', enrollmentYear: 2020, graduationYear: 2024, location: '北京', bio: '用镜头记录真实。', tags: ['文化艺术'], isVerified: false, moments: 34, followers: 178, following: 92 }
]

// ===== 模拟动态 =====
const MOCK_MOMENTS = [
  { id: 'm001', userId: 'u001', userName: '张明', userAvatar: 'https://picsum.photos/seed/user1/200/200', isVerified: true, content: '毕业三年，重回母校，看到新建的图书馆和实验室，感慨万千。母校变得越来越好了！大家有空多回来看看。', images: ['https://picsum.photos/seed/campus1/800/600','https://picsum.photos/seed/campus2/800/600','https://picsum.photos/seed/campus3/800/600'], location: 'XX大学', tags: ['母校情怀', '校园回忆'], likes: 128, comments: 36, shares: 12, views: 1520, isLiked: false, createTime: Date.now() - 1800000, userTags: ['技术大牛'] },
  { id: 'm002', userId: 'u002', userName: '李婷', userAvatar: 'https://picsum.photos/seed/user2/200/200', isVerified: true, content: '周末去母校走了走，变化真大！新体育馆和图书馆都建好了，学弟学妹们太幸福了～', images: ['https://picsum.photos/seed/campus4/800/600'], location: 'XX大学', tags: ['母校情怀', '校园回忆'], likes: 89, comments: 24, shares: 8, views: 892, isLiked: true, createTime: Date.now() - 7200000, userTags: ['教育行业'] },
  { id: 'm003', userId: 'u004', userName: '陈雪', userAvatar: 'https://picsum.photos/seed/user4/200/200', isVerified: true, content: '校友健康讲座第一期来啦！本周六下午3点，我将在线分享"职场人常见健康问题及预防"，欢迎各位校友参加！', images: ['https://picsum.photos/seed/health1/800/600','https://picsum.photos/seed/health2/800/600'], location: '线上直播', tags: ['健康讲座', '校友活动'], likes: 56, comments: 18, shares: 25, views: 634, isLiked: false, createTime: Date.now() - 14400000, userTags: ['医疗健康'] },
  { id: 'm004', userId: 'u005', userName: '赵阳', userAvatar: 'https://picsum.photos/seed/user5/200/200', isVerified: true, content: '分享一下最近在做的开源项目，一个面向校园的公益学习平台，欢迎大家一起来贡献代码！', images: ['https://picsum.photos/seed/code1/800/600','https://picsum.photos/seed/code2/800/600'], location: '杭州', tags: ['技术分享'], likes: 256, comments: 67, shares: 89, views: 2100, isLiked: false, createTime: Date.now() - 28800000, userTags: ['技术大牛'] },
  { id: 'm005', userId: 'u003', userName: '王浩', userAvatar: 'https://picsum.photos/seed/user3/200/200', isVerified: false, content: '请问校友们有没有做知识产权方向的律师或法务？最近公司有一些专利相关的问题需要咨询，求推荐！', images: [], location: '上海', tags: ['求助咨询', '法律'], likes: 23, comments: 15, shares: 3, views: 345, isLiked: false, createTime: Date.now() - 43200000, userTags: ['法律顾问'] },
  { id: 'm006', userId: 'u006', userName: '刘芳', userAvatar: 'https://picsum.photos/seed/user6/200/200', isVerified: false, content: '今年校友年会将于12月15日在母校礼堂举行，届时将有精彩的文艺表演和抽奖环节，欢迎大家踊跃报名！', images: ['https://picsum.photos/seed/event1/800/600'], location: 'XX大学大礼堂', tags: ['校友年会', '活动通知'], likes: 178, comments: 45, shares: 67, views: 1876, isLiked: false, createTime: Date.now() - 86400000, userTags: ['文化艺术'] },
  { id: 'm007', userId: 'u001', userName: '张明', userAvatar: 'https://picsum.photos/seed/user1/200/200', isVerified: true, content: '整理了一份前端学习路线图，从入门到进阶，包含所有必学知识点和学习资源。需要的校友评论区留言或私信我！', images: ['https://picsum.photos/seed/study1/800/600'], location: '北京', tags: ['技术分享', '学习资源'], likes: 312, comments: 89, shares: 156, views: 3200, isLiked: false, createTime: Date.now() - 172800000, userTags: ['技术大牛'] }
]

// ===== 模拟校友列表 =====
const MOCK_ALUMNI = generateAlumni()
function generateAlumni() {
  const departments = CONFIG.DEPARTMENTS
  const names = ['王伟','李娜','张磊','刘洋','陈静','杨帆','赵敏','黄蓉','周杰','吴昊','徐明','孙丽','马超','朱婷','胡波','郭靖','林芝','何勇','高远','罗琳']
  const locations = ['北京','上海','深圳','杭州','广州','成都','南京','武汉','西安','重庆']
  const tags = CONFIG.ALUMNI_TAGS
  const alumni = []
  for (let i = 0; i < 50; i++) {
    const year = 2010 + Math.floor(Math.random() * 14)
    const dept = departments[Math.floor(Math.random() * departments.length)]
    const tagCount = 1 + Math.floor(Math.random() * 3)
    const userTags = []
    for (let j = 0; j < tagCount; j++) {
      const t = tags[Math.floor(Math.random() * tags.length)]
      if (!userTags.includes(t)) userTags.push(t)
    }
    alumni.push({
      id: 'a' + String(i + 10).padStart(3, '0'),
      name: names[Math.floor(Math.random() * names.length)],
      avatar: `https://picsum.photos/seed/alumni${i}/200/200`,
      nickname: names[Math.floor(Math.random() * names.length)],
      department: dept,
      enrollmentYear: year,
      graduationYear: year + 4,
      location: locations[Math.floor(Math.random() * locations.length)],
      tags: userTags,
      isVerified: Math.random() > 0.6,
      distance: Math.floor(Math.random() * 100) + 'km'
    })
  }
  return alumni
}

// ===== 模拟活动 =====
const MOCK_EVENTS = [
  { id: 'e001', title: '2026年校友年会', coverImage: 'https://picsum.photos/seed/event-banner1/800/400', date: '2026-12-15', time: '14:00 - 17:30', location: 'XX大学大礼堂', description: '一年一度的校友盛会，让我们欢聚一堂，共叙校友情谊。', organizer: 'XX大学校友总会', participants: 256, maxParticipants: 500, isFavorited: false, status: 'upcoming', tags: ['年度盛会', '校友聚会'] },
  { id: 'e002', title: '校友创业沙龙——AI时代的机遇与挑战', coverImage: 'https://picsum.photos/seed/event-banner2/800/400', date: '2026-11-08', time: '15:00 - 18:00', location: '北京市海淀区中关村创业大街', description: '邀请多位在AI领域创业的校友分享他们的创业经验和行业洞察。', organizer: '校友创业俱乐部', participants: 89, maxParticipants: 150, isFavorited: true, status: 'upcoming', tags: ['创业', 'AI', '分享会'] },
  { id: 'e003', title: '校友篮球友谊赛', coverImage: 'https://picsum.photos/seed/event-banner3/800/400', date: '2026-10-22', time: '09:00 - 12:00', location: 'XX大学体育馆', description: '校友篮球爱好者们，让我们重返球场，挥洒汗水，重温青春岁月！', organizer: '校友体育协会', participants: 48, maxParticipants: 80, isFavorited: false, status: 'upcoming', tags: ['体育运动', '健康生活'] },
  { id: 'e004', title: '校友企业参访——走进华为', coverImage: 'https://picsum.photos/seed/event-banner4/800/400', date: '2026-09-16', time: '10:00 - 16:00', location: '华为深圳总部', description: '参访华为总部，了解华为最新技术和产品，与华为校友交流工作经验。', organizer: '计算机学院校友会', participants: 35, maxParticipants: 50, isFavorited: false, status: 'ended', tags: ['企业参访', '职业发展'] },
  { id: 'e005', title: '校友亲子嘉年华', coverImage: 'https://picsum.photos/seed/event-banner5/800/400', date: '2026-08-20', time: '10:00 - 15:00', location: 'XX大学草坪广场', description: '带上家人和孩子，来母校参加亲子嘉年华活动！有亲子游戏、手工制作、美食分享等丰富多彩的活动。', organizer: '校友家庭俱乐部', participants: 120, maxParticipants: 200, isFavorited: false, status: 'ended', tags: ['亲子活动', '家庭'] }
]

// ===== 模拟消息 =====
const MOCK_MESSAGES = [
  { id: 'msg001', type: 'comment', userName: '赵阳', userAvatar: 'https://picsum.photos/seed/user5/200/200', content: '回复了你的动态：太棒了!母校真的很美，下次一起回去看看', createTime: Date.now() - 600000, isRead: false, momentId: 'm001' },
  { id: 'msg002', type: 'like', userName: '李婷', userAvatar: 'https://picsum.photos/seed/user2/200/200', content: '赞了你的动态', createTime: Date.now() - 1800000, isRead: false, momentId: 'm003' },
  { id: 'msg003', type: 'follow', userName: '王浩', userAvatar: 'https://picsum.photos/seed/user3/200/200', content: '关注了你', createTime: Date.now() - 3600000, isRead: false, userId: 'u003' },
  { id: 'msg004', type: 'chat', userName: '赵阳', userAvatar: 'https://picsum.photos/seed/user5/200/200', content: '你好！看了你的动态，想认识一下～', createTime: Date.now() - 7200000, isRead: false, userId: 'u005' },
  { id: 'msg005', type: 'system', userName: '系统通知', userAvatar: '', content: '校友年会报名已开启，点击查看详情', createTime: Date.now() - 14400000, isRead: true },
  { id: 'msg006', type: 'comment', userName: '陈雪', userAvatar: 'https://picsum.photos/seed/user4/200/200', content: '回复了你的动态：谢谢分享!非常实用的资料', createTime: Date.now() - 28800000, isRead: true, momentId: 'm007' },
  { id: 'msg007', type: 'system', userName: '系统通知', userAvatar: '', content: '你的校友认证已通过审核', createTime: Date.now() - 86400000, isRead: true }
]

// ===== 模拟请求函数 =====
function mockRequest(data, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// ===== 导出供 API 层使用 =====
module.exports = {
  MOCK_USERS,
  MOCK_MOMENTS,
  MOCK_ALUMNI,
  MOCK_EVENTS,
  MOCK_MESSAGES,
  mockRequest,
  generateAlumni
}
