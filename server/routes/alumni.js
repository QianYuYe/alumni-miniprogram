/**
 * 校友相关路由
 */
const express = require('express')
const config = require('../config')
const db = require('../db')

const router = express.Router()

// ==================== 获取校友列表 ====================
router.get('/alumni', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.pageSize) || 10
  const offset = (page - 1) * pageSize

  let sql = 'SELECT * FROM users WHERE 1=1'
  let countSql = 'SELECT COUNT(*) as count FROM users WHERE 1=1'
  const params = []
  const countParams = []

  // 筛选条件
  if (req.query.department) {
    sql += ' AND department = ?'
    countSql += ' AND department = ?'
    params.push(req.query.department)
    countParams.push(req.query.department)
  }
  if (req.query.year) {
    sql += ' AND enrollment_year = ?'
    countSql += ' AND enrollment_year = ?'
    params.push(parseInt(req.query.year))
    countParams.push(parseInt(req.query.year))
  }
  if (req.query.keyword) {
    const kw = `%${req.query.keyword}%`
    sql += ' AND (nickname LIKE ? OR real_name LIKE ? OR department LIKE ?)'
    countSql += ' AND (nickname LIKE ? OR real_name LIKE ? OR department LIKE ?)'
    params.push(kw, kw, kw)
    countParams.push(kw, kw, kw)
  }

  const total = db.prepare(countSql).get(...countParams).count
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(pageSize, offset)

  const rows = db.prepare(sql).all(...params)
  const list = rows.map(u => ({
    id: u.id,
    name: u.nickname,
    nickname: u.nickname,
    avatar: u.avatar,
    department: u.department,
    enrollmentYear: u.enrollment_year,
    graduationYear: u.graduation_year,
    location: u.location,
    tags: JSON.parse(u.tags || '[]'),
    isVerified: !!u.is_verified,
    distance: Math.floor(Math.random() * 100) + 'km'
  }))

  res.json({ code: 0, data: { list, total, hasMore: offset + pageSize < total } })
})

// ==================== 获取校友详情 ====================
router.get('/alumni/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)
  if (!user) return res.json({ code: -1, message: '校友不存在' })

  res.json({
    code: 0,
    data: {
      id: user.id,
      name: user.nickname,
      nickname: user.nickname,
      realName: user.real_name,
      avatar: user.avatar,
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
  })
})

module.exports = router
