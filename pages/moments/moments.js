const API = require('../../utils/api')
const { showSuccess, showError, showLoading, hideLoading, generateId } = require('../../utils/util')

const app = getApp()

Page({
  data: {
    action: 'publish',
    userInfo: null,
    content: '',
    images: [],
    location: '',
    selectedTags: [],
    availableTags: ['母校情怀', '校园回忆', '求助咨询', '校友活动',
      '技术分享', '健康生活', '文化艺术', '其他'],
    canPublish: false
  },

  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      action: options.action || 'publish'
    })
  },

  onContentInput(e) {
    const val = e.detail.value
    this.setData({
      content: val,
      canPublish: val.length > 0
    })
  },

  async chooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 9 - this.data.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      this.setData({
        images: [...this.data.images, ...res.tempFilePaths]
      })
    } catch (err) {
      console.error('Choose image error:', err)
    }
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset
    const images = this.data.images.filter((_, i) => i !== index)
    this.setData({ images })
  },

  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ location: res.name || res.address })
      },
      fail: () => {
        // 用户取消
      }
    })
  },

  clearLocation() {
    this.setData({ location: '' })
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag
    const tags = this.data.selectedTags
    if (tags.includes(tag)) {
      this.setData({ selectedTags: tags.filter(t => t !== tag) })
    } else {
      this.setData({ selectedTags: [...tags, tag] })
    }
  },

  async onPublish() {
    if (!this.data.canPublish) {
      showError('请输入内容')
      return
    }

    showLoading('发布中...')

    try {
      const momentData = {
        userId: app.globalData.userInfo?.id || 'u001',
        userName: app.globalData.userInfo?.name || '校友',
        userAvatar: app.globalData.userInfo?.avatar || '',
        isVerified: app.globalData.userInfo?.isVerified || false,
        content: this.data.content,
        images: this.data.images,
        location: this.data.location,
        tags: this.data.selectedTags,
        userTags: app.globalData.userInfo?.tags || []
      }

      const res = await API.createMoment(momentData)
      if (res.code === 0) {
        showSuccess('发布成功')
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      } else {
        showError(res.message || '发布失败')
      }
    } catch (err) {
      showError('网络异常')
      console.error('Publish error:', err)
    } finally {
      hideLoading()
    }
  }
})
