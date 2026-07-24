const API = require('../../utils/api')
const { formatTime, showLoading, hideLoading } = require('../../utils/util')

const app = getApp()

Page({
  data: {
    userInfo: null,
    moments: [],
    currentTab: 'all',
    page: 1,
    hasMore: true,
    isLoading: false,
    isRefreshing: false
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    // 新用户检测
    app.checkNewUser()
    this.loadMoments(true)
  },

  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    // 检查未读消息数
    this.checkUnread()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true,
      isRefreshing: true
    })
    this.loadMoments(true)
  },

  // 触底加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.setData({
        page: this.data.page + 1
      })
      this.loadMoments(false)
    }
  },

  async loadMoments(isRefresh) {
    if (this.data.isLoading) return
    this.setData({ isLoading: true })

    try {
      const res = await API.getMoments(this.data.page)
      if (res.code === 0) {
        this.setData({
          moments: isRefresh ? res.data.list : [...this.data.moments, ...res.data.list],
          hasMore: res.data.hasMore
        })
      }
    } catch (err) {
      console.error('Load moments error:', err)
    } finally {
      this.setData({ isLoading: false, isRefreshing: false })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
      page: 1,
      hasMore: true
    })
    this.loadMoments(true)
  },

  async onLike(e) {
    const momentId = e.detail
    try {
      const res = await API.toggleLike(momentId)
      if (res.code === 0) {
        const moments = this.data.moments.map(m => {
          if (m.id === momentId) {
            return { ...m, isLiked: res.data.isLiked, likes: res.data.likes }
          }
          return m
        })
        this.setData({ moments })
      }
    } catch (err) {
      console.error('Like error:', err)
    }
  },

  onComment(e) {
    const momentId = e.detail
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${momentId}`
    })
  },

  goToDetail(e) {
    const momentId = e.detail
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${momentId}`
    })
  },

  goToPublish() {
    if (!app.checkLogin()) return
    wx.navigateTo({
      url: `/pages/moments/moments?action=publish`
    })
  },

  // 分享动态
  onShareAppMessage(e) {
    const { momentid, momentcontent } = e.target.dataset
    const moment = this.data.moments.find(m => m.id === momentid)
    return {
      title: momentcontent ? (momentcontent.length > 30 ? momentcontent.slice(0, 30) + '...' : momentcontent) : '校友圈动态分享',
      path: `/pages/post-detail/post-detail?id=${momentid}`,
      imageUrl: moment?.images?.[0] || ''
    }
  },

  async checkUnread() {
    try {
      const res = await API.getUnreadCount()
      if (res.code === 0 && res.data.count > 0) {
        wx.setTabBarBadge({
          index: 3,
          text: String(res.data.count > 99 ? '99+' : res.data.count)
        })
      } else {
        wx.removeTabBarBadge({ index: 3 })
      }
    } catch (err) {
      console.error(err)
    }
  }
})
