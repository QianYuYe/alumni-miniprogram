/**
 * ==========================================
 * 校友圈 - Node.js 后端服务入口
 * 技术栈: Express + SQLite + JWT
 * 部署: 阿里云 ECS
 * ==========================================
 */

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const config = require('./config')
const db = require('./db')

// 导入路由
const userRoutes = require('./routes/user')
const momentRoutes = require('./routes/moment')
const alumniRoutes = require('./routes/alumni')
const eventRoutes = require('./routes/event')
const messageRoutes = require('./routes/message')

const app = express()

// ===== 中间件 =====
app.use(cors({ origin: '*' }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 静态文件（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ===== 路由注册 =====
app.use('/api', userRoutes)
app.use('/api', momentRoutes)
app.use('/api', alumniRoutes)
app.use('/api', eventRoutes)
app.use('/api', messageRoutes)

// ===== 健康检查 =====
app.get('/api/health', (req, res) => {
  res.json({ code: 0, message: 'ok', timestamp: Date.now() })
})

// ===== 全局错误处理 =====
app.use((err, req, res, next) => {
  console.error('[Error]', err)
  res.status(500).json({ code: -1, message: err.message || '服务器内部错误' })
})

// ===== 启动服务 =====
app.listen(config.PORT, () => {
  console.log(`========================================`)
  console.log(`  校友圈后端服务已启动`)
  console.log(`  地址: http://localhost:${config.PORT}`)
  console.log(`  环境: ${config.ENV}`)
  console.log(`  数据库: ${config.DB_PATH}`)
  console.log(`========================================`)
})
