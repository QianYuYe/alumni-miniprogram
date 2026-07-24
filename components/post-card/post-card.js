const { formatTime } = require('../../utils/util')

Component({
  properties: {
    moment: {
      type: Object,
      value: {}
    }
  },

  data: {
    formattedTime: '',
    imageGridClass: 'one'
  },

  observers: {
    'moment': function (moment) {
      if (moment && moment.createTime) {
        const time = formatTime(moment.createTime)
        let gridClass = 'one'
        if (moment.images && moment.images.length > 0) {
          if (moment.images.length === 1) gridClass = 'one'
          else if (moment.images.length === 2) gridClass = 'two'
          else if (moment.images.length === 3) gridClass = 'three'
          else if (moment.images.length === 4) gridClass = 'four'
          else gridClass = 'more'
        }
        this.setData({
          formattedTime: time,
          imageGridClass: gridClass
        })
      }
    }
  },

  methods: {
    onTapCard() {
      this.triggerEvent('tapcard', this.properties.moment.id)
    },

    onLike() {
      this.triggerEvent('like', this.properties.moment.id)
    },

    onComment() {
      this.triggerEvent('comment', this.properties.moment.id)
    },

    onShare() {
      this.triggerEvent('share', this.properties.moment)
    },

    previewImage(e) {
      const { index } = e.currentTarget.dataset
      const urls = this.properties.moment.images
      wx.previewImage({
        current: urls[index],
        urls
      })
    }
  }
})
