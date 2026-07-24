/**
 * 活动相关路由
 */
const express = require('express')
const db = require('../db')
const { authRequired } = require('../middleware/auth')

const router = express.Router()

function generateId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ==================== 获取活动列表 ====================
router.get('/events', (req, res) => {
  let sql = 'SELECT * FROM events'
  const params = []

  if (req.query.status) {
    sql += ' WHERE status = ?'
    params.push(req.query.status)
  }
  sql += ' ORDER BY date ASC'

  const rows = db.prepare(sql).all(...params)
  const list = rows.map(e => ({
    ...e,
    tags: JSON.parse(e.tags || '[]'),
    participantList: []
  }))

  res.json({ code: 0, data: { list, total: list.length } })
})

// ==================== 获取活动详情 ====================
router.get('/events/:id', authRequired, (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (!event) return res.json({ code: -1, message: '活动不存在' })

  // 获取参与者
  const participants = db.prepare(`
    SELECT u.id, u.nickname as name, u.avatar
    FROM event_participants ep
    LEFT JOIN users u ON ep.user_id = u.id
    WHERE ep.event_id = ?
  `).all(req.params.id)

  // 是否已收藏
  const isFavorited = !!db.prepare('SELECT id FROM event_favorites WHERE user_id = ? AND event_id = ?').get(req.user.id, req.params.id)

  res.json({
    code: 0,
    data: {
      ...event,
      tags: JSON.parse(event.tags || '[]'),
      participants: participants.length || event.participants,
      participantList: participants,
      isFavorited
    }
  })
})

// ==================== 报名活动 ====================
router.post('/events/join', authRequired, (req, res) => {
  const { eventId } = req.body

  try {
    db.prepare('INSERT INTO event_participants (user_id, event_id) VALUES (?, ?)').run(req.user.id, eventId)
    db.prepare('UPDATE events SET participants = participants + 1 WHERE id = ?').run(eventId)
    res.json({ code: 0, message: '报名成功' })
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.json({ code: -1, message: '您已报名此活动' })
    }
    throw err
  }
})

// ==================== 收藏/取消收藏 ====================
router.post('/events/favorite', authRequired, (req, res) => {
  const { eventId } = req.body
  const existing = db.prepare('SELECT id FROM event_favorites WHERE user_id = ? AND event_id = ?').get(req.user.id, eventId)

  if (existing) {
    db.prepare('DELETE FROM event_favorites WHERE user_id = ? AND event_id = ?').run(req.user.id, eventId)
  } else {
    db.prepare('INSERT INTO event_favorites (user_id, event_id) VALUES (?, ?)').run(req.user.id, eventId)
  }

  res.json({ code: 0, data: { isFavorited: !existing } })
})

module.exports = router
