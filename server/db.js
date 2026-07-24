/**
 * 数据库模块 - SQLite
 * 使用 better-sqlite3，无需安装数据库服务器
 */
const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const config = require('./config')

// 确保 data 目录存在
const dataDir = path.dirname(config.DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(config.DB_PATH)

// 启用 WAL 模式（提高并发性能）
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ===== 建表 =====
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    student_id TEXT UNIQUE,
    nickname TEXT NOT NULL,
    real_name TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    department TEXT DEFAULT '',
    enrollment_year INTEGER DEFAULT 0,
    graduation_year INTEGER DEFAULT 0,
    location TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    is_verified INTEGER DEFAULT 0,
    moments_count INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  -- 动态表
  CREATE TABLE IF NOT EXISTS moments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    location TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 点赞表
  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    moment_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(user_id, moment_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (moment_id) REFERENCES moments(id)
  );

  -- 评论表
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    moment_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (moment_id) REFERENCES moments(id)
  );

  -- 活动表
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    cover_image TEXT DEFAULT '',
    date TEXT NOT NULL,
    time TEXT DEFAULT '',
    location TEXT DEFAULT '',
    description TEXT DEFAULT '',
    organizer TEXT DEFAULT '',
    participants INTEGER DEFAULT 0,
    max_participants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'upcoming',
    tags TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  -- 活动报名表
  CREATE TABLE IF NOT EXISTS event_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
  );

  -- 活动收藏表
  CREATE TABLE IF NOT EXISTS event_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
  );

  -- 消息表
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'system',
    from_user_id TEXT,
    to_user_id TEXT NOT NULL,
    content TEXT DEFAULT '',
    ref_id TEXT DEFAULT '',
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
  );

  -- 私信表
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    from_user_id TEXT NOT NULL,
    to_user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_image INTEGER DEFAULT 0,
    image_url TEXT DEFAULT '',
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
  );
`)

module.exports = db
