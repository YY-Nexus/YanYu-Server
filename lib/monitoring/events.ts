type AuditEvent = {
  type: string
  results: Record<string, any>
  timestamp: number
  requestId: string
}

/**
 * 记录审计事件
 * 支持全链路监控
 */
export async function recordAuditEvent(event: AuditEvent): Promise<void> {
  try {
    // 1. 控制台日志记录
    console.log(`[审计事件] ${event.type} - ${event.requestId}`, {
      timestamp: new Date(event.timestamp).toISOString(),
      results: event.results,
    })

    // 2. 如果在生产环境，发送到监控系统
    if (process.env.NODE_ENV === "production") {
      // 发送到Vercel Analytics或自定义监控端点
      const analyticsEndpoint = process.env.MONITORING_ENDPOINT || "https://api.example.com/events"

      await fetch(analyticsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.MONITORING_API_KEY || "",
        },
        body: JSON.stringify({
          ...event,
          source: "next-app",
          environment: process.env.VERCEL_ENV || "development",
          region: process.env.VERCEL_REGION || "unknown",
          deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "local",
        }),
      })
    }

    // 3. 如果配置了实时告警且有失败结果
    const hasFailures = Object.values(event.results).some(
      (result) => result && typeof result === "object" && result.passed === false,
    )

    if (hasFailures && process.env.ALERT_WEBHOOK) {
      // 发送告警通知
      await fetch(process.env.ALERT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 启动审查失败告警 - ${event.requestId}`,
          details: event.results,
          timestamp: new Date(event.timestamp).toISOString(),
          environment: process.env.VERCEL_ENV || "development",
        }),
      })
    }
  } catch (error) {
    // 确保监控错误不会影响应用运行
    console.error("记录审计事件失败:", error)
  }
}
