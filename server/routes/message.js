/**
 * 消息相关路由
 */
const express = require('express')
const db = require('../db')
const { authRequired } = require('../middleware/auth')

const router = express.Router()

function generateId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ==================== 获取消息列表 ====================
router.get('/messages', authRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT m.*, u.nickname as user_name, u.avatar as user_avatar
    FROM messages m
    LEFT JOIN users u ON m.from_user_id = u.id
    WHERE m.to_user_id = ?
    ORDER BY m.created_at DESC
  `).all(req.user.id)

  const list = rows.map(m => ({
    id: m.id,
    type: m.type,
    userName: m.user_name || (m.type === 'system' ? '系统通知' : ''),
    userAvatar: m.user_avatar || '',
    content: m.content,
    createTime: new Date(m.created_at).getTime(),
    isRead: !!m.is_read,
    momentId: m.ref_id && m.type !== 'chat' ? m.ref_id : undefined,
    userId: m.from_user_id
  }))

  res.json({ code: 0, data: { list } })
})

// ==================== 标记已读 ====================
router.post('/messages/read', authRequired, (req, res) => {
  const { messageId } = req.body
  db.prepare('UPDATE messages SET is_read = 1 WHERE id = ? AND to_user_id = ?').run(messageId, req.user.id)
  res.json({ code: 0 })
})

// ==================== 未读数 ====================
router.get('/messages/unread', authRequired, (req, res) => {
  const count = db.prepare('SELECT COUNT(*) as count FROM messages WHERE to_user_id = ? AND is_read = 0').get(req.user.id).count
  res.json({ code: 0, data: { count } })
})

// ==================== 发送私信 ====================
router.post('/chats/send', authRequired, (req, res) => {
  const { toUserId, content, isImage, imageUrl } = req.body
  if (!toUserId) return res.json({ code: -1, message: '参数错误' })

  const id = 'chat_' + generateId()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO chats (id, from_user_id, to_user_id, content, is_image, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, toUserId, content || '', isImage ? 1 : 0, imageUrl || '', now)

  // 同时创建消息通知
  const msgId = 'msg_' + generateId()
  db.prepare(`
    INSERT INTO messages (id, type, from_user_id, to_user_id, content, created_at)
    VALUES (?, 'chat', ?, ?, ?, ?)
  `).run(msgId, req.user.id, toUserId, content || '', now)

  res.json({ code: 0, message: '发送成功', data: { id, createdAt: now } })
})

// ==================== 获取聊天记录 ====================
router.get('/chats/:userId', authRequired, (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM chats
    WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)
    ORDER BY created_at ASC
  `).all(req.user.id, req.params.userId, req.params.userId, req.user.id)

  const list = rows.map(c => ({
    id: c.id,
    from: c.from_user_id,
    content: c.content,
    time: new Date(c.created_at).getTime(),
    isSelf: c.from_user_id === req.user.id,
    isImage: !!c.is_image,
    imageUrl: c.image_url
  }))

  res.json({ code: 0, data: { list } })
})

module.exports = router
