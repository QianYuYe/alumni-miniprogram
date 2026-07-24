const API = require('../../utils/api')
const { showSuccess, showError, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    eventId: '',
    detail: {},
    isLoading: true
  },

  onLoad(options) {
    this.setData({ eventId: options.id })
    this.loadDetail()
  },

  async loadDetail() {
    showLoading('加载中...')
    try {
      const res = await API.getEventDetail(this.data.eventId)
      if (res.code === 0) {
        this.setData({
          detail: res.data,
          isLoading: false
        })
      }
    } catch (err) {
      console.error('Load event detail error:', err)
      this.setData({ isLoading: false })
    } finally {
      hideLoading()
    }
  },

  async toggleFavorite() {
    try {
      const res = await API.toggleFavorite(this.data.eventId)
      if (res.code === 0) {
        this.setData({
          'detail.isFavorited': res.data.isFavorited
        })
        showSuccess(res.data.isFavorited ? '已收藏' : '已取消收藏')
      }
    } catch (err) {
      console.error('Toggle favorite error:', err)
    }
  },

  async joinEvent() {
    showLoading('报名中...')
    try {
      const res = await API.joinEvent(this.data.eventId)
      if (res.code === 0) {
        showSuccess('报名成功')
        this.setData({
          'detail.participants': this.data.detail.participants + 1
        })
      }
    } catch (err) {
      showError('报名失败')
      console.error('Join event error:', err)
    } finally {
      hideLoading()
    }
  }
})
