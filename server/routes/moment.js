/**
 * 动态相关路由
 */
const express = require('express')
const db = require('../db')
const { authRequired, authOptional } = require('../middleware/auth')

const router = express.Router()

function generateId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function formatMoment(row, userId) {
  const images = JSON.parse(row.images || '[]')
  const tags = JSON.parse(row.tags || '[]')
  const userTags = JSON.parse(row.user_tags || '[]')
  const isLiked = userId ? !!db.prepare('SELECT id FROM likes WHERE user_id = ? AND moment_id = ?').get(userId, row.id) : false
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.nickname || row.user_name || '',
    userAvatar: row.avatar || row.user_avatar || '',
    isVerified: !!row.is_verified,
    content: row.content,
    images,
    location: row.location,
    tags,
    likes: row.likes_count,
    comments: row.comments_count,
    shares: row.shares_count,
    views: row.views_count,
    isLiked,
    createTime: new Date(row.created_at).getTime(),
    userTags
  }
}

// ==================== 获取动态列表 ====================
router.get('/moments', authOptional, (req, res) => {
  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.pageSize) || 10
  const offset = (page - 1) * pageSize

  const total = db.prepare('SELECT COUNT(*) as count FROM moments').get().count
  const rows = db.prepare(`
    SELECT m.*, u.nickname, u.avatar, u.is_verified, u.tags as user_tags
    FROM moments m
    LEFT JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
    LIMIT ? OFFSET ?
  `).all(pageSize, offset)

  const list = rows.map(r => formatMoment(r, req.user?.id))

  res.json({
    code: 0,
    data: { list, total, hasMore: offset + pageSize < total }
  })
})

// ==================== 获取动态详情 ====================
router.get('/moments/:id', authOptional, (req, res) => {
  const row = db.prepare(`
    SELECT m.*, u.nickname, u.avatar, u.is_verified, u.tags as user_tags
    FROM moments m
    LEFT JOIN users u ON m.user_id = u.id
    WHERE m.id = ?
  `).get(req.params.id)

  if (!row) return res.json({ code: -1, message: '动态不存在' })

  // 增加浏览量
  db.prepare('UPDATE moments SET views_count = views_count + 1 WHERE id = ?').run(req.params.id)

  // 查询评论
  const comments = db.prepare(`
    SELECT c.*, u.nickname as user_name, u.avatar as user_avatar
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.moment_id = ?
    ORDER BY c.created_at ASC
  `).all(req.params.id)

  const moment = formatMoment(row, req.user?.id)
  moment.comments = comments.map(c => ({
    id: c.id,
    userName: c.user_name,
    userAvatar: c.user_avatar,
    content: c.content,
    createTime: new Date(c.created_at).getTime(),
    likes: c.likes_count
  }))

  res.json({ code: 0, data: moment })
})

// ==================== 发布动态 ====================
router.post('/moments/create', authRequired, (req, res) => {
  const { content, images, location, tags, userTags } = req.body
  if (!content) return res.json({ code: -1, message: '内容不能为空' })

  const id = 'm' + generateId()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO moments (id, user_id, content, images, location, tags, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, req.user.id, content,
    JSON.stringify(images || []),
    location || '',
    JSON.stringify(tags || []),
    now
  )

  // 更新用户动态数
  db.prepare('UPDATE users SET moments_count = moments_count + 1 WHERE id = ?').run(req.user.id)

  const moment = {
    id, userId: req.user.id, userName: req.user.nickname,
    content, images: images || [], location: location || '', tags: tags || [],
    likes: 0, comments: 0, shares: 0, views: 0, isLiked: false,
    createTime: new Date(now).getTime(), userTags: userTags || []
  }

  res.json({ code: 0, message: '发布成功', data: moment })
})

// ==================== 点赞/取消点赞 ====================
router.post('/moments/like', authRequired, (req, res) => {
  const { momentId } = req.body
  if (!momentId) return res.json({ code: -1, message: '参数错误' })

  const existing = db.prepare('SELECT id FROM likes WHERE user_id = ? AND moment_id = ?').get(req.user.id, momentId)

  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND moment_id = ?').run(req.user.id, momentId)
    db.prepare('UPDATE moments SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(momentId)
  } else {
    db.prepare('INSERT INTO likes (user_id, moment_id) VALUES (?, ?)').run(req.user.id, momentId)
    db.prepare('UPDATE moments SET likes_count = likes_count + 1 WHERE id = ?').run(momentId)
  }

  const moment = db.prepare('SELECT likes_count FROM moments WHERE id = ?').get(momentId)
  res.json({ code: 0, data: { isLiked: !existing, likes: moment?.likes_count || 0 } })
})

module.exports = router
