# 校友圈后端服务

## 技术栈
- **运行时**: Node.js 18+
- **框架**: Express.js
- **数据库**: SQLite (better-sqlite3)
- **鉴权**: JWT (jsonwebtoken)
- **文件上传**: Multer

## 快速启动

```bash
# 1. 安装依赖
cd server
npm install

# 2. 初始化数据库（插入种子数据）
node init-db.js

# 3. 启动服务（开发模式）
npm run dev

# 4. 启动服务（生产模式）
npm start
```

服务默认运行在 `http://localhost:3000`

## 部署到阿里云 ECS

### 方式一：手动部署

```bash
# 在本地打包
cd server
tar -czf alumni-server.tar.gz --exclude=node_modules --exclude=data .

# 上传到阿里云 ECS
scp alumni-server.tar.gz root@你的服务器IP:/opt/

# 在服务器上
ssh root@你的服务器IP
cd /opt
tar -xzf alumni-server.tar.gz
cd alumni-server
npm install
node init-db.js

# 使用 PM2 守护进程
npm install -g pm2
pm2 start app.js --name alumni-server
pm2 save
pm2 startup
```

### 方式二：使用 Docker（如有）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN node init-db.js
EXPOSE 3000
CMD ["node", "app.js"]
```

## 配置修改

编辑 `config.js`：

| 配置项 | 说明 |
|--------|------|
| `PORT` | 服务端口，默认 3000 |
| `JWT_SECRET` | 修改为随机字符串 |
| `API_BASE_URL` | 前端的 config.js 同步修改 |

## 前端对接

修改前端的 `utils/config.js`：

```javascript
USE_MOCK: false,
API_BASE_URL: 'http://你的服务器IP:3000/api/v1',
// 或绑定域名后
API_BASE_URL: 'https://你的域名.com/api/v1',
```

然后在微信公众平台配置服务器域名。

## API 接口列表

| 方法 | 路径 | 说明 | 需登录 |
|------|------|------|--------|
| POST | /api/login | 登录/注册 | 否 |
| GET | /api/user/:id | 获取用户信息 | 否 |
| POST | /api/user/update | 更新用户信息 | 是 |
| GET | /api/moments | 获取动态列表 | 否 |
| GET | /api/moments/:id | 获取动态详情 | 否 |
| POST | /api/moments/create | 发布动态 | 是 |
| POST | /api/moments/like | 点赞/取消 | 是 |
| GET | /api/alumni | 校友列表 | 否 |
| GET | /api/alumni/:id | 校友详情 | 否 |
| GET | /api/events | 活动列表 | 否 |
| GET | /api/events/:id | 活动详情 | 是 |
| POST | /api/events/join | 报名活动 | 是 |
| POST | /api/events/favorite | 收藏活动 | 是 |
| GET | /api/messages | 消息列表 | 是 |
| POST | /api/messages/read | 标记已读 | 是 |
| GET | /api/messages/unread | 未读数 | 是 |
| POST | /api/chats/send | 发送私信 | 是 |
| GET | /api/chats/:userId | 聊天记录 | 是 |
| GET | /api/health | 健康检查 | 否 |
