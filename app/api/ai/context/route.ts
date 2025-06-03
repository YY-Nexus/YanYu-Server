import { type NextRequest, NextResponse } from "next/server"
import { orchestrator } from "@/lib/ai"

export async function GET(request: NextRequest) {
  try {
    const contextId = request.nextUrl.searchParams.get("contextId") || "default"

    // 获取上下文
    const context = orchestrator.getContext(contextId)

    return NextResponse.json({
      success: true,
      context,
    })
  } catch (error) {
    console.error("获取上下文错误:", error)
    return NextResponse.json(
      {
        error: "获取上下文失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const contextId = request.nextUrl.searchParams.get("contextId") || "default"

    // 重置上下文
    orchestrator.resetContext(contextId)

    return NextResponse.json({
      success: true,
      message: `上下文 ${contextId} 已重置`,
    })
  } catch (error) {
    console.error("重置上下文错误:", error)
    return NextResponse.json(
      {
        error: "重置上下文失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
