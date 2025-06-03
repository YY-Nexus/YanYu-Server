import type { AITask } from "./types"

/**
 * 任务路由器 - 根据任务类型选择合适的模型
 */
export class TaskRouter {
  private routingRules: Array<{
    condition: (task: AITask) => boolean
    modelId: string
  }> = []

  private defaultModelId = "default-model"

  /**
   * 添加路由规则
   */
  addRule(condition: (task: AITask) => boolean, modelId: string): void {
    this.routingRules.push({ condition, modelId })
  }

  /**
   * 设置默认模型
   */
  setDefaultModel(modelId: string): void {
    this.defaultModelId = modelId
  }

  /**
   * 根据任务选择合适的模型
   */
  routeTask(task: AITask): string {
    // 如果任务指定了模型，直接使用
    if (task.preferredModelId) {
      return task.preferredModelId
    }

    // 应用路由规则
    for (const rule of this.routingRules) {
      if (rule.condition(task)) {
        return rule.modelId
      }
    }

    // 使用默认模型
    return this.defaultModelId
  }

  /**
   * 根据任务类型选择多个模型进行协作
   */
  routeCollaborativeTask(task: AITask, count = 2): string[] {
    // 这里可以实现更复杂的逻辑，选择最适合协作的模型组合
    // 简化实现，返回默认模型和其他匹配的模型
    const models: string[] = [this.defaultModelId]

    for (const rule of this.routingRules) {
      if (rule.condition(task) && !models.includes(rule.modelId)) {
        models.push(rule.modelId)
        if (models.length >= count) {
          break
        }
      }
    }

    return models
  }
}
