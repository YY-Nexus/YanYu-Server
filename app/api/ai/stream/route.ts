import { type NextRequest, NextResponse } from "next/server"
import { streamProcessor } from "@/lib/ai/stream-processor"
import { ModelConnector } from "@/lib/ai/model-connector"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input, type, system, contextId, preferredModelId } = body

    // 验证输入
    if (!input) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少必要参数: input",
        },
        { status: 400 },
      )
    }

    const taskId = uuidv4()

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 创建模拟的模型连接器
          const modelConnector = new ModelConnector(
            preferredModelId || "gpt-3.5-turbo",
            "openai",
            preferredModelId || "gpt-3.5-turbo",
          )

          // 开始流式处理
          await streamProcessor.startStream(
            taskId,
            modelConnector,
            {
              id: taskId,
              type: type || "general",
              input,
              system,
              contextId: contextId || "default",
              preferredModelId,
            },
            {
              onChunk: (chunk) => {
                // 发送chunk到客户端
                const data = `data: ${JSON.stringify(chunk)}\n\n`
                controller.enqueue(new TextEncoder().encode(data))
              },
              onComplete: (result) => {
                // 发送完成信号
                const data = `data: ${JSON.stringify({ type: "complete", result })}\n\n`
                controller.enqueue(new TextEncoder().encode(data))
                controller.close()
              },
              onError: (error) => {
                // 发送错误信息
                const data = `data: ${JSON.stringify({
                  type: "error",
                  error: error.message,
                })}\n\n`
                controller.enqueue(new TextEncoder().encode(data))
                controller.close()
              },
            },
          )
        } catch (error) {
          console.error("流式处理启动失败:", error)
          const data = `data: ${JSON.stringify({
            type: "error",
            error: error instanceof Error ? error.message : "未知错误",
          })}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
          controller.close()
        }
      },
      cancel() {
        // 客户端取消时停止流
        streamProcessor.stopStream(taskId)
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("流式API错误:", error)
    return NextResponse.json(
      {
        success: false,
        error: "流式处理失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
