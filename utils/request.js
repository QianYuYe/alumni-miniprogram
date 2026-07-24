/**
 * HTTP 请求封装
 * 对接阿里云服务器的统一网络请求层
 */

const CONFIG = require('./config')

// 是否开启请求日志
const DEBUG = true

/**
 * 基础请求方法
 */
function request(url, options = {}) {
  const { method = 'GET', data = {}, header = {} } = options

  // 合并默认请求头
  const headers = {
    'Content-Type': 'application/json',
    ...header
  }

  // 自动带 token
  const app = getApp()
  if (app && app.globalData && app.globalData.token) {
    headers['Authorization'] = 'Bearer ' + app.globalData.token
  }

  const requestUrl = url.startsWith('http') ? url : CONFIG.API_BASE_URL + url

  if (DEBUG) {
    console.log(`[Request] ${method} ${requestUrl}`, data)
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      method,
      data,
      header: headers,
      timeout: CONFIG.REQUEST_TIMEOUT || 10000,
      success(res) {
        if (DEBUG) {
          console.log(`[Response] ${method} ${requestUrl}`, res.data)
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // Token 过期，跳转登录
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.reLaunch({ url: '/pages/login/login' })
          reject(new Error('登录已过期'))
        } else {
          reject(new Error(res.data?.message || `请求失败(${res.statusCode})`))
        }
      },
      fail(err) {
        console.error('[Request Error]', err)
        reject(new Error('网络异常，请检查网络连接'))
      }
    })
  })
}

/**
 * 便捷方法
 */
const http = {
  get(url, data, header) {
    return request(url, { method: 'GET', data, header })
  },
  post(url, data, header) {
    return request(url, { method: 'POST', data, header })
  },
  put(url, data, header) {
    return request(url, { method: 'PUT', data, header })
  },
  delete(url, data, header) {
    return request(url, { method: 'DELETE', data, header })
  },
  upload(url, filePath, name = 'file', formData = {}) {
    const app = getApp()
    const header = {}
    if (app && app.globalData && app.globalData.token) {
      header['Authorization'] = 'Bearer ' + app.globalData.token
    }
    const requestUrl = url.startsWith('http') ? url : CONFIG.API_BASE_URL + url
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: requestUrl,
        filePath,
        name,
        formData,
        header,
        success(res) {
          try {
            resolve(JSON.parse(res.data))
          } catch {
            resolve(res.data)
          }
        },
        fail(err) {
          reject(new Error('上传失败'))
        }
      })
    })
  }
}

module.exports = http
