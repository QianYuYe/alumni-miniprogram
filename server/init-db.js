/**
 * 数据库初始化脚本 - 插入种子数据
 * 首次部署后运行: node init-db.js
 */
const db = require('./db')

console.log('正在初始化数据库...')

// ===== 插入模拟用户 =====
const users = [
  { id: 'u001', studentId: '2018001', nickname: '小明同学', realName: '张明', avatar: 'https://picsum.photos/seed/user1/200/200', department: '计算机科学与技术学院', enrollmentYear: 2018, location: '北京', bio: '热爱技术，持续学习。', tags: ['技术大牛'], isVerified: 1 },
  { id: 'u002', studentId: '2017002', nickname: '婷婷子', realName: '李婷', avatar: 'https://picsum.photos/seed/user2/200/200', department: '经济与管理学院', enrollmentYear: 2017, location: '深圳', bio: '终身学习者，热爱生活。', tags: ['教育行业'], isVerified: 1 },
  { id: 'u003', studentId: '2019003', nickname: '法学小王子', realName: '王浩', avatar: 'https://picsum.photos/seed/user3/200/200', department: '法学院', enrollmentYear: 2019, location: '上海', bio: '法律人，追求公平正义。', tags: ['法律顾问'], isVerified: 0 },
  { id: 'u004', studentId: '2016004', nickname: '雪儿', realName: '陈雪', avatar: 'https://picsum.photos/seed/user4/200/200', department: '医学院', enrollmentYear: 2016, location: '北京', bio: '医者仁心。', tags: ['医疗健康', '学术研究'], isVerified: 1 },
  { id: 'u005', studentId: '2015005', nickname: '阳光代码', realName: '赵阳', avatar: 'https://picsum.photos/seed/user5/200/200', department: '计算机科学与技术学院', enrollmentYear: 2015, location: '杭州', bio: '代码改变世界。', tags: ['技术大牛'], isVerified: 1 },
  { id: 'u006', studentId: '2020006', nickname: '芳芳', realName: '刘芳', avatar: 'https://picsum.photos/seed/user6/200/200', department: '新闻与传播学院', enrollmentYear: 2020, location: '北京', bio: '用镜头记录真实。', tags: ['文化艺术'], isVerified: 0 }
]

const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, student_id, nickname, real_name, avatar, department, enrollment_year, graduation_year, location, bio, tags, is_verified, moments_count, followers_count, following_count)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const u of users) {
  insertUser.run(u.id, u.studentId, u.nickname, u.realName, u.avatar, u.department, u.enrollmentYear, u.enrollmentYear + 4, u.location, u.bio, JSON.stringify(u.tags), u.isVerified, Math.floor(Math.random() * 50), Math.floor(Math.random() * 200), Math.floor(Math.random() * 100))
}
console.log(`  ✓ 插入 ${users.length} 个用户`)

// ===== 插入模拟动态 =====
const moments = [
  { id: 'm001', userId: 'u001', content: '毕业三年，重回母校，看到新建的图书馆和实验室，感慨万千。母校变得越来越好了！大家有空多回来看看。', images: ['https://picsum.photos/seed/campus1/800/600','https://picsum.photos/seed/campus2/800/600','https://picsum.photos/seed/campus3/800/600'], location: 'XX大学', tags: ['母校情怀', '校园回忆'], likes: 128, comments: 36, views: 1520 },
  { id: 'm002', userId: 'u002', content: '周末去母校走了走，变化真大！新体育馆和图书馆都建好了，学弟学妹们太幸福了～', images: ['https://picsum.photos/seed/campus4/800/600'], location: 'XX大学', tags: ['母校情怀', '校园回忆'], likes: 89, comments: 24, views: 892 },
  { id: 'm003', userId: 'u004', content: '校友健康讲座第一期来啦！本周六下午3点，我将在线分享"职场人常见健康问题及预防"，欢迎各位校友参加！', images: ['https://picsum.photos/seed/health1/800/600','https://picsum.photos/seed/health2/800/600'], location: '线上直播', tags: ['健康讲座', '校友活动'], likes: 56, comments: 18, views: 634 },
  { id: 'm004', userId: 'u005', content: '分享一下最近在做的开源项目，一个面向校园的公益学习平台，欢迎大家一起来贡献代码！', images: ['https://picsum.photos/seed/code1/800/600','https://picsum.photos/seed/code2/800/600'], location: '杭州', tags: ['技术分享'], likes: 256, comments: 67, views: 2100 },
  { id: 'm005', userId: 'u003', content: '请问校友们有没有做知识产权方向的律师或法务？最近公司有一些专利相关的问题需要咨询，求推荐！', images: [], location: '上海', tags: ['求助咨询', '法律'], likes: 23, comments: 15, views: 345 },
  { id: 'm006', userId: 'u006', content: '今年校友年会将于12月15日在母校礼堂举行，届时将有精彩的文艺表演和抽奖环节，欢迎大家踊跃报名！', images: ['https://picsum.photos/seed/event1/800/600'], location: 'XX大学大礼堂', tags: ['校友年会', '活动通知'], likes: 178, comments: 45, views: 1876 }
]

