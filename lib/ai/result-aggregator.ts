import type { AITaskResult, CollaborationStrategy } from "./types"

/**
 * 结果聚合器 - 整合多个模型的输出结果
 */
export class ResultAggregator {
  /**
   * 聚合多个模型的结果
   */
  aggregate(results: AITaskResult[], strategy: CollaborationStrategy): AITaskResult {
    if (results.length === 0) {
      throw new Error("没有结果可聚合")
    }

    if (results.length === 1) {
      return results[0]
    }

    // 根据不同策略聚合结果
    if (strategy === "parallel") {
      return this.aggregateParallel(results)
    } else if (strategy === "sequential") {
      return this.aggregateSequential(results)
    } else if (strategy === "voting") {
      return this.aggregateVoting(results)
    } else {
      throw new Error(`不支持的聚合策略: ${strategy}`)
    }
  }

  /**
   * 聚合并行执行的结果 - 合并所有输出
   */
  private aggregateParallel(results: AITaskResult[]): AITaskResult {
    // 获取最后一个任务的ID和时间戳
    const lastResult = results[results.length - 1]

    // 合并所有输出
    const combinedOutput = results.map((r) => `【模型 ${r.modelId}】:\n${r.output}`).join("\n\n")

    // 计算平均延迟
    const avgLatency = results.reduce((sum, r) => sum + r.latency, 0) / results.length

    return {
      taskId: lastResult.taskId,
      modelId: "aggregated",
      output: combinedOutput,
      metadata: {
        strategy: "parallel",
        contributingModels: results.map((r) => r.modelId),
        individualResults: results,
      },
      latency: avgLatency,
      timestamp: Date.now(),
    }
  }

  /**
   * 聚合顺序执行的结果 - 使用最后一个模型的输出
   */
  private aggregateSequential(results: AITaskResult[]): AITaskResult {
    // 使用最后一个模型的输出作为最终结果
    const lastResult = results[results.length - 1]

    // 计算总延迟
    const totalLatency = results.reduce((sum, r) => sum + r.latency, 0)

    return {
      taskId: lastResult.taskId,
      modelId: "aggregated",
      output: lastResult.output,
      metadata: {
        strategy: "sequential",
        contributingModels: results.map((r) => r.modelId),
        processingSteps: results.map((r) => ({
          modelId: r.modelId,
          latency: r.latency,
        })),
        individualResults: results,
      },
      latency: totalLatency,
      timestamp: Date.now(),
    }
  }

  /**
   * 聚合投票执行的结果 - 选择最相似或最有共识的输出
   */
  private aggregateVoting(results: AITaskResult[]): AITaskResult {
    // 简化实现：选择延迟最低的结果
    // 实际应用中可以实现更复杂的投票机制，如相似度比较、多数投票等

    // 按延迟排序
    const sortedResults = [...results].sort((a, b) => a.latency - b.latency)
    const selectedResult = sortedResults[0]

    return {
      taskId: selectedResult.taskId,
      modelId: "aggregated",
      output: selectedResult.output,
      metadata: {
        strategy: "voting",
        contributingModels: results.map((r) => r.modelId),
        winner: selectedResult.modelId,
        individualResults: results,
      },
      latency: selectedResult.latency,
      timestamp: Date.now(),
    }
  }
}
