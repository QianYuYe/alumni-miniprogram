# 校友圈微信小程序

## 项目简介
专为高校校友打造的交流平台，让校友之间的联系更紧密。

## 功能特性
- 🏠 **校友动态** - 发布图文动态，点赞评论互动
- 👥 **校友录** - 按学院、年级筛选查找校友
- 📅 **校友活动** - 发布和报名参加校友活动
- 💬 **消息通知** - 评论、点赞、系统通知
- 👤 **个人中心** - 校友认证、资料编辑

## 项目结构
```
alumni-miniprogram/
├── app.js              # 全局逻辑
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── project.config.json # 项目配置
├── sitemap.json        # 搜索配置
├── pages/              # 页面
│   ├── index/          # 首页（动态流）
│   ├── login/          # 登录页
│   ├── moments/        # 发布动态
│   ├── post-detail/    # 动态详情
│   ├── alumni/         # 校友录
│   ├── event/          # 活动列表
│   ├── event-detail/   # 活动详情
│   ├── message/        # 消息
│   └── profile/        # 个人中心
├── components/         # 公共组件
│   ├── post-card/      # 动态卡片
│   ├── alumni-card/    # 校友卡片
│   └── event-card/     # 活动卡片
├── utils/              # 工具函数
│   ├── api.js          # API接口+模拟数据
│   ├── config.js       # 配置文件
│   └── util.js         # 工具函数
├── images/             # 图标资源
└── scripts/            # 辅助脚本
```

## 使用说明

### 1. 安装依赖
本项目为纯原生微信小程序开发，无需安装额外依赖。

### 2. 配置小程序
- 打开 `project.config.json`，将 `appid` 替换为你的微信小程序 AppID
- 在 `utils/config.js` 中修改 `COLLEGE_NAME` 为你的学校名称
- 在 `utils/config.js` 中修改 `DEPARTMENTS` 为学校的院系列表

### 3. 运行
使用微信开发者工具打开项目根目录即可预览。

### 4. 连接真实后端
`utils/api.js` 中包含了完整的模拟数据，对接真实后端时：
- 修改 `CONFIG.API_BASE_URL` 为后端地址
- 替换 `mockRequest` 为真实的 `wx.request` 调用
- 移除或替换模拟数据

### 5. 替换图标
`images/` 目录下的图标为自动生成的占位图标，建议替换为专业设计的图标。
推荐使用 [iconfont](https://www.iconfont.cn) 生成小程序图标。

## 开发建议
- 使用微信开发者工具的「预览」功能在手机上测试
- 真机调试时注意网络请求配置
- 发布前在「微信公众平台」配置服务器域名
