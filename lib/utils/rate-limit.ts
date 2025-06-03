// 简单的内存缓存，生产环境应使用Redis等分布式缓存
const cache = new Map<string, { count: number; timestamp: number }>()

type RateLimitResult = {
  allowed: boolean
  current: number
  limit: number
  remaining: number
  reset: number
}

/**
 * 实现请求频率限制
 * @param key 限制的键（通常是IP地址）
 * @param limit 时间窗口内允许的最大请求数
 * @param window 时间窗口（秒）
 */
export async function rateLimit(key: string, limit: number, window: number): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - window

  // 清理过期记录
  for (const [cacheKey, data] of cache.entries()) {
    if (data.timestamp < windowStart) {
      cache.delete(cacheKey)
    }
  }

  // 获取当前记录
  const current = cache.get(key) || { count: 0, timestamp: now }

  // 如果记录已过期，重置计数
  if (current.timestamp < windowStart) {
    current.count = 0
    current.timestamp = now
  }

  // 增加计数
  current.count++
  cache.set(key, current)

  // 计算剩余请求数和重置时间
  const remaining = Math.max(0, limit - current.count)
  const reset = current.timestamp + window

  return {
    allowed: current.count <= limit,
    current: current.count,
    limit,
    remaining,
    reset,
  }
}
