const CONFIG = require('../../utils/config')
const API = require('../../utils/api')
const { showSuccess, showError, showLoading, hideLoading } = require('../../utils/util')

const app = getApp()

Page({
  data: {
    studentId: '',
    nickname: '',
    realName: '',
    yearIndex: -1,
    deptIndex: -1,
    years: CONFIG.ENROLLMENT_YEARS,
    departments: CONFIG.DEPARTMENTS,
    isLoading: false
  },

  onLoad() {
    // 如果已登录，直接跳转到首页
    if (app.globalData.isLogin) {
      this.goToIndex()
    }
  },

  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // ===== 微信一键登录（模拟） =====
  wechatLogin() {
    const that = this
    // 模拟微信 wx.login 获取 code
    wx.showModal({
      title: '微信快捷登录',
      content: '将使用微信信息快速创建校友账号，是否继续？',
      success(res) {
        if (res.confirm) {
          that.fastRegister()
        }
      }
    })
  },

  async fastRegister() {
    this.setData({ isLoading: true })
    showLoading('微信登录中...')

    try {
      // 模拟微信登录 + 获取用户信息
      const mockWechatUser = {
        openid: 'mock_openid_' + Date.now(),
        nickName: '微信用户' + Math.floor(Math.random() * 10000),
        avatarUrl: 'https://picsum.photos/seed/wechat' + Math.floor(Math.random() * 1000) + '/200/200'
      }

      // 用微信昵称自动填充网名
      const params = {
        studentId: 'WX' + Date.now().toString().slice(-8),
        nickname: mockWechatUser.nickName,
        realName: '校友',
        year: new Date().getFullYear(),
        department: '其他',
        avatar: mockWechatUser.avatarUrl,
        fromWechat: true
      }

      const res = await API.login(params)
      if (res.code === 0) {
        app.login(res.data.userInfo)
        showSuccess('登录成功')
        setTimeout(() => {
          this.goToIndex()
        }, 1000)
      }
    } catch (err) {
      showError('登录异常，请稍后重试')
      console.error('WeChat login error:', err)
    } finally {
      this.setData({ isLoading: false })
      hideLoading()
    }
  },

  // ===== 表单输入 =====
  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value })
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  onRealNameInput(e) {
    this.setData({ realName: e.detail.value })
  },

  onYearChange(e) {
    this.setData({ yearIndex: e.detail.value })
  },

  onDeptChange(e) {
    this.setData({ deptIndex: e.detail.value })
  },

  get canLogin() {
    return this.data.studentId.trim().length > 0 &&
      this.data.nickname.trim().length > 0 &&
      this.data.realName.trim().length > 0 &&
      this.data.yearIndex >= 0 &&
      this.data.deptIndex >= 0
  },

  // ===== 校友认证登录 =====
  async onLogin() {
    if (!this.canLogin) {
      showError('请填写完整信息')
      return
    }

    this.setData({ isLoading: true })
    showLoading('认证中...')

    try {
      const params = {
        studentId: this.data.studentId.trim(),
        nickname: this.data.nickname.trim(),
        realName: this.data.realName.trim(),
        year: this.data.years[this.data.yearIndex],
        department: this.data.departments[this.data.deptIndex],
        fromWechat: false
      }

      const res = await API.login(params)
      if (res.code === 0) {
        app.login(res.data.userInfo)
        showSuccess('认证成功')
        setTimeout(() => {
          this.goToIndex()
        }, 1000)
      } else {
        showError(res.message || '登录失败')
      }
    } catch (err) {
      showError('网络异常，请稍后重试')
      console.error('Login error:', err)
    } finally {
      this.setData({ isLoading: false })
      hideLoading()
    }
  }
})
