/**
 * 全局速率限制中间件
 * 限制整个应用的 API 调用频率（不区分 IP）
 */

// 全局请求计数器
let requestCount = 0
let resetTime = Date.now() + 60000 // 1分钟后重置

const MAX_REQUESTS = 40 // 每分钟最多 40 次请求
const WINDOW_MS = 60000 // 时间窗口：1分钟

export default defineEventHandler((event) => {
  const path = event.path
  
  // 只对 /api 路径进行限流
  if (!path.startsWith('/api')) {
    return
  }
  
  const now = Date.now()
  
  // 如果时间窗口已过，重置计数
  if (now > resetTime) {
    requestCount = 0
    resetTime = now + WINDOW_MS
  }
  
  // 增加请求计数
  requestCount++
  
  // 设置响应头
  setHeader(event, 'X-RateLimit-Limit', MAX_REQUESTS.toString())
  setHeader(event, 'X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - requestCount).toString())
  setHeader(event, 'X-RateLimit-Reset', resetTime.toString())
  
  // 检查是否超过限制
  if (requestCount > MAX_REQUESTS) {
    const retryAfter = Math.ceil((resetTime - now) / 1000)
    setHeader(event, 'Retry-After', retryAfter)
    
    throw createError({
      statusCode: 429,
      statusMessage: `Too many requests. Please retry after ${retryAfter} seconds`
    })
  }
})
