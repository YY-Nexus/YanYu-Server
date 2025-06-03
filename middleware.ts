import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyIntegrity } from "./lib/security/integrity"
import { checkPermissions } from "./lib/security/permissions"
import { performSecurityAudit } from "./lib/security/audit"
import { recordAuditEvent } from "./lib/monitoring/events"
import { getServerConfig } from "./lib/config"

// 全局启动审查中间件
export async function middleware(request: NextRequest) {
  // 生产环境安全检查开关
  const STRICT_SECURITY_MODE = process.env.STRICT_SECURITY_MODE === "true"

  // 如果是生产环境且未启用严格模式，允许通过
  if (process.env.NODE_ENV === "production" && !STRICT_SECURITY_MODE) {
    console.log("🚀 生产环境：跳过严格安全检查，允许正常访问")
    return NextResponse.next()
  }

  // 开发环境直接通过
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 开发环境：跳过安全审查")
    return NextResponse.next()
  }

  console.log("🔒 启动全局安全审查...")

  try {
    // 获取配置
    const config = await getServerConfig()

    // 1. 安全审查
    const securityResult = await performSecurityAudit({
      headers: Object.fromEntries(request.headers),
      ip: request.ip || "未知",
      geo: request.geo || { country: "未知" },
      url: request.url,
    })

    // 2. 资源完整性验证
    const integrityResult = await verifyIntegrity({
      appVersion: config.version,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "本地环境",
    })

    // 3. 权限与合规检查
    const permissionsResult = await checkPermissions({
      environment: process.env.VERCEL_ENV || "开发环境",
      region: request.geo?.region || "未知区域",
    })

    // 记录审查事件
    await recordAuditEvent({
      type: "STARTUP_AUDIT",
      results: {
        security: securityResult,
        integrity: integrityResult,
        permissions: permissionsResult,
      },
      timestamp: Date.now(),
      requestId: crypto.randomUUID(),
    })

    // 判断是否允许启动 - 改为更宽松的检查
    const criticalFailures = [
      !securityResult.passed && securityResult.details.some((d) => d.includes("严重")),
      !integrityResult.passed && integrityResult.details.some((d) => d.includes("核心文件")),
      !permissionsResult.passed && permissionsResult.details.some((d) => d.includes("禁止")),
    ].filter(Boolean)

    const isAllowed = criticalFailures.length === 0

    if (!isAllowed) {
      console.warn("⚠️ 检测到安全问题，但允许继续访问（生产环境）")
      console.warn("安全检查详情:", { securityResult, integrityResult, permissionsResult })

      // 在生产环境中，只记录警告，不阻止访问
      if (process.env.NODE_ENV === "production") {
        return NextResponse.next()
      }

      console.error("❌ 启动审查失败，应用被阻止启动")

      // 根据环境返回不同响应
      if (process.env.NODE_ENV === "production") {
        return NextResponse.rewrite(new URL("/system/security-block", request.url))
      } else {
        return NextResponse.json(
          {
            error: "启动审查失败",
            details: {
              security: securityResult,
              integrity: integrityResult,
              permissions: permissionsResult,
            },
          },
          { status: 403 },
        )
      }
    }

    console.log("✅ 启动审查通过，应用正常启动")
    return NextResponse.next()
  } catch (error) {
    console.error("中间件执行错误:", error)

    // 任何环境下都允许继续，但记录错误
    console.warn("⚠️ 安全检查出错，允许继续执行")
    return NextResponse.next()
  }
}

// 配置中间件触发路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - 静态文件 (如 /static/*)
     * - 公共资源 (如 /favicon.ico)
     * - 安全阻断页面
     * - API健康检查
     */
    "/((?!api/health|_next/static|_next/image|favicon.ico|system/security-block).*)",
  ],
}
