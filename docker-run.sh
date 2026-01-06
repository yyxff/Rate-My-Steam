#!/bin/bash

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

IMAGE_NAME="rate-my-steam"
CONTAINER_NAME="rate-my-steam-app"
PORT=3000

echo -e "${BLUE}🐳 Rate My Steam - Docker 启动脚本${NC}"
echo ""

# 检查镜像是否存在
if ! docker images | grep -q "^$IMAGE_NAME "; then
    echo -e "${RED}❌ 镜像不存在，请先运行构建脚本:${NC}"
    echo -e "${GREEN}   ./docker-build.sh${NC}"
    exit 1
fi

# 检查是否已有运行中的容器
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo -e "${BLUE}停止现有容器...${NC}"
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# 运行容器
echo -e "${BLUE}🚀 启动容器...${NC}"

# 检查是否有 GEMINI_API_KEY 环境变量
if [ -n "$GEMINI_API_KEY" ]; then
    echo -e "${GREEN}使用环境变量中的 GEMINI_API_KEY${NC}"
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:3000 \
        -e GEMINI_API_KEY=$GEMINI_API_KEY \
        -e STEAM_API_KEY=$STEAM_API_KEY \
        --restart unless-stopped \
        $IMAGE_NAME:latest
else
    echo -e "${BLUE}未设置 GEMINI_API_KEY${NC}"
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:3000 \
        --restart unless-stopped \
        $IMAGE_NAME:latest
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 容器启动失败${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 容器启动成功！${NC}"
echo -e "${GREEN}📍 访问地址: http://localhost:$PORT${NC}"
echo ""
echo -e "${BLUE}常用命令:${NC}"
echo -e "  查看日志: ${GREEN}docker logs -f $CONTAINER_NAME${NC}"
echo -e "  停止容器: ${GREEN}docker stop $CONTAINER_NAME${NC}"
echo -e "  删除容器: ${GREEN}docker rm $CONTAINER_NAME${NC}"
echo -e "  进入容器: ${GREEN}docker exec -it $CONTAINER_NAME sh${NC}"
echo ""
