/**
 * 用户相关路由
 */
const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('../config')
const db = require('../db')
const { authRequired } = require('../middleware/auth')

const router = express.Router()

// 工具：生成 ID
function generateId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ==================== 登录/注册 ====================
router.post('/login', (req, res) => {
  const { studentId, nickname, realName, year, department, avatar, fromWechat } = req.body

  if (!nickname || !realName) {
    return res.json({ code: -1, message: '昵称和真实姓名为必填' })
  }

  // 查找已有用户
  let user = studentId ? db.prepare('SELECT * FROM users WHERE student_id = ?').get(studentId) : null

  if (!user) {
    // 创建新用户
    const id = 'u' + generateId()
    const now = new Date().toISOString()
    db.prepare(`
      INSERT INTO users (id, student_id, nickname, real_name, avatar, department, enrollment_year, graduation_year, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      studentId || 'WX' + Date.now().toString().slice(-8),
      nickname,
      realName,
      avatar || `https://picsum.photos/seed/${id}/200/200`,
      department || '其他',
      year || new Date().getFullYear(),
      (year || new Date().getFullYear()) + 4,
      fromWechat ? '微信用户' : ''
    )
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  }

  // 生成 Token
  const token = jwt.sign(
    { id: user.id, nickname: user.nickname },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  )

  res.json({
    code: 0,
    message: '登录成功',
    data: {
      token,
      userInfo: formatUser(user)
    }
  })
})

// ==================== 获取用户信息 ====================
router.get('/user/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!user) {
    return res.json({ code: -1, message: '用户不存在' })
  }
  res.json({ code: 0, data: formatUser(user) })
})

// ==================== 更新用户信息 ====================
router.post('/user/update', authRequired, (req, res) => {
  const { nickname, realName, avatar, department, enrollmentYear, location, bio, tags } = req.body
  const updateFields = []
  const updateValues = []

  if (nickname) { updateFields.push('nickname = ?'); updateValues.push(nickname) }
  if (realName) { updateFields.push('real_name = ?'); updateValues.push(realName) }
  if (avatar) { updateFields.push('avatar = ?'); updateValues.push(avatar) }
  if (department) { updateFields.push('department = ?'); updateValues.push(department) }
  if (enrollmentYear) { updateFields.push('enrollment_year = ?'); updateValues.push(enrollmentYear) }
  if (location) { updateFields.push('location = ?'); updateValues.push(location) }
  if (bio) { updateFields.push('bio = ?'); updateValues.push(bio) }
  if (tags) { updateFields.push('tags = ?'); updateValues.push(JSON.stringify(tags)) }

  if (updateFields.length > 0) {
    updateFields.push("updated_at = datetime('now', 'localtime')")
    updateValues.push(req.user.id)
    db.prepare(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`).run(...updateValues)
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  res.json({ code: 0, message: '更新成功', data: formatUser(user) })
})

// ==================== 格式化用户输出 ====================
function formatUser(user) {
  return {
    id: user.id,
    name: user.nickname,
    nickname: user.nickname,
    realName: user.real_name,
    avatar: user.avatar,
    studentId: user.student_id,
    department: user.department,
    enrollmentYear: user.enrollment_year,
    graduationYear: user.graduation_year,
    location: user.location,
    bio: user.bio,
    tags: JSON.parse(user.tags || '[]'),
    isVerified: !!user.is_verified,
    moments: user.moments_count,
    followers: user.followers_count,
    following: user.following_count
  }
}

module.exports = router
