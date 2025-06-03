import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("开始获取模型列表...")

    // 直接返回默认模型列表，避免复杂的初始化问题
    const defaultModels = [
      {
        modelId: "gpt-3.5-turbo",
        modelType: "openai",
        modelName: "gpt-3.5-turbo",
        description: "快速、高效的对话模型",
      },
      {
        modelId: "gpt-4o",
        modelType: "openai",
        modelName: "gpt-4o",
        description: "最新的GPT-4模型，具有更强的推理能力",
      },
      {
        modelId: "claude-3-opus",
        modelType: "anthropic",
        modelName: "claude-3-opus",
        description: "Anthropic的高级对话模型",
      },
      {
        modelId: "custom-model",
        modelType: "custom",
        modelName: "custom-model",
        description: "自定义处理模型",
      },
    ]

    console.log(`返回 ${defaultModels.length} 个默认模型`)

    return NextResponse.json({
      success: true,
      models: defaultModels,
      message: "模型列表加载成功",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("获取模型列表时发生错误:", error)

    // 即使出错也返回基本模型列表
    const fallbackModels = [
      {
        modelId: "gpt-3.5-turbo",
        modelType: "openai",
        modelName: "gpt-3.5-turbo",
        description: "默认模型",
      },
    ]

    return NextResponse.json({
      success: true,
      models: fallbackModels,
      error: "部分功能不可用，使用基础模型",
      message: error instanceof Error ? error.message : "未知错误",
      timestamp: new Date().toISOString(),
    })
  }
}
