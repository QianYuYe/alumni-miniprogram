const API = require('../../utils/api')
const { showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    currentTab: 'upcoming',
    events: [],
    isLoading: false
  },

  onLoad() {
    this.loadEvents()
  },

  onShow() {
    this.loadEvents()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.loadEvents()
  },

  async loadEvents() {
    this.setData({ isLoading: true })

    try {
      const res = await API.getEvents({ status: this.data.currentTab })
      if (res.code === 0) {
        // 为每个活动添加参与者头像列表
        const events = res.data.list.map(e => ({
          ...e,
          participantList: [
            'https://picsum.photos/seed/p1/100/100',
            'https://picsum.photos/seed/p2/100/100',
            'https://picsum.photos/seed/p3/100/100',
            'https://picsum.photos/seed/p4/100/100'
          ]
        }))
        this.setData({ events })
      }
    } catch (err) {
      console.error('Load events error:', err)
    } finally {
      this.setData({ isLoading: false })
    }
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/event-detail/event-detail?id=${id}`
    })
  }
})
