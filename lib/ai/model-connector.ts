import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import type { AIModelConfig, AITask, AITaskResult, AIModelType } from "./types"

/**
 * 模型连接器 - 提供统一的接口连接不同的AI模型
 */
export class ModelConnector {
  private modelId: string
  private modelType: AIModelType
  private modelName: string
  private config: AIModelConfig

  constructor(modelId: string, modelType: AIModelType, modelName: string, config: AIModelConfig = {}) {
    this.modelId = modelId
    this.modelType = modelType
    this.modelName = modelName
    this.config = config
  }

  /**
   * 执行AI任务
   */
  async execute(task: AITask): Promise<AITaskResult> {
    try {
      console.log(`模型 ${this.modelId} 开始执行任务 ${task.id}`)
      const startTime = Date.now()

      let output: string
      let metadata: any = {}

      // 根据模型类型选择不同的执行方式
      if (this.modelType === "openai") {
        const result = await generateText({
          model: openai(this.modelName),
          prompt: task.input,
          system: task.system || "你是一个有用的AI助手。",
          ...this.config,
        })

        output = result.text
        metadata = {
          finishReason: result.finishReason,
          usage: result.usage,
        }
      } else if (this.modelType === "anthropic") {
        const result = await generateText({
          model: anthropic(this.modelName),
          prompt: task.input,
          system: task.system || "你是一个有用的AI助手。",
          ...this.config,
        })

        output = result.text
        metadata = {
          finishReason: result.finishReason,
          usage: result.usage,
        }
      } else if (this.modelType === "custom") {
        // 自定义模型处理逻辑
        if (this.config.customHandler) {
          const result = await this.config.customHandler(task)
          output = result.output
          metadata = result.metadata
        } else {
          throw new Error("自定义模型缺少处理函数")
        }
      } else {
        throw new Error(`不支持的模型类型: ${this.modelType}`)
      }

      const endTime = Date.now()
      const latency = endTime - startTime

      console.log(`模型 ${this.modelId} 完成任务 ${task.id}，耗时 ${latency}ms`)

      return {
        taskId: task.id,
        modelId: this.modelId,
        output,
        metadata,
        latency,
        timestamp: endTime,
      }
    } catch (error) {
      console.error(`模型 ${this.modelId} 执行任务 ${task.id} 失败:`, error)
      throw error
    }
  }

  /**
   * 流式执行AI任务
   */
  async streamExecute(task: AITask, onChunk: (chunk: string) => void): Promise<AITaskResult> {
    try {
      console.log(`模型 ${this.modelId} 开始流式执行任务 ${task.id}`)
      const startTime = Date.now()

      let fullOutput = ""
      let metadata: any = {}

      if (this.modelType === "openai") {
        const result = streamText({
          model: openai(this.modelName),
          prompt: task.input,
          system: task.system || "你是一个有用的AI助手。",
          ...this.config,
          onChunk: ({ chunk }) => {
            if (chunk.type === "text-delta") {
              fullOutput += chunk.text
              onChunk(chunk.text)
            }
          },
        })

        await result.text
        metadata = {
          finishReason: "stop", // 简化处理
        }
      } else if (this.modelType === "anthropic") {
        const result = streamText({
          model: anthropic(this.modelName),
          prompt: task.input,
          system: task.system || "你是一个有用的AI助手。",
          ...this.config,
          onChunk: ({ chunk }) => {
            if (chunk.type === "text-delta") {
              fullOutput += chunk.text
              onChunk(chunk.text)
            }
          },
        })

        await result.text
        metadata = {
          finishReason: "stop", // 简化处理
        }
      } else {
        throw new Error(`不支持的模型类型流式输出: ${this.modelType}`)
      }

      const endTime = Date.now()
      const latency = endTime - startTime

      console.log(`模型 ${this.modelId} 完成流式任务 ${task.id}，耗时 ${latency}ms`)

      return {
        taskId: task.id,
        modelId: this.modelId,
        output: fullOutput,
        metadata,
        latency,
        timestamp: endTime,
      }
    } catch (error) {
      console.error(`模型 ${this.modelId} 流式执行任务 ${task.id} 失败:`, error)
      throw error
    }
  }

  /**
   * 获取模型信息
   */
  getInfo() {
    return {
      modelId: this.modelId,
      modelType: this.modelType,
      modelName: this.modelName,
    }
  }
}
