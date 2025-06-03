import { NextResponse } from "next/server"
import { externalMonitoring } from "@/lib/monitoring/external-integrations"

export async function GET() {
  try {
    // 模拟获取系统指标
    const metrics = {
      timestamp: Date.now(),
      responseTime: 150 + Math.random() * 100,
      throughput: 80 + Math.random() * 40,
      errorRate: Math.random() * 3,
      activeUsers: 120 + Math.random() * 30,
      cpuUsage: 30 + Math.random() * 50,
      memoryUsage: 45 + Math.random() * 35,
      diskUsage: 60 + Math.random() * 20,
      networkLatency: 20 + Math.random() * 30,
    }

    // 发送监控事件到外部系统
    await externalMonitoring.sendEvent({
      type: "METRICS_COLLECTION",
      level: "info",
      message: "系统指标收集完成",
      metadata: metrics,
      timestamp: Date.now(),
      source: "metrics-api",
    })

    return NextResponse.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("获取监控指标失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: "获取监控指标失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, level, message, metadata } = body

    // 发送自定义监控事件
    await externalMonitoring.sendEvent({
      type: type || "CUSTOM_EVENT",
      level: level || "info",
      message: message || "自定义监控事件",
      metadata: metadata || {},
      timestamp: Date.now(),
      source: "custom-event",
    })

    return NextResponse.json({
      success: true,
      message: "监控事件已发送",
    })
  } catch (error) {
    console.error("发送监控事件失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: "发送监控事件失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
