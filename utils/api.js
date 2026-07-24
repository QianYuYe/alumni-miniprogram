/**
 * API 接口�?
 * 
 * 架构说明�?
 * USE_MOCK=true  (默认) �?使用 mock-data.js 的模拟数据，无需后端
 * USE_MOCK=false          �?通过 request.js 调用真实阿里云服务器
 * 切换方式：修�?config.js 中的 USE_MOCK 字段
 */

const CONFIG = require('./config')
const http = require('./request')
const { generateId } = require('./util')

// ==================== 模式选择 ====================
let mockAPI
if (CONFIG.USE_MOCK) {
  mockAPI = require('./mock-data')
}

/**
 * 统一调用入口：mock 模式走本地数据，否则�?HTTP
 */
function callAPI(mockFn, apiPath, params = {}) {
  if (CONFIG.USE_MOCK) {
    return mockFn(params)
  }
  const method = params._method || 'GET'
  if (method === 'GET') {
    return http.get(apiPath, params)
  }
  return http.post(apiPath, params)
}

// ==================== API 接口 ====================
const API = {

  // ===== 用户相关 =====
  login(params) {
    return callAPI(
      () => {
        const user = mockAPI.MOCK_USERS.find(u => u.studentId === params.studentId)
        const baseUser = user || mockAPI.MOCK_USERS[Math.floor(Math.random() * mockAPI.MOCK_USERS.length)]
        const userInfo = {
          id: params.studentId || 'u' + Date.now(),
          name: params.nickname || baseUser.name,
          nickname: params.nickname || baseUser.nickname || baseUser.name,
          realName: params.realName || baseUser.realName || baseUser.name,
          avatar: params.avatar || baseUser.avatar,
          studentId: params.studentId || 'WX' + Date.now().toString().slice(-8),
          department: params.department || baseUser.department,
          enrollmentYear: params.year || baseUser.enrollmentYear,
          graduationYear: (params.year || baseUser.enrollmentYear) + 4,
          location: baseUser.location || '',
          bio: params.fromWechat ? '微信用户' : (baseUser.bio || ''),
          tags: baseUser.tags || [],
          isVerified: false,
          moments: 0,
          followers: 0,
          following: 0
        }
        return mockAPI.mockRequest({ code: 0, message: '登录成功', data: { token: 'mock_token_' + Date.now(), userInfo } })
      },
      '/api/login', { ...params, _method: 'POST' }
    )
  },

  getUserInfo(userId) {
    return callAPI(
      () => {
        const user = mockAPI.MOCK_USERS.find(u => u.id === userId) || mockAPI.MOCK_USERS[0]
        return mockAPI.mockRequest({ code: 0, data: user })
      },
      `/api/user/${userId}`
    )
  },

  updateUserInfo(data) {
    return callAPI(() => mockAPI.mockRequest({ code: 0, message: '更新成功', data }), '/api/user/update', { ...data, _method: 'POST' })
  },

  // ===== 动态相�?=====
  getMoments(page = 1, pageSize = 10) {
    return callAPI(
      () => {
        const start = (page - 1) * pageSize
        const list = mockAPI.MOCK_MOMENTS.slice(start, start + pageSize)
        return mockAPI.mockRequest({ code: 0, data: { list, total: mockAPI.MOCK_MOMENTS.length, hasMore: start + pageSize < mockAPI.MOCK_MOMENTS.length } })
      },
      '/api/moments', { page, pageSize }
    )
  },

  getMomentDetail(momentId) {
    return callAPI(
      () => {
        const moment = mockAPI.MOCK_MOMENTS.find(m => m.id === momentId) || mockAPI.MOCK_MOMENTS[0]
        const comments = [
          { id: 'c001', userName: '赵阳', userAvatar: 'https://picsum.photos/seed/user5/200/200', content: '太棒了！', createTime: Date.now() - 3600000, likes: 5 },
          { id: 'c002', userName: '李婷', userAvatar: 'https://picsum.photos/seed/user2/200/200', content: '赞一个！', createTime: Date.now() - 7200000, likes: 3 },
          { id: 'c003', userName: '王浩', userAvatar: 'https://picsum.photos/seed/user3/200/200', content: '下次一起约�?, createTime: Date.now() - 10800000, likes: 2 }
        ]
        return mockAPI.mockRequest({ code: 0, data: { ...moment, comments } })
      },
      `/api/moments/${momentId}`
    )
  },

  createMoment(data) {
    return callAPI(
      () => {
        const newMoment = { id: generateId(), ...data, likes: 0, comments: 0, shares: 0, views: 0, isLiked: false, createTime: Date.now() }
        mockAPI.MOCK_MOMENTS.unshift(newMoment)
        return mockAPI.mockRequest({ code: 0, message: '发布成功', data: newMoment })
      },
      '/api/moments/create', { ...data, _method: 'POST' }
    )
  },

  toggleLike(momentId) {
    return callAPI(
      () => {
        const moment = mockAPI.MOCK_MOMENTS.find(m => m.id === momentId)
        if (moment) { moment.isLiked = !moment.isLiked; moment.likes += moment.isLiked ? 1 : -1 }
        return mockAPI.mockRequest({ code: 0, data: { isLiked: moment?.isLiked, likes: moment?.likes } })
      },
      '/api/moments/like', { momentId, _method: 'POST' }
    )
  },

  // ===== 校友相关 =====
  getAlumniList(params = {}) {
    return callAPI(
      () => {
        let list = [...mockAPI.MOCK_ALUMNI]
        if (params.department) list = list.filter(a => a.department === params.department)
        if (params.year) list = list.filter(a => a.enrollmentYear === params.year)
        if (params.keyword) {
          const kw = params.keyword.toLowerCase()
          list = list.filter(a => a.name.includes(kw) || a.department.toLowerCase().includes(kw))
        }
        if (params.tag) list = list.filter(a => a.tags.includes(params.tag))
        const page = params.page || 1
        const pageSize = params.pageSize || 10
        const start = (page - 1) * pageSize
        const paged = list.slice(start, start + pageSize)
        return mockAPI.mockRequest({ code: 0, data: { list: paged, total: list.length, hasMore: start + pageSize < list.length } })
      },
      '/api/alumni', params
    )
  },

  getAlumniDetail(alumniId) {
    return callAPI(
      () => {
        const alumni = mockAPI.MOCK_ALUMNI.find(a => a.id === alumniId) || mockAPI.MOCK_ALUMNI[0]
        return mockAPI.mockRequest({ code: 0, data: alumni })
      },
      `/api/alumni/${alumniId}`
    )
  },

  // ===== 活动相关 =====
  getEvents(params = {}) {
    return callAPI(
      () => {
        let list = [...mockAPI.MOCK_EVENTS]
        if (params.status) list = list.filter(e => e.status === params.status)
        return mockAPI.mockRequest({ code: 0, data: { list, total: list.length } })
      },
      '/api/events', params
    )
  },

  getEventDetail(eventId) {
    return callAPI(
      () => {
        const event = mockAPI.MOCK_EVENTS.find(e => e.id === eventId) || mockAPI.MOCK_EVENTS[0]
        const participants = mockAPI.MOCK_USERS.slice(0, 5).map(u => ({ id: u.id, name: u.name, avatar: u.avatar }))
        return mockAPI.mockRequest({ code: 0, data: { ...event, participants } })
      },
      `/api/events/${eventId}`
    )
  },

  joinEvent(eventId) {
    return callAPI(() => mockAPI.mockRequest({ code: 0, message: '报名成功' }), '/api/events/join', { eventId, _method: 'POST' })
  },

  toggleFavorite(eventId) {
    return callAPI(
      () => {
        const event = mockAPI.MOCK_EVENTS.find(e => e.id === eventId)
        if (event) event.isFavorited = !event.isFavorited
        return mockAPI.mockRequest({ code: 0, data: { isFavorited: event?.isFavorited } })
      },
      '/api/events/favorite', { eventId, _method: 'POST' }
    )
  },

  // ===== 消息相关 =====
  getMessages() {
    return callAPI(() => mockAPI.mockRequest({ code: 0, data: { list: mockAPI.MOCK_MESSAGES } }), '/api/messages')
  },

  markAsRead(messageId) {
    return callAPI(
      () => {
        const msg = mockAPI.MOCK_MESSAGES.find(m => m.id === messageId)
        if (msg) msg.isRead = true
        return mockAPI.mockRequest({ code: 0 })
      },
      '/api/messages/read', { messageId, _method: 'POST' }
    )
  },

  getUnreadCount() {
    return callAPI(
      () => {
        const count = mockAPI.MOCK_MESSAGES.filter(m => !m.isRead).length
        return mockAPI.mockRequest({ code: 0, data: { count } })
      },
      '/api/messages/unread'
    )
  }
}

module.exports = API
