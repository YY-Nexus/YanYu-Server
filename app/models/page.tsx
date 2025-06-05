"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MainLayout } from "@/components/layouts/main-layout"
import { AIModelDiagram } from "@/components/ai-model-diagram"
import { Brain, GitMerge, Zap, Settings, Plus, Trash2, Edit, Check, X, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface Model {
  modelId: string
  modelType: string
  modelName: string
  description?: string
  capabilities?: string[]
  status?: "active" | "inactive" | "error"
  latency?: number
  costPerToken?: number
  maxTokens?: number
}

interface CollaborationStrategy {
  id: string
  name: string
  description: string
  type: "parallel" | "sequential" | "voting" | "custom"
  models: string[]
  active: boolean
  settings?: Record<string, any>
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [strategies, setStrategies] = useState<CollaborationStrategy[]>([])
  const [loading, setLoading] = useState(true)
  const [healthData, setHealthData] = useState<any>(null)
  const [editingStrategy, setEditingStrategy] = useState<CollaborationStrategy | null>(null)
  const [newStrategy, setNewStrategy] = useState<Partial<CollaborationStrategy>>({
    name: "",
    description: "",
    type: "parallel",
    models: [],
    active: true,
  })
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)

  // 获取系统健康状态
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch("/api/health")
        const data = await response.json()
        setHealthData(data)
      } catch (error) {
        console.error("获取系统状态失败:", error)
      }
    }

    fetchHealthData()
  }, [])

  // 获取模型列表
  const fetchModels = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/ai/models")

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.models) {
        setModels(data.models)
      } else {
        // 使用默认模型数据
        const defaultModels = [
          {
            modelId: "gpt-4o",
            modelType: "openai",
            modelName: "GPT-4o",
            description: "OpenAI的最新多模态大语言模型，支持文本、图像处理",
            capabilities: ["文本生成", "代码生成", "图像理解", "推理"],
            status: "active",
            latency: 1200,
            costPerToken: 0.00001,
            maxTokens: 128000,
          },
          {
            modelId: "gpt-3.5-turbo",
            modelType: "openai",
            modelName: "GPT-3.5 Turbo",
            description: "OpenAI的高效大语言模型，平衡性能与成本",
            capabilities: ["文本生成", "代码生成", "简单推理"],
            status: "active",
            latency: 500,
            costPerToken: 0.000002,
            maxTokens: 16000,
          },
          {
            modelId: "claude-3-opus",
            modelType: "anthropic",
            modelName: "Claude 3 Opus",
            description: "Anthropic的高级大语言模型，擅长复杂推理",
            capabilities: ["文本生成", "代码生成", "复杂推理", "数据分析"],
            status: "active",
            latency: 1500,
            costPerToken: 0.000015,
            maxTokens: 200000,
          },
          {
            modelId: "claude-3-sonnet",
            modelType: "anthropic",
            modelName: "Claude 3 Sonnet",
            description: "Anthropic的平衡型大语言模型",
            capabilities: ["文本生成", "代码生成", "推理"],
            status: "active",
            latency: 800,
            costPerToken: 0.000008,
            maxTokens: 180000,
          },
          {
            modelId: "gemini-pro",
            modelType: "google",
            modelName: "Gemini Pro",
            description: "Google的多模态大语言模型",
            capabilities: ["文本生成", "代码生成", "图像理解"],
            status: "active",
            latency: 900,
            costPerToken: 0.000005,
            maxTokens: 30000,
          },
          {
            modelId: "llama-3-70b",
            modelType: "meta",
            modelName: "Llama 3 70B",
            description: "Meta的开源大语言模型",
            capabilities: ["文本生成", "代码生成"],
            status: "active",
            latency: 1100,
            costPerToken: 0.000003,
            maxTokens: 8000,
          },
        ]
        setModels(defaultModels)
      }

      // 获取协作策略
      const defaultStrategies = [
        {
          id: "strategy-1",
          name: "通用并行处理",
          description: "同时使用多个模型处理请求，然后合并结果",
          type: "parallel",
          models: ["gpt-4o", "claude-3-opus"],
          active: true,
          settings: {
            mergeMethod: "weighted",
            weights: { "gpt-4o": 0.6, "claude-3-opus": 0.4 },
          },
        },
        {
          id: "strategy-2",
          name: "顺序精炼",
          description: "先使用基础模型，再由高级模型优化结果",
          type: "sequential",
          models: ["gpt-3.5-turbo", "gpt-4o"],
          active: true,
          settings: {
            instructions: "优化前一个模型的输出，提高准确性和完整性",
          },
        },
        {
          id: "strategy-3",
          name: "多模型投票",
          description: "多个模型独立处理，选择最佳或一致性结果",
          type: "voting",
          models: ["gpt-4o", "claude-3-opus", "gemini-pro"],
          active: false,
          settings: {
            votingMethod: "majority",
            tiebreaker: "gpt-4o",
          },
        },
        {
          id: "strategy-4",
          name: "代码专家组",
          description: "专门用于代码生成的模型组合",
          type: "custom",
          models: ["gpt-4o", "claude-3-opus"],
          active: true,
          settings: {
            domain: "code",
            mergeStrategy: "best-of",
            evaluationCriteria: ["correctness", "efficiency", "readability"],
          },
        },
      ]
      setStrategies(defaultStrategies)
    } catch (error) {
      console.error("获取模型列表失败:", error)
      toast.error("获取模型列表失败")

      // 使用默认模型数据
      const defaultModels = [
        {
          modelId: "gpt-4o",
          modelType: "openai",
          modelName: "GPT-4o",
          description: "OpenAI的最新多模态大语言模型",
          capabilities: ["文本生成", "代码生成", "图像理解", "推理"],
          status: "active",
          latency: 1200,
          costPerToken: 0.00001,
          maxTokens: 128000,
        },
        {
          modelId: "gpt-3.5-turbo",
          modelType: "openai",
          modelName: "GPT-3.5 Turbo",
          description: "OpenAI的高效大语言模型",
          capabilities: ["文本生成", "代码生成", "简单推理"],
          status: "active",
          latency: 500,
          costPerToken: 0.000002,
          maxTokens: 16000,
        },
        {
          modelId: "claude-3-opus",
          modelType: "anthropic",
          modelName: "Claude 3 Opus",
          description: "Anthropic的高级大语言模型",
          capabilities: ["文本生成", "代码生成", "复杂推理"],
          status: "active",
          latency: 1500,
          costPerToken: 0.000015,
          maxTokens: 200000,
        },
      ]
      setModels(defaultModels)

      // 默认协作策略
      const defaultStrategies = [
        {
          id: "strategy-1",
          name: "通用并行处理",
          description: "同时使用多个模型处理请求，然后合并结果",
          type: "parallel",
          models: ["gpt-4o", "claude-3-opus"],
          active: true,
        },
        {
          id: "strategy-2",
          name: "顺序精炼",
          description: "先使用基础模型，再由高级模型优化结果",
          type: "sequential",
          models: ["gpt-3.5-turbo", "gpt-4o"],
          active: true,
        },
      ]
      setStrategies(defaultStrategies)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  // 获取模型类型的颜色
  const getModelTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "openai":
        return "bg-green-100 text-green-800"
      case "anthropic":
        return "bg-purple-100 text-purple-800"
      case "google":
        return "bg-blue-100 text-blue-800"
      case "meta":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取策略类型的颜色
  const getStrategyTypeColor = (type: string) => {
    switch (type) {
      case "parallel":
        return "bg-blue-100 text-blue-800"
      case "sequential":
        return "bg-green-100 text-green-800"
      case "voting":
        return "bg-purple-100 text-purple-800"
      case "custom":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取策略类型的中文名称
  const getStrategyTypeName = (type: string) => {
    switch (type) {
      case "parallel":
        return "并行"
      case "sequential":
        return "顺序"
      case "voting":
        return "投票"
      case "custom":
        return "自定义"
      default:
        return type
    }
  }

  // 添加新策略
  const addStrategy = () => {
    if (!newStrategy.name || !newStrategy.type || selectedModels.length < 2) {
      toast.error("请填写完整的策略信息并选择至少两个模型")
      return
    }

    const strategy: CollaborationStrategy = {
      id: `strategy-${Date.now()}`,
      name: newStrategy.name || "",
      description: newStrategy.description || "",
      type: (newStrategy.type as "parallel" | "sequential" | "voting" | "custom") || "parallel",
      models: selectedModels,
      active: newStrategy.active || false,
    }

    setStrategies([...strategies, strategy])
    setNewStrategy({
      name: "",
      description: "",
      type: "parallel",
      models: [],
      active: true,
    })
    setSelectedModels([])
    toast.success("策略添加成功")
  }

  // 更新策略
  const updateStrategy = () => {
    if (!editingStrategy) return

    const updatedStrategies = strategies.map((s) =>
      s.id === editingStrategy.id ? { ...editingStrategy, models: selectedModels } : s,
    )

    setStrategies(updatedStrategies)
    setEditingStrategy(null)
    setSelectedModels([])
    toast.success("策略更新成功")
  }

  // 删除策略
  const deleteStrategy = (id: string) => {
    setStrategies(strategies.filter((s) => s.id !== id))
    toast.success("策略删除成功")
  }

  // 切换策略激活状态
  const toggleStrategyActive = (id: string) => {
    setStrategies(strategies.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
  }

  // 编辑策略
  const startEditStrategy = (strategy: CollaborationStrategy) => {
    setEditingStrategy(strategy)
    setSelectedModels([...strategy.models])
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingStrategy(null)
    setSelectedModels([])
  }

  // 处理模型选择变化
  const handleModelSelectionChange = (modelId: string, checked: boolean) => {
    if (checked) {
      setSelectedModels([...selectedModels, modelId])
    } else {
      setSelectedModels(selectedModels.filter((id) => id !== modelId))
    }
  }

  return (
    <MainLayout systemHealth={healthData}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold rainbow-text mb-4">AI模型管理</h1>
        <p className="text-gray-700 text-lg font-medium">管理AI模型与协作策略配置</p>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="glass-effect">
          <TabsTrigger value="models">模型列表</TabsTrigger>
          <TabsTrigger value="strategies">协作策略</TabsTrigger>
          <TabsTrigger value="diagram">协作架构图</TabsTrigger>
          <TabsTrigger value="settings">模型设置</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">可用模型</h2>
            <Button variant="outline" className="glass-effect" onClick={() => fetchModels()} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              刷新模型
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model, index) => (
                <Card
                  key={model.modelId}
                  className="card-hover glass-effect border-2 border-white/30 floating"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg font-bold">{model.modelName || model.modelId}</CardTitle>
                      </div>
                      <Badge className={getModelTypeColor(model.modelType)}>{model.modelType}</Badge>
                    </div>
                    <CardDescription className="font-medium text-gray-700">
                      {model.description || `${model.modelType} 模型`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">模型ID</span>
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{model.modelId}</span>
                      </div>

                      {model.status && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">状态</span>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status === "active" ? "活跃" : model.status === "inactive" ? "非活跃" : "错误"}
                          </Badge>
                        </div>
                      )}

                      {model.latency && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">平均延迟</span>
                          <span className="text-sm">{model.latency}ms</span>
                        </div>
                      )}

                      {model.maxTokens && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">最大Token</span>
                          <span className="text-sm">{model.maxTokens.toLocaleString()}</span>
                        </div>
                      )}

                      {model.capabilities && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium">能力</span>
                          <div className="flex flex-wrap gap-2">
                            {model.capabilities.map((capability) => (
                              <Badge key={capability} variant="outline">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-effect border-2 border-white/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">协作策略</CardTitle>
                    <Badge variant="outline" className="px-3 py-1">
                      {strategies.length} 个策略
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-700 font-medium">管理多模型协作的策略配置</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategies.map((strategy) => (
                      <Card key={strategy.id} className="glass-effect border-white/20">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <GitMerge className="h-5 w-5 text-blue-600" />
                              <CardTitle className="text-lg font-bold">{strategy.name}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStrategyTypeColor(strategy.type)}>
                                {getStrategyTypeName(strategy.type)}
                              </Badge>
                              <Badge variant={strategy.active ? "default" : "outline"}>
                                {strategy.active ? "已启用" : "已禁用"}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="font-medium text-gray-700">
                            {strategy.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">使用模型</div>
                            <div className="flex flex-wrap gap-2">
                              {strategy.models.map((modelId) => {
                                const model = models.find((m) => m.modelId === modelId)
                                return (
                                  <Badge key={modelId} className={getModelTypeColor(model?.modelType || "unknown")}>
                                    {modelId}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </CardContent>
                        <div className="px-6 py-2 border-t border-white/10 flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStrategyActive(strategy.id)}
                            className="text-xs"
                          >
                            {strategy.active ? "禁用" : "启用"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditStrategy(strategy)}
                            className="text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStrategy(strategy.id)}
                            className="text-red-500 text-xs hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            删除
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="glass-effect border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{editingStrategy ? "编辑策略" : "添加新策略"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="strategy-name">策略名称</Label>
                      <Input
                        id="strategy-name"
                        placeholder="输入策略名称"
                        value={editingStrategy ? editingStrategy.name : newStrategy.name}
                        onChange={(e) =>
                          editingStrategy
                            ? setEditingStrategy({ ...editingStrategy, name: e.target.value })
                            : setNewStrategy({ ...newStrategy, name: e.target.value })
                        }
                        className="glass-effect border-white/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="strategy-desc">策略描述</Label>
                      <Input
                        id="strategy-desc"
                        placeholder="输入策略描述"
                        value={editingStrategy ? editingStrategy.description : newStrategy.description}
                        onChange={(e) =>
                          editingStrategy
                            ? setEditingStrategy({ ...editingStrategy, description: e.target.value })
                            : setNewStrategy({ ...newStrategy, description: e.target.value })
                        }
                        className="glass-effect border-white/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="strategy-type">策略类型</Label>
                      <Select
                        value={editingStrategy ? editingStrategy.type : newStrategy.type}
                        onValueChange={(value) =>
                          editingStrategy
                            ? setEditingStrategy({
                                ...editingStrategy,
                                type: value as "parallel" | "sequential" | "voting" | "custom",
                              })
                            : setNewStrategy({
                                ...newStrategy,
                                type: value as "parallel" | "sequential" | "voting" | "custom",
                              })
                        }
                        disabled={!!editingStrategy}
                      >
                        <SelectTrigger id="strategy-type" className="glass-effect border-white/30">
                          <SelectValue placeholder="选择策略类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parallel">并行处理</SelectItem>
                          <SelectItem value="sequential">顺序处理</SelectItem>
                          <SelectItem value="voting">投票选择</SelectItem>
                          <SelectItem value="custom">自定义</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="strategy-active">启用策略</Label>
                        <Switch
                          id="strategy-active"
                          checked={editingStrategy ? editingStrategy.active : newStrategy.active}
                          onCheckedChange={(checked) =>
                            editingStrategy
                              ? setEditingStrategy({ ...editingStrategy, active: checked })
                              : setNewStrategy({ ...newStrategy, active: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="block mb-2">选择模型 (至少2个)</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 glass-effect rounded-md border border-white/20">
                        {models.map((model) => (
                          <div key={model.modelId} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`model-${model.modelId}`}
                              checked={selectedModels.includes(model.modelId)}
                              onChange={(e) => handleModelSelectionChange(model.modelId, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor={`model-${model.modelId}`} className="text-sm">
                              {model.modelId}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      {editingStrategy ? (
                        <>
                          <Button variant="outline" onClick={cancelEdit}>
                            <X className="h-4 w-4 mr-1" />
                            取消
                          </Button>
                          <Button onClick={updateStrategy}>
                            <Check className="h-4 w-4 mr-1" />
                            更新
                          </Button>
                        </>
                      ) : (
                        <Button onClick={addStrategy}>
                          <Plus className="h-4 w-4 mr-1" />
                          添加策略
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="diagram" className="space-y-6">
          <Card className="glass-effect border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">AI模型协作架构图</CardTitle>
              <CardDescription className="text-gray-700 font-medium">可视化展示AI模型协作流程与架构</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] w-full">
                <AIModelDiagram models={models} strategies={strategies} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-effect border-2 border-white/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl font-bold">模型设置</CardTitle>
              </div>
              <CardDescription className="text-gray-700 font-medium">配置AI模型的全局设置与参数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-model">默认模型</Label>
                    <Select defaultValue="gpt-4o">
                      <SelectTrigger id="default-model" className="glass-effect border-white/30">
                        <SelectValue placeholder="选择默认模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.modelId} value={model.modelId}>
                            {model.modelName || model.modelId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-strategy">默认协作策略</Label>
                    <Select defaultValue="strategy-1">
                      <SelectTrigger id="default-strategy" className="glass-effect border-white/30">
                        <SelectValue placeholder="选择默认策略" />
                      </SelectTrigger>
                      <SelectContent>
                        {strategies.map((strategy) => (
                          <SelectItem key={strategy.id} value={strategy.id}>
                            {strategy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">默认温度</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.7"
                        className="glass-effect border-white/30"
                      />
                      <span className="w-8 text-center">0.7</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">默认最大Token</Label>
                    <Input id="max-tokens" type="number" defaultValue="4000" className="glass-effect border-white/30" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cache-enabled">启用响应缓存</Label>
                      <Switch id="cache-enabled" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-600">缓存相同请求的响应以提高性能</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fallback-enabled">启用模型故障转移</Label>
                      <Switch id="fallback-enabled" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-600">当首选模型不可用时自动切换到备用模型</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stream-enabled">启用流式响应</Label>
                      <Switch id="stream-enabled" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-600">使用流式API获取实时响应</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="logging-enabled">启用详细日志</Label>
                      <Switch id="logging-enabled" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-600">记录详细的模型请求和响应日志</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-2">
                <Button variant="outline" className="glass-effect">
                  重置为默认
                </Button>
                <Button>
                  <Check className="h-4 w-4 mr-1" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-white/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-xl font-bold">高级设置</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="context-window">上下文窗口大小</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="context-window" className="glass-effect border-white/30">
                        <SelectValue placeholder="选择上下文窗口大小" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">小 (5条消息)</SelectItem>
                        <SelectItem value="medium">中 (10条消息)</SelectItem>
                        <SelectItem value="large">大 (20条消息)</SelectItem>
                        <SelectItem value="unlimited">无限制</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retry-attempts">重试次数</Label>
                    <Input
                      id="retry-attempts"
                      type="number"
                      defaultValue="3"
                      className="glass-effect border-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">请求超时 (毫秒)</Label>
                    <Input id="timeout" type="number" defaultValue="30000" className="glass-effect border-white/30" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="debug-mode">调试模式</Label>
                      <Switch id="debug-mode" />
                    </div>
                    <p className="text-sm text-gray-600">启用详细的调试信息</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button>
                  <Check className="h-4 w-4 mr-1" />
                  应用高级设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}
