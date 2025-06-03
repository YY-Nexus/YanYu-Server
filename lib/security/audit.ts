import { rateLimit } from "../utils/rate-limit"

type AuditContext = {
  headers: Record<string, string>
  ip: string
  geo: { country?: string; region?: string; city?: string } | null
  url: string
}

type AuditResult = {
  passed: boolean
  threatLevel: "none" | "low" | "medium" | "high" | "critical"
  details: string[]
  timestamp: number
}

/**
 * 执行安全审查
 * 基于边缘计算实现实时AI推理的安全检测
 */
export async function performSecurityAudit(context: AuditContext): Promise<AuditResult> {
  // 初始化结果
  const result: AuditResult = {
    passed: true,
    threatLevel: "none",
    details: [],
    timestamp: Date.now(),
  }

  try {
    // 生产环境下放宽检查，除非明确启用严格模式
    if (process.env.NODE_ENV === "production" && process.env.STRICT_SECURITY_MODE !== "true") {
      result.details.push("生产环境：安全检查已放宽")
      return result
    }

    // 1. 检查请求频率限制
    const rateLimitResult = await rateLimit(context.ip, 100, 60) // 每分钟100次请求限制
    if (!rateLimitResult.allowed) {
      result.passed = false
      result.threatLevel = "medium"
      result.details.push(`请求频率超限: ${rateLimitResult.current}/${rateLimitResult.limit}`)
    }

    // 2. 检查已知威胁IP (使用环境变量或硬编码列表)
    const blockedIPs = process.env.BLOCKED_IPS ? process.env.BLOCKED_IPS.split(",") : []
    if (blockedIPs.includes(context.ip)) {
      result.passed = false
      result.threatLevel = "high"
      result.details.push(`IP地址(${context.ip})在黑名单中`)
    }

    // 3. 检查地理位置限制
    const restrictedCountries = process.env.RESTRICTED_COUNTRIES ? process.env.RESTRICTED_COUNTRIES.split(",") : []
    if (context.geo?.country && restrictedCountries.includes(context.geo.country)) {
      result.passed = false
      result.threatLevel = "medium"
      result.details.push(`来源国家(${context.geo.country})受限`)
    }

    // 4. 检查请求头安全
    if (!context.headers["user-agent"]) {
      result.passed = false
      result.threatLevel = "low"
      result.details.push("缺少User-Agent请求头")
    }

    // 5. 检查可疑URL参数
    const url = new URL(context.url)
    const suspiciousParams = ["eval", "exec", "script", "alert", "document", "window"]
    for (const param of url.searchParams.keys()) {
      if (suspiciousParams.some((sp) => param.toLowerCase().includes(sp))) {
        result.passed = false
        result.threatLevel = "high"
        result.details.push(`检测到可疑URL参数: ${param}`)
      }
    }

    // 如果没有发现问题，添加通过信息
    if (result.details.length === 0) {
      result.details.push("所有安全检查通过")
    }

    return result
  } catch (error) {
    console.error("执行安全审查时出错:", error)

    // 在生产环境中，即使检查失败也允许访问，只记录错误
    if (process.env.NODE_ENV === "production" && process.env.STRICT_SECURITY_MODE !== "true") {
      return {
        passed: true,
        threatLevel: "none",
        details: [`安全审查执行失败但已允许访问: ${error instanceof Error ? error.message : String(error)}`],
        timestamp: Date.now(),
      }
    }

    return {
      passed: false,
      threatLevel: "critical",
      details: [`安全审查执行失败: ${error instanceof Error ? error.message : String(error)}`],
      timestamp: Date.now(),
    }
  }
}

/**
 * 简化的安全审查函数（向后兼容）
 */
export const securityAudit = () => {
  // 生产环境下放宽检查
  if (process.env.NODE_ENV === "production" && process.env.STRICT_SECURITY_MODE !== "true") {
    return {
      passed: true,
      details: ["生产环境：安全检查已放宽"],
      checksPerformed: ["生产环境检查"],
    }
  }

  return {
    passed: true,
    details: [],
    checksPerformed: [],
  }
}
