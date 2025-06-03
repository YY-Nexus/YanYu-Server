import { NextResponse } from "next/server"
import { getServerConfig } from "@/lib/config"

export async function GET() {
  try {
    const startTime = Date.now()
    const config = await getServerConfig()
    const responseTime = Date.now() - startTime

    return NextResponse.json({
      status: "ok",
      version: config.version,
      environment: process.env.VERCEL_ENV || "development",
      region: process.env.VERCEL_REGION || "local",
      features: {
        audit: config.features.audit,
        security: config.features.security,
        monitoring: config.features.monitoring,
      },
      performance: {
        responseTime: `${responseTime}ms`,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("健康检查接口错误:", error)

    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "未知错误",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
