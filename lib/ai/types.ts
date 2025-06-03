// AI模型类型
export type AIModelType = "openai" | "anthropic" | "custom"

// AI模型配置
export interface AIModelConfig {
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  customHandler?: (task: AITask) => Promise<AITaskResult>
  [key: string]: any
}

// AI任务
export interface AITask {
  id: string
  type: string
  input: string
  system?: string
  contextId: string
  preferredModelId?: string
  metadata?: Record<string, any>
}

// AI任务结果
export interface AITaskResult {
  taskId: string
  modelId: string
  output: string
  metadata?: any
  latency: number
  timestamp: number
}

// 协作策略
export type CollaborationStrategy =
  | "parallel" // 并行执行所有模型，合并结果
  | "sequential" // 顺序执行模型，前一个模型的输出作为后一个模型的输入
  | "voting" // 所有模型独立执行，然后进行投票
