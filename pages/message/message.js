const API = require('../../utils/api')
const { formatTime } = require('../../utils/util')

Page({
  data: {
    currentTab: 'all',
    messages: [],
    unreadCount: 0
  },

  onLoad() {
    this.loadMessages()
  },

  onShow() {
    this.loadMessages()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.loadMessages()
  },

  async loadMessages() {
    try {
      const res = await API.getMessages()
      if (res.code === 0) {
        let list = res.data.list
        if (this.data.currentTab !== 'all') {
          list = list.filter(m => m.type === this.data.currentTab)
        }
        const unread = list.filter(m => !m.isRead).length
        this.setData({
          messages: list,
          unreadCount: unread
        })
      }
    } catch (err) {
      console.error('Load messages error:', err)
    }
  },

  formattedTime(time) {
    return formatTime(time)
  },

  async onMsgTap(e) {
    const { id } = e.currentTarget.dataset
    try {
      await API.markAsRead(id)
      this.loadMessages()
    } catch (err) {
      console.error(err)
    }

    // 根据消息类型导航
    const msg = this.data.messages.find(m => m.id === id)
    if (!msg) return

    switch (msg.type) {
      case 'comment':
      case 'like':
        // 跳到对应的动态详情
        if (msg.momentId) {
          wx.navigateTo({
            url: `/pages/post-detail/post-detail?id=${msg.momentId}`
          })
        }
        break
      case 'follow':
        // 跳到该用户的主页
        if (msg.userId) {
          wx.navigateTo({
            url: `/pages/profile/profile?id=${msg.userId}`
          })
        }
        break
      case 'chat':
        // 打开私信对话
        if (msg.userId) {
          wx.navigateTo({
            url: `/pages/chat/chat?userId=${msg.userId}&userName=${msg.userName}`
          })
        }
        break
      default:
        break
    }
  }
})
