#!/bin/bash

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}� 启动生产环境 HTTPS 服务${NC}"
echo ""

# 检查环境变量
if [ -z "$GEMINI_API_KEY" ] || [ -z "$STEAM_API_KEY" ]; then
    echo -e "${RED}❌ 请先设置 API Key 环境变量:${NC}"
    echo -e "${GREEN}   export GEMINI_API_KEY=your-key${NC}"
    echo -e "${GREEN}   export STEAM_API_KEY=your-key${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  部署前检查清单：${NC}"
echo -e "  1. 已在 Caddyfile 中将 ${YELLOW}your-domain.com${NC} 替换为真实域名？"
echo -e "  2. 域名 DNS A 记录已指向本服务器 IP？"
echo -e "  3. 服务器防火墙已开放 ${YELLOW}80${NC} 和 ${YELLOW}443${NC} 端口？"
echo ""
read -p "确认继续部署？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# 检查镜像是否存在
if ! docker images | grep -q "^rate-my-steam "; then
    echo -e "${YELLOW}⚠️  镜像不存在，正在构建...${NC}"
    ./docker-build.sh
fi

# 启动服务
echo -e "${BLUE}🚀 启动容器...${NC}"
docker compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 启动失败${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 生产环境启动成功！${NC}"
echo ""
echo -e "${YELLOW}⏳ Caddy 正在自动获取 SSL 证书（30-60秒）...${NC}"
echo ""
echo -e "${BLUE}Caddy 会自动完成：${NC}"
echo -e "  ✓ 从 Let's Encrypt 获取免费 SSL 证书"
echo -e "  ✓ HTTP 自动重定向到 HTTPS"
echo -e "  ✓ 证书到期前自动续期（每 60 天）"
echo ""
echo -e "${BLUE}常用命令:${NC}"
echo -e "  查看应用日志: ${GREEN}docker compose logs -f app${NC}"
echo -e "  查看 Caddy 日志: ${GREEN}docker compose logs -f caddy${NC}"
echo -e "  查看证书状态: ${GREEN}docker exec \$(docker ps -qf name=caddy) caddy list-certificates${NC}"
echo -e "  停止服务: ${GREEN}docker compose down${NC}"
echo -e "  重启服务: ${GREEN}docker compose restart${NC}"
echo ""
