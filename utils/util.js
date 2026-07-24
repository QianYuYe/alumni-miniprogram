// 工具函数

/**
 * 格式化时间
 * @param {string|number} dateStr 时间戳或日期字符串
 * @param {boolean} showTime 是否显示时分
 * @returns {string}
 */
function formatTime(dateStr, showTime = false) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = Date.now()
  const diff = now - date.getTime()
  
  // 1分钟内
  if (diff < 60000) {
    return '刚刚'
  }
  // 1小时内
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  }
  // 今天内
  if (diff < 86400000 && date.getDate() === new Date(now).getDate()) {
    return `今天 ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  // 昨天
  const yesterday = new Date(now - 86400000)
  if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
    return `昨天 ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  // 今年内
  if (date.getFullYear() === new Date(now).getFullYear()) {
    return `${pad(date.getMonth() + 1)}月${pad(date.getDate())}日` +
      (showTime ? ` ${pad(date.getHours())}:${pad(date.getMinutes())}` : '')
  }
  // 更早
  return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日`
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

/**
 * 显示成功提示
 */
function showSuccess(msg) {
  wx.showToast({
    title: msg || '操作成功',
    icon: 'success',
    duration: 2000
  })
}

/**
 * 显示错误提示
 */
function showError(msg) {
  wx.showToast({
    title: msg || '操作失败',
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示加载中
 */
function showLoading(msg) {
  wx.showLoading({
    title: msg || '加载中...',
    mask: true
  })
}

/**
 * 隐藏加载
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 防抖
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流
 */
function throttle(fn, delay = 300) {
  let canRun = true
  return function (...args) {
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      fn.apply(this, args)
      canRun = true
    }, delay)
  }
}

/**
 * 获取随机颜色
 */
function getRandomColor() {
  const colors = ['#1a73e8', '#34a853', '#f9ab00', '#ea4335', '#ab47bc',
    '#00bcd4', '#ff7043', '#9ccc65', '#f06292', '#7e57c2']
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 生成模拟ID
 */
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
}

module.exports = {
  formatTime,
  showSuccess,
  showError,
  showLoading,
  hideLoading,
  debounce,
  throttle,
  getRandomColor,
  generateId
}
