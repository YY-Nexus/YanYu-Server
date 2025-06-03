import type { ModelConnector } from "./model-connector"
import { TaskRouter } from "./task-router"
import { ResultAggregator } from "./result-aggregator"
import { ContextManager } from "./context-manager"
import type { AITask, AITaskResult, CollaborationStrategy } from "./types"

/**
 * AI模型编排器 - 负责协调多个AI模型的协同工作
 */
export class Orchestrator {
  private modelConnectors: Record<string, ModelConnector>
  private taskRouter: TaskRouter
  private resultAggregator: ResultAggregator
  private contextManager: ContextManager

  constructor() {
    this.modelConnectors = {}
    this.taskRouter = new TaskRouter()
    this.resultAggregator = new ResultAggregator()
    this.contextManager = new ContextManager()
  }

  /**
   * 注册AI模型连接器
   */
  registerModel(modelId: string, connector: ModelConnector): void {
    this.modelConnectors[modelId] = connector
    console.log(`已注册AI模型: ${modelId}`)
  }

  /**
   * 执行单个AI任务
   */
  async executeTask(task: AITask): Promise<AITaskResult> {
    try {
      // 1. 获取任务上下文
      const context = this.contextManager.getContext(task.contextId)

      // 2. 路由到合适的模型
      const modelId = this.taskRouter.routeTask(task)
      const connector = this.modelConnectors[modelId]

      if (!connector) {
        throw new Error(`未找到模型连接器: ${modelId}`)
      }

      // 3. 执行任务
      console.log(`任务 ${task.id} 路由到模型 ${modelId}`)
      const result = await connector.execute({
        ...task,
        context,
      })

      // 4. 更新上下文
      this.contextManager.updateContext(task.contextId, {
        lastTask: task,
        lastResult: result,
        timestamp: Date.now(),
      })

      return result
    } catch (error) {
      console.error(`执行任务 ${task.id} 失败:`, error)
      throw error
    }
  }

  /**
   * 执行多模型协同任务
   */
  async executeCollaborativeTask(
    task: AITask,
    modelIds: string[],
    strategy: CollaborationStrategy,
  ): Promise<AITaskResult> {
    try {
      // 1. 获取任务上下文
      const context = this.contextManager.getContext(task.contextId)

      // 2. 根据策略执行多模型任务
      let results: AITaskResult[] = []

      if (strategy === "parallel") {
        // 并行执行所有模型
        const promises = modelIds.map((modelId) => {
          const connector = this.modelConnectors[modelId]
          if (!connector) {
            throw new Error(`未找到模型连接器: ${modelId}`)
          }
          return connector.execute({ ...task, context })
        })

        results = await Promise.all(promises)
      } else if (strategy === "sequential") {
        // 顺序执行模型，前一个模型的输出作为后一个模型的输入
        let currentTask = { ...task }

        for (const modelId of modelIds) {
          const connector = this.modelConnectors[modelId]
          if (!connector) {
            throw new Error(`未找到模型连接器: ${modelId}`)
          }

          const result = await connector.execute({
            ...currentTask,
            context,
          })

          results.push(result)

          // 更新任务，将当前结果作为下一个模型的输入
          currentTask = {
            ...currentTask,
            input: result.output,
          }
        }
      } else if (strategy === "voting") {
        // 所有模型独立执行，然后进行投票
        const promises = modelIds.map((modelId) => {
          const connector = this.modelConnectors[modelId]
          if (!connector) {
            throw new Error(`未找到模型连接器: ${modelId}`)
          }
          return connector.execute({ ...task, context })
        })

        results = await Promise.all(promises)
      }

      // 3. 聚合结果
      const aggregatedResult = this.resultAggregator.aggregate(results, strategy)

      // 4. 更新上下文
      this.contextManager.updateContext(task.contextId, {
        lastTask: task,
        lastResult: aggregatedResult,
        modelResults: results,
        timestamp: Date.now(),
      })

      return aggregatedResult
    } catch (error) {
      console.error(`执行协同任务 ${task.id} 失败:`, error)
      throw error
    }
  }

  /**
   * 获取当前上下文
   */
  getContext(contextId: string): any {
    return this.contextManager.getContext(contextId)
  }

  /**
   * 重置上下文
   */
  resetContext(contextId: string): void {
    this.contextManager.resetContext(contextId)
  }
}

// 创建全局编排器实例
export const orchestrator = new Orchestrator()
