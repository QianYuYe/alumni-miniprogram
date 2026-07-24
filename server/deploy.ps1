# ==========================================
# 校友圈后端 - 阿里云 ECS 一键部署脚本 (PowerShell)
# 用法: .\deploy.ps1 -ServerIP "47.xxx.xxx.xxx"
# ==========================================

param(
    [string]$ServerIP = "47.xxx.xxx.xxx",
    [string]$SSHPort = "22",
    [string]$RemoteUser = "root",
    [string]$RemotePath = "/opt/alumni-server"
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "  校友圈后端 - 一键部署开始" -ForegroundColor Green
Write-Host "  目标: ${RemoteUser}@${ServerIP}:${SSHPort}" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 1. 打包
Write-Host "[1/5] 打包后端代码..." -ForegroundColor Yellow
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
$tarFile = "$env:TEMP\alumni-server.tar.gz"

# 使用 tar 命令（Windows 10 17063+ 自带）
tar -czf $tarFile `
    --exclude=node_modules `
    --exclude=data `
    --exclude=.git `
    . 2>$null

if (-not (Test-Path $tarFile)) {
    Write-Host "❌ 打包失败，请确保已安装 tar 命令" -ForegroundColor Red
    exit 1
}
Write-Host "  打包完成: $tarFile" -ForegroundColor Green

# 2. 上传
Write-Host "[2/5] 上传到服务器..." -ForegroundColor Yellow
scp -P $SSHPort $tarFile "${RemoteUser}@${ServerIP}:/tmp/"
Write-Host "  ✓ 上传完成" -ForegroundColor Green

# 3-5. 远程执行
Write-Host "[3/5] 在服务器上安装依赖..." -ForegroundColor Yellow
ssh -p $SSHPort ${RemoteUser}@${ServerIP} @"
    set -e
    mkdir -p $RemotePath
    rm -rf ${RemotePath}/*
    tar -xzf /tmp/alumni-server.tar.gz -C $RemotePath
    cd $RemotePath
    npm install --production
    echo '✓ 依赖安装完成'
"@

Write-Host "[4/5] 初始化数据库..." -ForegroundColor Yellow
ssh -p $SSHPort ${RemoteUser}@${ServerIP} "cd $RemotePath && node init-db.js"

Write-Host "[5/5] 启动服务..." -ForegroundColor Yellow
ssh -p $SSHPort ${RemoteUser}@${ServerIP} @"
    set -e
    cd $RemotePath
    command -v pm2 &> /dev/null || npm install -g pm2
    pm2 delete alumni-server 2>/dev/null || true
    pm2 start app.js --name alumni-server
    pm2 save
    echo '✓ 服务已启动'
    pm2 status
"@

# 完成
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ 部署完成！" -ForegroundColor Green
Write-Host "  服务地址: http://${ServerIP}:3000" -ForegroundColor Green
Write-Host "  健康检查: http://${ServerIP}:3000/api/health" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Remove-Item $tarFile -Force
