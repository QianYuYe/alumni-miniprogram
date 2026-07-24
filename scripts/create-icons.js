/**
 * 生成占位PNG图标
 * 运行: node scripts/create-icons.js
 * 生成简单的纯色PNG图标用于TabBar
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const ICONS_DIR = path.join(__dirname, '..', 'images')

function createMinimalPNG(color, size = 48) {
  // 解析颜色
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  // 创建简单的圆形图标像素数据（RGBA）
  const center = size / 2
  const radius = size / 2 - 2
  const rawData = Buffer.alloc(size * size * 4)
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center + 0.5
      const dy = y - center + 0.5
      const dist = Math.sqrt(dx * dx + dy * dy)
      const idx = (y * size + x) * 4
      
      if (dist <= radius) {
        // 圆形内部 - 使用指定颜色
        rawData[idx] = r
        rawData[idx + 1] = g
        rawData[idx + 2] = b
        rawData[idx + 3] = 255
      } else if (dist <= radius + 1) {
        // 抗锯齿边缘
        const alpha = Math.max(0, Math.min(255, Math.round((radius + 1 - dist) * 255)))
        rawData[idx] = r
        rawData[idx + 1] = g
        rawData[idx + 2] = b
        rawData[idx + 3] = alpha
      } else {
        // 透明背景
        rawData[idx] = 0
        rawData[idx + 1] = 0
        rawData[idx + 2] = 0
        rawData[idx + 3] = 0
      }
    }
  }

  // 构建PNG文件
  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  
  // IHDR Chunk
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)   // width
  ihdrData.writeUInt32BE(size, 4)   // height
  ihdrData[8] = 8                    // bit depth
  ihdrData[9] = 6                    // color type (RGBA)
  ihdrData[10] = 0                   // compression
  ihdrData[11] = 0                   // filter
  ihdrData[12] = 0                   // interlace
  const ihdr = createChunk('IHDR', ihdrData)

  // IDAT Chunk - 将原始数据转换为PNG行（每个行前加过滤字节0）
  const filteredData = []
  for (let y = 0; y < size; y++) {
    filteredData.push(0) // filter byte (None)
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      filteredData.push(rawData[idx])
      filteredData.push(rawData[idx + 1])
      filteredData.push(rawData[idx + 2])
      filteredData.push(rawData[idx + 3])
    }
  }
  
  const compressed = zlib.deflateSync(Buffer.from(filteredData))
  const idat = createChunk('IDAT', compressed)

  // IEND Chunk
  const iend = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

function createChunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  
  const typeBuffer = Buffer.from(type, 'ascii')
  const crcData = Buffer.concat([typeBuffer, data])
  
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(crcData), 0)
  
  return Buffer.concat([length, typeBuffer, data, crc])
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320
      } else {
        crc = crc >>> 1
      }
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function main() {
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
      try {
        const pngData = createMinimalPNG(icon.color)
        fs.writeFileSync(filePath, pngData)
        console.log(`✓ 已生成: ${icon.name}.png`)
      } catch (err) {
        console.error(`✗ 生成失败 ${icon.name}: ${err.message}`)
      }
    } else {
      console.log(`- 已存在: ${icon.name}.png`)
    }
  })

  console.log('\n所有图标生成完成！')
}

main()
