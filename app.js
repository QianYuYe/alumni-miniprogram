// app.js
App({
  globalData: {
    userInfo: null,
    isLogin: false,
    token: '',
    apiBaseUrl: 'https://api.alumni.example.com',
    collegeName: 'XX大学'
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
      this.globalData.isLogin = true
    }

    // 获取系统信息
    wx.getSystemInfoAsync({
      success: (res) => {
        this.globalData.systemInfo = res
      }
    })
  },

  // 检查新用户，未注册则跳登录
  checkNewUser() {
    const registered = wx.getStorageSync('hasRegistered')
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const isLoginPage = currentPage && currentPage.route === 'pages/login/login'
    if (!registered && !this.globalData.isLogin && !isLoginPage) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
      return false
    }
    return true
  },

  // 登录方法
  login(userInfo) {
    this.globalData.userInfo = userInfo
    this.globalData.isLogin = true
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('hasRegistered', true)
    // 实际项目中应调用后端API获取token
    const mockToken = 'token_' + Date.now()
    this.globalData.token = mockToken
    wx.setStorageSync('token', mockToken)
  },

  // 退出登录
  logout() {
    this.globalData.userInfo = null
    this.globalData.isLogin = false
    this.globalData.token = ''
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
  },

  // 检查登录，未登录则跳转
  checkLogin() {
    if (!this.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false
    }
    return true
  }
})
