Component({
  properties: {
    event: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      wx.navigateTo({
        url: `/pages/event-detail/event-detail?id=${this.properties.event.id}`
      })
    }
  }
})
