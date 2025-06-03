// 导出所有AI模块
export * from "./orchestrator"
export * from "./model-connector"
export * from "./task-router"
export * from "./result-aggregator"
export * from "./context-manager"
export * from "./types"

// 导出预配置的编排器实例
import { orchestrator } from "./orchestrator"
import { ModelConnector } from "./model-connector"

// 初始化标志
let isInitialized = false

// 初始化默认模型
const initializeDefaultModels = () => {
  if (isInitialized) {
    return orchestrator
  }

  try {
    console.log("开始初始化AI模型...")

    // 注册OpenAI模型
    const gpt4Connector = new ModelConnector("gpt-4o", "openai", "gpt-4o", { temperature: 0.7 })
    const gpt35Connector = new ModelConnector("gpt-3.5-turbo", "openai", "gpt-3.5-turbo", { temperature: 0.7 })

    // 注册Anthropic模型
    const claudeConnector = new ModelConnector("claude-3-opus", "anthropic", "claude-3-opus", { temperature: 0.7 })

    // 注册自定义模型示例
    const customConnector = new ModelConnector("custom-model", "custom", "custom-model", {
      customHandler: async (task) => {
        // 自定义模型处理逻辑
        return {
          taskId: task.id,
          modelId: "custom-model",
          output: `自定义模型处理结果: ${task.input}`,
          latency: 100,
          timestamp: Date.now(),
        }
      },
    })

    // 注册模型到编排器
    try {
      orchestrator.registerModel("gpt-4o", gpt4Connector)
      orchestrator.registerModel("gpt-3.5-turbo", gpt35Connector)
      orchestrator.registerModel("claude-3-opus", claudeConnector)
      orchestrator.registerModel("custom-model", customConnector)
    } catch (error) {
      console.error("注册模型失败:", error)
    }

    // 配置任务路由器
    try {
      const taskRouter = orchestrator["taskRouter"]
      if (taskRouter) {
        taskRouter.setDefaultModel("gpt-3.5-turbo")

        // 添加路由规则
        taskRouter.addRule((task) => task.type === "complex-reasoning" || task.input.length > 1000, "gpt-4o")
        taskRouter.addRule(
          (task) => task.type === "creative-writing" || task.type === "story-generation",
          "claude-3-opus",
        )
        taskRouter.addRule((task) => task.type === "custom-processing", "custom-model")
      }
    } catch (error) {
      console.error("配置任务路由器失败:", error)
    }

    isInitialized = true
    console.log("AI模型初始化完成")

    return orchestrator
  } catch (error) {
    console.error("AI模型初始化失败:", error)
    isInitialized = false
    return orchestrator
  }
}

// 导出初始化函数
export const getOrchestrator = () => {
  return initializeDefaultModels()
}

// 立即初始化
initializeDefaultModels()

export default orchestrator
