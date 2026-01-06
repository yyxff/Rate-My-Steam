#!/bin/bash

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

IMAGE_NAME="rate-my-steam"
VERSION=${1:-latest}

echo -e "${BLUE}🔨 Rate My Steam - Docker 镜像构建脚本${NC}"
echo ""

# 显示构建信息
echo -e "${BLUE}镜像名称:${NC} $IMAGE_NAME"
echo -e "${BLUE}版本标签:${NC} $VERSION"
echo ""

# 询问是否使用缓存
read -p "是否使用构建缓存？(y/n, 默认 y): " USE_CACHE
USE_CACHE=${USE_CACHE:-y}

if [[ $USE_CACHE == "n" || $USE_CACHE == "N" ]]; then
    echo -e "${YELLOW}⚠️  将不使用缓存构建，这可能需要较长时间...${NC}"
    BUILD_ARGS="--no-cache"
else
    echo -e "${GREEN}✓ 使用缓存构建${NC}"
    BUILD_ARGS=""
fi

echo ""
echo -e "${BLUE}📦 开始构建镜像...${NC}"
echo ""

# 构建镜像
docker build $BUILD_ARGS -t $IMAGE_NAME:$VERSION .

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ 镜像构建失败${NC}"
    exit 1
fi

# 如果不是 latest 标签，同时打上 latest 标签
if [ "$VERSION" != "latest" ]; then
    echo ""
    echo -e "${BLUE}🏷️  同时标记为 latest...${NC}"
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:latest
fi

echo ""
echo -e "${GREEN}✅ 镜像构建成功！${NC}"
echo ""

# 显示镜像信息
echo -e "${BLUE}📊 镜像信息:${NC}"
docker images | grep $IMAGE_NAME | head -n 2

echo ""
echo -e "${GREEN}可用标签:${NC}"
docker images $IMAGE_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

echo ""
echo -e "${BLUE}后续操作:${NC}"
echo -e "  运行容器: ${GREEN}./docker-run.sh${NC}"
echo -e "  推送到 Docker Hub: ${GREEN}docker push <username>/$IMAGE_NAME:$VERSION${NC}"
echo -e "  导出镜像: ${GREEN}docker save -o $IMAGE_NAME-$VERSION.tar $IMAGE_NAME:$VERSION${NC}"
echo -e "  删除镜像: ${GREEN}docker rmi $IMAGE_NAME:$VERSION${NC}"
echo ""
