const API = require('../../utils/api')
const { formatTime, showSuccess, showError } = require('../../utils/util')

const app = getApp()

Page({
  data: {
    momentId: '',
    detail: {},
    isLoading: true,
    commentText: '',
    formattedTime: '',
    showEmoji: false,
    canSend: false,
    emojis: ['😊','😂','🤣','❤️','👍','🎉','🔥','😍','🥰','😘','💪','🤗','😎','🤔','😅','🙏','💕','✨','⭐','🌈','🎈','🎊','😄','😆','🥳','😁','🤩']
  },

  onLoad(options) {
    this.setData({ momentId: options.id })
    // 新用户检测（从分享链接进入时）
    app.checkNewUser()
    this.loadDetail()
  },

  async loadDetail() {
    try {
      const res = await API.getMomentDetail(this.data.momentId)
      if (res.code === 0) {
        const detail = res.data
        // 格式化评论时间
        if (detail.comments && detail.comments.length > 0) {
          detail.comments = detail.comments.map(c => ({
            ...c,
            formattedTime: formatTime(c.createTime, true)
          }))
        }
        this.setData({
          detail,
          formattedTime: formatTime(detail.createTime, true),
          isLoading: false
        })
      }
    } catch (err) {
      console.error('Load detail error:', err)
      this.setData({ isLoading: false })
    }
  },

  onCommentInput(e) {
    const val = e.detail.value
    this.setData({
      commentText: val,
      canSend: val.length > 0
    })
  },

  sendComment() {
    if (!this.data.canSend) return
    showSuccess('评论成功')
    this.setData({ commentText: '', canSend: false })
  },

  // 选择评论图片
  chooseCommentImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        showSuccess('图片已选择')
      }
    })
  },

  // 切换表情面板
  toggleEmoji() {
    this.setData({ showEmoji: !this.data.showEmoji })
  },

  // 选择表情
  selectEmoji(e) {
    const emoji = e.currentTarget.dataset.emoji
    this.setData({
      commentText: this.data.commentText + emoji,
      canSend: true
    })
  },

  previewImage(e) {
    const { index } = e.currentTarget.dataset
    const urls = this.data.detail.images
    wx.previewImage({
      current: urls[index],
      urls
    })
  },

  goToUserProfile() {
    wx.showToast({
      title: '查看用户主页',
      icon: 'none'
    })
  },

  // 分享动态
  onShareAppMessage() {
    const detail = this.data.detail
    return {
      title: detail.content ? (detail.content.length > 30 ? detail.content.slice(0, 30) + '...' : detail.content) : '校友圈动态分享',
      path: `/pages/post-detail/post-detail?id=${this.data.momentId}`,
      imageUrl: detail.images?.[0] || ''
    }
  }
})
