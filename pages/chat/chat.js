const app = getApp()

Page({
  data: {
    userId: '',
    userName: '',
    messages: [],
    inputText: '',
    showEmoji: false,
    canSend: false,
    emojis: ['😊','😂','🤣','❤️','👍','🎉','🔥','😍','🥰','😘','💪','🤗','😎','🤔','😅','🙏','💕','✨','⭐','🌈','🎈','🎊','😄','😆','🥳','😁','🤩']
  },

  onLoad(options) {
    this.setData({
      userId: options.userId || '',
      userName: options.userName || '校友'
    })
    wx.setNavigationBarTitle({
      title: '与 ' + this.data.userName + ' 私信'
    })
    this.loadMessages()
  },

  loadMessages() {
    // 模拟历史消息
    const mockMessages = [
      {
        id: 'chat_001',
        from: this.data.userId,
        content: '你好！很高兴认识你～',
        time: Date.now() - 3600000,
        isSelf: false
      }
    ]
    this.setData({ messages: mockMessages })
  },

  onInput(e) {
    const val = e.detail.value
    this.setData({
      inputText: val,
      canSend: val.length > 0
    })
  },

  sendMessage() {
    const text = this.data.inputText.trim()
    if (!text) return
    if (!text) return

    const newMsg = {
      id: 'chat_' + Date.now(),
      from: 'self',
      content: text,
      time: Date.now(),
      isSelf: true
    }

    this.setData({
      messages: [...this.data.messages, newMsg],
      inputText: '',
      canSend: false
    })

    // 模拟对方回复
    setTimeout(() => {
      const reply = {
        id: 'chat_' + Date.now() + 1,
        from: this.data.userId,
        content: '收到！谢谢你的消息😊',
        time: Date.now(),
        isSelf: false
      }
      this.setData({
        messages: [...this.data.messages, reply]
      })
    }, 1500)
  },

  // 选择聊天图片
  chooseChatImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const msg = {
          id: 'chat_' + Date.now(),
          from: 'self',
          content: '[图片]',
          time: Date.now(),
          isSelf: true,
          isImage: true,
          imageUrl: res.tempFilePaths[0]
        }
        this.setData({
          messages: [...this.data.messages, msg]
        })
      }
    })
  },

  // 切换表情
  toggleEmoji() {
    this.setData({ showEmoji: !this.data.showEmoji })
  },

  // 选择表情
  selectEmoji(e) {
    const emoji = e.currentTarget.dataset.emoji
    this.setData({
      inputText: this.data.inputText + emoji,
      canSend: true
    })
  },

  formatChatTime(time) {
    const date = new Date(time)
    const now = new Date()
    const pad = n => n < 10 ? '0' + n : '' + n
    if (date.toDateString() === now.toDateString()) {
      return pad(date.getHours()) + ':' + pad(date.getMinutes())
    }
    return pad(date.getMonth() + 1) + '/' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes())
  }
})
