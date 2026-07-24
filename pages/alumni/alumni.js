const API = require('../../utils/api')
const CONFIG = require('../../utils/config')
const { showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    keyword: '',
    selectedDept: '',
    selectedYear: '',
    selectedTag: '',
    alumniList: [],
    page: 1,
    hasMore: true,
    total: 0,
    isLoading: false,
    departments: CONFIG.DEPARTMENTS,
    years: CONFIG.ENROLLMENT_YEARS,
    tags: CONFIG.ALUMNI_TAGS
  },

  onLoad() {
    this.loadAlumni(true)
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.setData({ page: this.data.page + 1 })
      this.loadAlumni(false)
    }
  },

  async loadAlumni(isRefresh) {
    if (this.data.isLoading) return
    this.setData({ isLoading: true })

    try {
      const params = {
        page: this.data.page,
        keyword: this.data.keyword,
        department: this.data.selectedDept === '全部学院' ? '' : this.data.selectedDept,
        year: this.data.selectedYear ? parseInt(this.data.selectedYear) : '',
        tag: this.data.selectedTag === '全部标签' ? '' : this.data.selectedTag
      }

      const res = await API.getAlumniList(params)
      if (res.code === 0) {
        this.setData({
          alumniList: isRefresh ? res.data.list : [...this.data.alumniList, ...res.data.list],
          hasMore: res.data.hasMore,
          total: res.data.total
        })
      }
    } catch (err) {
      console.error('Load alumni error:', err)
    } finally {
      this.setData({ isLoading: false })
    }
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  onSearch() {
    this.setData({ page: 1, hasMore: true })
    this.loadAlumni(true)
  },

  clearSearch() {
    this.setData({ keyword: '', page: 1, hasMore: true })
    this.loadAlumni(true)
  },

  showDeptFilter() {
    this.showPicker('选择学院', this.data.departments, (value) => {
      this.setData({
        selectedDept: value,
        page: 1,
        hasMore: true
      })
      this.loadAlumni(true)
    })
  },

  showYearFilter() {
    const yearLabels = this.data.years.map(y => y + '级')
    this.showPicker('选择年级', yearLabels, (value) => {
      this.setData({
        selectedYear: value,
        page: 1,
        hasMore: true
      })
      this.loadAlumni(true)
    })
  },

  showTagFilter() {
    this.showPicker('选择标签', ['全部标签', ...this.data.tags], (value) => {
      this.setData({
        selectedTag: value,
        page: 1,
        hasMore: true
      })
      this.loadAlumni(true)
    })
  },

  showPicker(title, items, callback) {
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        if (res.tapIndex >= 0) {
          callback(items[res.tapIndex])
        }
      }
    })
  }
})
