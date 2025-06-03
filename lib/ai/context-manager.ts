/**
 * 上下文管理器 - 维护模型间共享的上下文信息
 */
export class ContextManager {
  private contexts: Record<string, any> = {}

  /**
   * 创建新的上下文
   */
  createContext(contextId: string, initialData: any = {}): void {
    this.contexts[contextId] = {
      ...initialData,
      history: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  /**
   * 获取上下文
   */
  getContext(contextId: string): any {
    // 如果上下文不存在，创建一个新的
    if (!this.contexts[contextId]) {
      this.createContext(contextId)
    }

    return this.contexts[contextId]
  }

  /**
   * 更新上下文
   */
  updateContext(contextId: string, data: any): void {
    const context = this.getContext(contextId)

    // 更新上下文数据
    this.contexts[contextId] = {
      ...context,
      ...data,
      updatedAt: Date.now(),
    }

    // 如果有任务和结果，添加到历史记录
    if (data.lastTask && data.lastResult) {
      this.contexts[contextId].history = [
        ...this.contexts[contextId].history,
        {
          task: data.lastTask,
          result: data.lastResult,
          timestamp: Date.now(),
        },
      ]
    }
  }

  /**
   * 重置上下文
   */
  resetContext(contextId: string): void {
    if (this.contexts[contextId]) {
      const { createdAt } = this.contexts[contextId]

      this.contexts[contextId] = {
        history: [],
        createdAt,
        updatedAt: Date.now(),
      }
    }
  }

  /**
   * 删除上下文
   */
  deleteContext(contextId: string): void {
    delete this.contexts[contextId]
  }

  /**
   * 获取上下文历史记录
   */
  getHistory(contextId: string): any[] {
    const context = this.getContext(contextId)
    return context.history || []
  }
}