const insertMoment = db.prepare(`
  INSERT OR REPLACE INTO moments (id, user_id, content, images, location, tags, likes_count, comments_count, views_count)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const m of moments) {
  insertMoment.run(m.id, m.userId, m.content, JSON.stringify(m.images || []), m.location || '', JSON.stringify(m.tags || []), m.likes, m.comments, m.views)
}
console.log(`  ✓ 插入 ${moments.length} 条动态`)

// ===== 插入模拟活动 =====
const events = [
  { id: 'e001', title: '2026年校友年会', date: '2026-12-15', time: '14:00 - 17:30', location: 'XX大学大礼堂', description: '一年一度的校友盛会，让我们欢聚一堂，共叙校友情谊。', organizer: 'XX大学校友总会', participants: 256, maxParticipants: 500, tags: ['年度盛会', '校友聚会'] },
  { id: 'e002', title: '校友创业沙龙——AI时代的机遇与挑战', date: '2026-11-08', time: '15:00 - 18:00', location: '北京市海淀区中关村创业大街', description: '邀请多位校友分享创业经验和行业洞察。', organizer: '校友创业俱乐部', participants: 89, maxParticipants: 150, tags: ['创业', 'AI', '分享会'] },
  { id: 'e003', title: '校友篮球友谊赛', date: '2026-10-22', time: '09:00 - 12:00', location: 'XX大学体育馆', description: '校友篮球爱好者们，让我们重返球场，挥洒汗水，重温青春岁月！', organizer: '校友体育协会', participants: 48, maxParticipants: 80, tags: ['体育运动', '健康生活'] }
]

const insertEvent = db.prepare(`
  INSERT OR REPLACE INTO events (id, title, cover_image, date, time, location, description, organizer, participants, max_participants, status, tags)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const e of events) {
  insertEvent.run(e.id, e.title, `https://picsum.photos/seed/event-banner${e.id.slice(-1)}/800/400`, e.date, e.time, e.location, e.description, e.organizer, e.participants, e.maxParticipants, 'upcoming', JSON.stringify(e.tags))
}
console.log(`  ✓ 插入 ${events.length} 个活动`)

// ===== 插入模拟评论 =====
const comments = [
  { id: 'c001', userId: 'u005', momentId: 'm001', content: '太棒了！母校真的很美！', likes: 5 },
  { id: 'c002', userId: 'u002', momentId: 'm001', content: '赞一个！下次一起去', likes: 3 },
  { id: 'c003', userId: 'u003', momentId: 'm001', content: '下次一起约！', likes: 2 }
]

const insertComment = db.prepare(`
  INSERT OR REPLACE INTO comments (id, user_id, moment_id, content, likes_count)
  VALUES (?, ?, ?, ?, ?)
`)

for (const c of comments) {
  insertComment.run(c.id, c.userId, c.momentId, c.content, c.likes)
}
console.log(`  ✓ 插入 ${comments.length} 条评论`)

console.log('\n✅ 数据库初始化完成！')
console.log('启动服务: npm start')
