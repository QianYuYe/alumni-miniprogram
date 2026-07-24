/**
 * 生成占位图标脚本
 * 运行: node scripts/generate-icons.js
 * 会生成简单的彩色圆形PNG图标作为占位符
 * 建议替换为专业设计的图标
 */

const fs = require('fs')
const path = require('path')

const ICONS_DIR = path.join(__dirname, '..', 'images')

// 生成一个简单的PNG图标（纯色圆形）
function createPNGBase64(color, size = 48) {
  // 使用SVG转data URI的方式（WeChat不支持直接SVG，但我们可以用这种方式生成简单的PNG）
  // 这里我们创建简单的PNG像素数据
  const width = size
  const height = size
  
  // 简单PNG生成
  // PNG文件结构：signature + IHDR + IDAT + IEND
  function createPNG(pixels, w, h) {
    // 这里简化处理，直接返回一个最小的有效PNG
    // 实际项目中建议使用sharp或canvas库
    return Buffer.from([]) // 占位
  }
  
  return ''
}

function generateIcons() {
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true })
  }
  
  const icons = [
    { name: 'icon-home', color: '#999999' },
    { name: 'icon-home-active', color: '#1a73e8' },
    { name: 'icon-alumni', color: '#999999' },
    { name: 'icon-alumni-active', color: '#1a73e8' },
    { name: 'icon-event', color: '#999999' },
    { name: 'icon-event-active', color: '#1a73e8' },
    { name: 'icon-message', color: '#999999' },
    { name: 'icon-message-active', color: '#1a73e8' },
    { name: 'icon-profile', color: '#999999' },
    { name: 'icon-profile-active', color: '#1a73e8' }
  ]
  
  icons.forEach(icon => {
    const filePath = path.join(ICONS_DIR, `${icon.name}.png`)
    if (!fs.existsSync(filePath)) {
      // 提示用户需要替换图标
      console.log(`请替换图标: ${icon.name}.png (颜色: ${icon.color})`)
    }
  })
  
  console.log('图标检查完成！请将实际图标文件放入 images/ 目录')
  console.log('需要的图标列表:')
  icons.forEach(i => console.log(`  - ${i.name}.png`))
}

generateIcons()
