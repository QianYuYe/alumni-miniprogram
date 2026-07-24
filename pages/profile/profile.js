const API = require('../../utils/api')
const { showSuccess, showError } = require('../../utils/util')

const app = getApp()

Page({
  data: {
    userInfo: null,
    isLogin: false,
    isSelf: true,
    isFollowing: false,
    defaultAvatar: 'https://picsum.photos/seed/default/200/200',
    userMoments: []
  },

  onLoad(options) {
    if (options.id) {
      // 查看他人主页
      this.setData({ isSelf: false })
      this.loadUserProfile(options.id)
    } else {
      this.setData({
        userInfo: app.globalData.userInfo,
        isLogin: app.globalData.isLogin,
        isSelf: true
      })
    }
  },

  onShow() {
    if (this.data.isSelf) {
      this.setData({
        userInfo: app.globalData.userInfo,
        isLogin: app.globalData.isLogin
      })
    }
  },

  async loadUserProfile(userId) {
    try {
      const res = await API.getUserInfo(userId)
      if (res.code === 0) {
        this.setData({ userInfo: res.data })
      }
    } catch (err) {
      console.error('Load user profile error:', err)
    }
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  gotoMyMoments() {
    if (!app.checkLogin()) return
    wx.showToast({ title: '我的动态', icon: 'none' })
  },

  gotoFavorites() {
    if (!app.checkLogin()) return
    wx.showToast({ title: '我的收藏', icon: 'none' })
  },

  gotoEvents() {
    if (!app.checkLogin()) return
    wx.switchTab({ url: '/pages/event/event' })
  },

  editProfile() {
    if (!app.checkLogin()) return
    wx.showToast({ title: '编辑资料', icon: 'none' })
  },

  gotoAbout() {
    wx.showModal({
      title: '关于校友圈',
      content: '校友圈 v1.0.0\n\n专为高校校友打造的交流平台，让校友之间的联系更紧密。',
      showCancel: false
    })
  },

  // 发送私信
  sendPrivateMessage() {
    if (!app.checkLogin()) return
    const user = this.data.userInfo
    wx.navigateTo({
      url: `/pages/chat/chat?userId=${user.id}&userName=${user.nickname || user.name}`
    })
  },

  // 关注/取消关注
  toggleFollow() {
    if (!app.checkLogin()) return
    this.setData({ isFollowing: !this.data.isFollowing })
    showSuccess(this.data.isFollowing ? '已关注' : '已取消关注')
  },

  gotoSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          this.setData({
            userInfo: null,
            isLogin: false
          })
          showSuccess('已退出登录')
        }
      }
    })
  }
})
