Component({
  properties: {
    alumni: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      wx.navigateTo({
        url: `/pages/profile/profile?id=${this.properties.alumni.id}`
      })
    },

    onContact() {
      const alumni = this.properties.alumni
      wx.navigateTo({
        url: `/pages/chat/chat?userId=${alumni.id}&userName=${alumni.nickname || alumni.name}`
      })
    }
  }
})
