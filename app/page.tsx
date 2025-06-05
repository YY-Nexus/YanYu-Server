"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MainLayout } from "@/components/layouts/main-layout"
import {
  Loader2,
  Zap,
  Brain,
  GitMerge,
  RotateCcw,
  Shield,
  Activity,
  BarChart3,
  ArrowRight,
  Globe,
  Users,
  Sparkles,
  Play,
  TrendingUp,
  Settings,
  Star,
  Award,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function Home() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState<any[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [strategy, setStrategy] = useState<string>("parallel")
  const [mode, setMode] = useState<"single" | "collaborative">("single")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [contextId, setContextId] = useState("default")
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [systemHealth, setSystemHealth] = useState<any>(null)

  // 加载系统状态
  useEffect(() => {
    const fetchSystemHealth = async () => {
      try {
        const response = await fetch("/api/health")
        const data = await response.json()
        setSystemHealth(data)
      } catch (error) {
        console.error("获取系统状态失败:", error)
      }
    }

    fetchSystemHealth()
  }, [])

  // 加载模型列表
  const fetchModels = async () => {
    try {
      console.log("正在获取模型列表...")
      const response = await fetch("/api/ai/models")

      if (!response.ok) {
        console.warn(`HTTP错误: ${response.status} ${response.statusText}`)
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("非JSON响应:", text.substring(0, 200))
        throw new Error("服务器返回了非JSON格式的响应")
      }

      const data = await response.json()
      console.log("获取到的数据:", data)

      if (data.success && data.models) {
        setModels(data.models)

        if (data.models.length > 0) {
          setSelectedModel(data.models[0].modelId)
          setSelectedModels([
            data.models[0].modelId,
            data.models.length > 1 ? data.models[1].modelId : data.models[0].modelId,
          ])
        }
      } else {
        console.warn("API返回了错误或空数据:", data)
        const defaultModels = [
          { modelId: "gpt-3.5-turbo", modelType: "openai", modelName: "gpt-3.5-turbo" },
          { modelId: "gpt-4o", modelType: "openai", modelName: "gpt-4o" },
        ]
        setModels(defaultModels)
        setSelectedModel(defaultModels[0].modelId)
        setSelectedModels([defaultModels[0].modelId, defaultModels[1].modelId])

        setOutput("警告: 模型列表加载不完整，使用默认模型。")
      }
    } catch (error) {
      console.error("获取模型列表失败:", error)

      const defaultModels = [
        { modelId: "gpt-3.5-turbo", modelType: "openai", modelName: "gpt-3.5-turbo" },
        { modelId: "gpt-4o", modelType: "openai", modelName: "gpt-4o" },
        { modelId: "claude-3-opus", modelType: "anthropic", modelName: "claude-3-opus" },
        { modelId: "custom-model", modelType: "custom", modelName: "custom-model" },
      ]
      setModels(defaultModels)
      setSelectedModel(defaultModels[0].modelId)
      setSelectedModels([defaultModels[0].modelId, defaultModels[1].modelId])

      setOutput(
        `⚠️ 模型服务连接异常，已切换到演示模式\n\n` +
          `错误详情: ${error instanceof Error ? error.message : "未知错误"}\n\n` +
          `当前可用模型:\n` +
          defaultModels.map((m) => `• ${m.modelId} (${m.modelType})`).join("\n") +
          `\n\n您仍然可以测试AI协作功能，系统将使用模拟响应。`,
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  // 执行单一模型任务
  const executeSingleModel = async () => {
    if (!input.trim() || !selectedModel) return

    setLoading(true)
    setOutput("")
    setExecutionTime(null)

    const startTime = Date.now()

    try {
      const response = await fetch("/api/ai/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          type: "general",
          contextId,
          preferredModelId: selectedModel,
        }),
      })

      const data = await response.json()

      if (data.success && data.result) {
        setOutput(data.result.output)
        setExecutionTime(data.result.latency)
        toast.success("模型执行成功")
      } else {
        setOutput(`错误: ${data.error || "未知错误"}`)
        toast.error("模型执行失败")
      }
    } catch (error) {
      console.error("执行失败:", error)
      setOutput(`执行失败: ${error instanceof Error ? error.message : "未知错误"}`)
      toast.error("执行请求失败")
    } finally {
      setLoading(false)
    }
  }

  // 执行协作模型任务
  const executeCollaborativeModels = async () => {
    if (!input.trim() || selectedModels.length < 2) return

    setLoading(true)
    setOutput("")
    setExecutionTime(null)

    try {
      const response = await fetch("/api/ai/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          type: "general",
          contextId,
          modelIds: selectedModels,
          strategy,
        }),
      })

      const data = await response.json()

      if (data.success && data.result) {
        setOutput(data.result.output)
        setExecutionTime(data.result.latency)
        toast.success("协作执行成功")
      } else {
        setOutput(`错误: ${data.error || "未知错误"}`)
        toast.error("协作执行失败")
      }
    } catch (error) {
      console.error("协作执行失败:", error)
      setOutput(`协作执行失败: ${error instanceof Error ? error.message : "未知错误"}`)
      toast.error("协作请求失败")
    } finally {
      setLoading(false)
    }
  }

  // 重置上下文
  const resetContext = async () => {
    try {
      await fetch(`/api/ai/context?contextId=${contextId}`, {
        method: "DELETE",
      })

      setOutput("上下文已重置")
      toast.success("上下文已重置")
    } catch (error) {
      console.error("重置上下文失败:", error)
      toast.error("重置上下文失败")
    }
  }

  // 处理模型选择变化
  const handleModelSelectionChange = (modelId: string, checked: boolean) => {
    if (checked) {
      setSelectedModels([...selectedModels, modelId])
    } else {
      setSelectedModels(selectedModels.filter((id) => id !== modelId))
    }
  }

  // 执行任务
  const executeTask = () => {
    if (mode === "single") {
      executeSingleModel()
    } else {
      executeCollaborativeModels()
    }
  }

  return (
    <MainLayout systemHealth={systemHealth}>
      {/* 功能导航卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Link href="/system/features">
          <Card className="card-hover glass-effect border-blue-200 hover:border-blue-300 floating h-40">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-bold">功能分析</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">查看应用功能完整度分析报告</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-blue-600">80%</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <span className="text-xs font-medium">查看详情</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/models">
          <Card
            className="card-hover glass-effect border-purple-200 hover:border-purple-300 floating h-40"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-bold">模型管理</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">管理AI模型与协作策略配置</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-bold text-purple-600">A级</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <span className="text-xs font-medium">查看详情</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/system/monitoring">
          <Card
            className="card-hover glass-effect border-green-200 hover:border-green-300 floating h-40"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg font-bold">系统监控</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">实时监控系统状态与性能指标</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-bold text-green-600">90%</span>
                </div>
                <div className="flex items-center text-green-600">
                  <span className="text-xs font-medium">查看详情</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/stream">
          <Card
            className="card-hover glass-effect border-indigo-200 hover:border-indigo-300 floating h-40"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Play className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg font-bold">流式处理</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">体验AI实时流式响应处理</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-bold text-indigo-600">实时</span>
                </div>
                <div className="flex items-center text-indigo-600">
                  <span className="text-xs font-medium">查看详情</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/system/integrations">
          <Card
            className="card-hover glass-effect border-orange-200 hover:border-orange-300 floating h-40"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-bold">集成管理</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">管理外部系统集成与配置</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-600">已启用</span>
                </div>
                <div className="flex items-center text-orange-600">
                  <span className="text-xs font-medium">查看详情</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 核心功能展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* AI协作演示 */}
        <div className="lg:col-span-2">
          <Card className="h-full glass-effect border-2 border-white/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">AI模型协作演示</CardTitle>
              </div>
              <CardDescription className="text-gray-700 font-medium">体验多AI模型协同工作的强大能力</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="请输入您的问题或任务，体验AI协作功能..."
                className="min-h-[120px] glass-effect border-white/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="context-id" className="mb-2 block font-medium">
                    会话ID
                  </Label>
                  <div className="flex space-x-2">
                    <input
                      id="context-id"
                      className="flex h-10 w-full rounded-md border border-white/30 glass-effect px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={contextId}
                      onChange={(e) => setContextId(e.target.value)}
                    />
                    <Button variant="outline" onClick={resetContext} className="glass-effect">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block font-medium">执行模式</Label>
                  <Tabs value={mode} onValueChange={(value) => setMode(value as "single" | "collaborative")}>
                    <TabsList className="grid w-full grid-cols-2 glass-effect">
                      <TabsTrigger value="single">单一模型</TabsTrigger>
                      <TabsTrigger value="collaborative">协同模型</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {mode === "single" ? (
                <div>
                  <Label htmlFor="model-select" className="mb-2 block font-medium">
                    选择模型
                  </Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model-select" className="glass-effect border-white/30">
                      <SelectValue placeholder="选择模型" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.modelId} value={model.modelId}>
                          {model.modelId} ({model.modelType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block font-medium">选择协作模型 (至少2个)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {models.map((model) => (
                        <div key={model.modelId} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`model-${model.modelId}`}
                            checked={selectedModels.includes(model.modelId)}
                            onChange={(e) => handleModelSelectionChange(model.modelId, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`model-${model.modelId}`} className="font-medium">
                            {model.modelId}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block font-medium">协作策略</Label>
                    <RadioGroup value={strategy} onValueChange={setStrategy}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parallel" id="parallel" />
                        <Label htmlFor="parallel" className="font-medium">
                          并行 (合并所有输出)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sequential" id="sequential" />
                        <Label htmlFor="sequential" className="font-medium">
                          顺序 (链式处理)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="voting" id="voting" />
                        <Label htmlFor="voting" className="font-medium">
                          投票 (选择最佳结果)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              <Button
                className="w-full btn-rainbow text-white font-bold py-3"
                onClick={executeTask}
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    处理中...
                  </>
                ) : mode === "single" ? (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    执行单一模型
                  </>
                ) : (
                  <>
                    <GitMerge className="mr-2 h-5 w-5" />
                    执行协同模型
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 结果展示 */}
        <div>
          <Card className="h-full glass-effect border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold">执行结果</CardTitle>
              <CardDescription className="text-gray-700 font-medium">
                {executionTime !== null && <span className="text-sm">处理时间: {executionTime}ms</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="glass-effect-dark p-4 rounded-md min-h-[300px] whitespace-pre-wrap border border-white/20">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : output ? (
                  <span className="text-white">{output}</span>
                ) : (
                  <span className="text-gray-400">结果将显示在这里...</span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <Zap className="h-4 w-4 mr-1" />
                {mode === "single" ? "单一模型模式" : `协同模式 (${strategy})`}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 平台特性 */}
      <Card className="glass-effect border-2 border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl font-bold">
            <Globe className="h-6 w-6" />
            <span>平台核心特性</span>
          </CardTitle>
          <CardDescription className="text-gray-700 font-medium text-lg">
            YYC³-Nettcak AI协同平台为企业提供全方位的AI解决方案
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center space-y-3 floating">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">多模型协作</h3>
              <p className="text-sm text-gray-700">支持OpenAI、Anthropic等主流AI模型的智能协作</p>
            </div>

            <div className="text-center space-y-3 floating" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">企业级安全</h3>
              <p className="text-sm text-gray-700">全方位安全审计与威胁防护，确保数据安全</p>
            </div>

            <div className="text-center space-y-3 floating" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">实时监控</h3>
              <p className="text-sm text-gray-700">全链路性能监控与智能告警系统</p>
            </div>

            <div className="text-center space-y-3 floating" style={{ animationDelay: "0.3s" }}>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">流式处理</h3>
              <p className="text-sm text-gray-700">实时流式响应，提升用户交互体验</p>
            </div>

            <div className="text-center space-y-3 floating" style={{ animationDelay: "0.4s" }}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">易于集成</h3>
              <p className="text-sm text-gray-700">标准化API接口，快速集成到现有系统</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
