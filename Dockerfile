# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine AS base

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制所有项目文件
COPY . .

# 构建 Nuxt 应用
RUN npm run build

# 生产环境镜像
FROM node:20-alpine AS production

WORKDIR /app

# 只复制必要的文件
COPY --from=base /app/.output /app/.output
COPY --from=base /app/package*.json ./

# 设置环境变量
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]
