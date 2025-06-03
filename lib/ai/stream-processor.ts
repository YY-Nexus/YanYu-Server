import type { AITask, AITaskResult } from "./types"

export interface StreamChunk {
  type: "text-delta" | "tool-call" | "error" | "done"
  content: string
  metadata?: any
  timestamp: number
}

export interface StreamOptions {
  onChunk?: (chunk: StreamChunk) => void
  onProgress?: (progress: number) => void
  onError?: (error: Error) => void
  onComplete?: (result: AITaskResult) => void
}

/**
 * 流式处理器 - 处理AI模型的实时流式响应
 */
export class StreamProcessor {
  private activeStreams: Map<string, AbortController> = new Map()
  private chunkBuffer: Map<string, StreamChunk[]> = new Map()

  /**
   * 开始流式处理
   */
  async startStream(taskId: string, modelConnector: any, task: AITask, options: StreamOptions = {}): Promise<void> {
    // 创建中断控制器
    const abortController = new AbortController()
    this.activeStreams.set(taskId, abortController)
    this.chunkBuffer.set(taskId, [])

    try {
      let fullContent = ""
      let chunkCount = 0
      const startTime = Date.now()

      // 模拟流式响应（实际应用中会调用真实的AI模型API）
      const simulateStream = async () => {
        const content = `这是对问题"${task.input.substring(0, 50)}..."的流式回答。`
        const words = content.split("")

        for (let i = 0; i < words.length; i++) {
          // 检查是否被中断
          if (abortController.signal.aborted) {
            throw new Error("Stream aborted")
          }

          const char = words[i]
          fullContent += char
          chunkCount++

          const chunk: StreamChunk = {
            type: "text-delta",
            content: char,
            metadata: {
              chunkIndex: chunkCount,
              totalProgress: (i + 1) / words.length,
            },
            timestamp: Date.now(),
          }

          // 缓存chunk
          this.chunkBuffer.get(taskId)?.push(chunk)

          // 调用回调
          options.onChunk?.(chunk)
          options.onProgress?.((i + 1) / words.length)

          // 模拟网络延迟
          await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100))
        }

        // 发送完成信号
        const doneChunk: StreamChunk = {
          type: "done",
          content: "",
          metadata: {
            totalChunks: chunkCount,
            totalTime: Date.now() - startTime,
          },
          timestamp: Date.now(),
        }

        this.chunkBuffer.get(taskId)?.push(doneChunk)
        options.onChunk?.(doneChunk)

        // 创建最终结果
        const result: AITaskResult = {
          taskId: task.id,
          modelId: "streaming-model",
          output: fullContent,
          metadata: {
            streaming: true,
            totalChunks: chunkCount,
            bufferSize: this.chunkBuffer.get(taskId)?.length || 0,
          },
          latency: Date.now() - startTime,
          timestamp: Date.now(),
        }

        options.onComplete?.(result)
      }

      await simulateStream()
    } catch (error) {
      console.error(`流式处理错误 (${taskId}):`, error)

      const errorChunk: StreamChunk = {
        type: "error",
        content: error instanceof Error ? error.message : "未知错误",
        timestamp: Date.now(),
      }

      this.chunkBuffer.get(taskId)?.push(errorChunk)
      options.onChunk?.(errorChunk)
      options.onError?.(error instanceof Error ? error : new Error("未知错误"))
    } finally {
      // 清理资源
      this.activeStreams.delete(taskId)
    }
  }

  /**
   * 停止流式处理
   */
  stopStream(taskId: string): void {
    const controller = this.activeStreams.get(taskId)
    if (controller) {
      controller.abort()
      this.activeStreams.delete(taskId)
    }
  }

  /**
   * 获取流式缓存
   */
  getStreamBuffer(taskId: string): StreamChunk[] {
    return this.chunkBuffer.get(taskId) || []
  }

  /**
   * 清理流式缓存
   */
  clearStreamBuffer(taskId: string): void {
    this.chunkBuffer.delete(taskId)
  }

  /**
   * 获取活跃流的数量
   */
  getActiveStreamCount(): number {
    return this.activeStreams.size
  }

  /**
   * 停止所有流
   */
  stopAllStreams(): void {
    for (const [taskId] of this.activeStreams) {
      this.stopStream(taskId)
    }
  }
}

// 全局流式处理器实例
export const streamProcessor = new StreamProcessor()
