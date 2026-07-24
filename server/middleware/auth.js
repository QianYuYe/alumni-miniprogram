/**
 * JWT 鉴权中间件
 */
const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * 验证 Token（必选）
 */
function authRequired(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ code: -1, message: '未登录，请先登录' })
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ code: -1, message: '登录已过期，请重新登录' })
  }
}

/**
 * 验证 Token（可选）
 */
function authOptional(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) {
    try {
      req.user = jwt.verify(token, config.JWT_SECRET)
    } catch (err) {
      // token 无效忽略
    }
  }
  next()
}

module.exports = { authRequired, authOptional }
