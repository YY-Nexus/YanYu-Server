import { type NextRequest, NextResponse } from "next/server"
import { externalMonitoring } from "@/lib/monitoring/external-integrations"

export async function POST(request: NextRequest) {
  try {
    const { integration } = await request.json()

    // 创建测试事件
    const testEvent = {
      type: "INTEGRATION_TEST",
      level: "info" as const,
      message: "🎉 YYC³-Nettcak 监控系统集成测试成功！系统运行正常。",
      metadata: {
        testTime: new Date().toLocaleString("zh-CN"),
        environment: process.env.VERCEL_ENV || "development",
        region: process.env.VERCEL_REGION || "unknown",
      },
      timestamp: Date.now(),
      source: "integration-test",
    }

    if (integration === "all") {
      // 测试所有集成
      const results = await externalMonitoring.testIntegrations()
      return NextResponse.json({
        success: true,
        message: "所有集成测试完成",
        results,
      })
    } else if (integration === "wechat") {
      // 专门测试企业微信
      await externalMonitoring.sendEvent(testEvent)
      return NextResponse.json({
        success: true,
        message: "企业微信集成测试成功",
        integration: "wechat",
      })
    } else {
      // 发送测试事件
      await externalMonitoring.sendEvent(testEvent)
      return NextResponse.json({
        success: true,
        message: "监控事件发送成功",
      })
    }
  } catch (error) {
    console.error("集成测试失败:", error)
    return NextResponse.json(
      {
        success: false,
        message: "集成测试失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // 获取集成状态
    const status = externalMonitoring.getIntegrationStatus()

    return NextResponse.json({
      success: true,
      integrations: status,
      configured: Object.keys(status),
      message: `已配置 ${Object.keys(status).length} 个外部集成`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "获取集成状态失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
