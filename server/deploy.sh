#!/bin/bash
# ==========================================
# 校友圈后端 - 阿里云 ECS 一键部署脚本
# 用法: bash deploy.sh [服务器IP] [SSH端口]
# 示例: bash deploy.sh 47.xxx.xxx.xxx 22
# ==========================================

set -e

# ---- 配置（修改这里）----
SERVER_IP="${1:-47.xxx.xxx.xxx}"        # 阿里云 ECS 公网 IP
SSH_PORT="${2:-22}"                     # SSH 端口
REMOTE_USER="root"                      # SSH 用户名
REMOTE_PATH="/opt/alumni-server"        # 服务器上的部署路径

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  校友圈后端 - 一键部署开始${NC}"
echo -e "${GREEN}  目标: ${REMOTE_USER}@${SERVER_IP}:${SSH_PORT}${NC}"
echo -e "${GREEN}  路径: ${REMOTE_PATH}${NC}"
echo -e "${GREEN}========================================${NC}"

# ---- 1. 本地打包 ----
echo -e "${YELLOW}[1/5] 打包后端代码...${NC}"
cd "$(dirname "$0")"
tar -czf /tmp/alumni-server.tar.gz \
  --exclude=node_modules \
  --exclude=data \
  --exclude=.git \
  ./

# ---- 2. 上传到服务器 ----
echo -e "${YELLOW}[2/5] 上传到服务器...${NC}"
scp -P ${SSH_PORT} /tmp/alumni-server.tar.gz ${REMOTE_USER}@${SERVER_IP}:/tmp/

# ---- 3. 服务器端安装 ----
echo -e "${YELLOW}[3/5] 在服务器上安装依赖...${NC}"
ssh -p ${SSH_PORT} ${REMOTE_USER}@${SERVER_IP} << 'CMDS'
  set -e
  mkdir -p ${REMOTE_PATH}
  rm -rf ${REMOTE_PATH}/*
  tar -xzf /tmp/alumni-server.tar.gz -C ${REMOTE_PATH}
  cd ${REMOTE_PATH}
  npm install --production
  echo "依赖安装完成"
CMDS

# ---- 4. 数据库初始化 ----
echo -e "${YELLOW}[4/5] 初始化数据库...${NC}"
ssh -p ${SSH_PORT} ${REMOTE_USER}@${SERVER_IP} "cd ${REMOTE_PATH} && node init-db.js"

# ---- 5. 启动服务 ----
echo -e "${YELLOW}[5/5] 启动/重启服务...${NC}"
ssh -p ${SSH_PORT} ${REMOTE_USER}@${SERVER_IP} << 'CMDS'
  set -e
  cd ${REMOTE_PATH}
  
  # 安装 PM2（如未安装）
  command -v pm2 &> /dev/null || npm install -g pm2
  
  # 重启应用
  pm2 delete alumni-server 2>/dev/null || true
  pm2 start app.js --name alumni-server
  pm2 save
  pm2 startup 2>/dev/null || true
  
  echo "服务状态:"
  pm2 status
CMDS

# ---- 完成 ----
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo -e "${GREEN}  服务地址: http://${SERVER_IP}:3000${NC}"
echo -e "${GREEN}  健康检查: http://${SERVER_IP}:3000/api/health${NC}"
echo -e "${GREEN}========================================${NC}"

# 清理本地临时文件
rm -f /tmp/alumni-server.tar.gz
