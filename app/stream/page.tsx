"use client"

import type { Viewport } from "next"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MainLayout } from "@/components/layouts/main-layout"
import { Loader2, Play, Pause, RotateCcw, Settings, Zap } from "lucide-react"
import { toast } from "sonner"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function StreamPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [paused, setPaused] = useState(false)
  const [models, setModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [healthData, setHealthData] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    streamSpeed: "normal",
    showTimestamps: true,
    highlightKeywords: true,
    maxTokens: 1000,
    temperature: 0.7,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/ai/models")

        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.models) {
          setModels(data.models)
          if (data.models.length > 0) {
            setSelectedModel(data.models[0].modelId)
          }
        } else {
          // 使用默认模型数据
          const defaultModels = [
            { modelId: "gpt-4o", modelType: "openai", modelName: "GPT-4o" },
            { modelId: "gpt-3.5-turbo", modelType: "openai", modelName: "GPT-3.5 Turbo" },
            { modelId: "claude-3-opus", modelType: "anthropic", modelName: "Claude 3 Opus" },
          ]
          setModels(defaultModels)
          setSelectedModel(defaultModels[0].modelId)
        }
      } catch (error) {
        console.error("获取模型列表失败:", error)

        // 使用默认模型数据
        const defaultModels = [
          { modelId: "gpt-4o", modelType: "openai", modelName: "GPT-4o" },
          { modelId: "gpt-3.5-turbo", modelType: "openai", modelName: "GPT-3.5 Turbo" },
          { modelId: "claude-3-opus", modelType: "anthropic", modelName: "Claude 3 Opus" },
        ]
        setModels(defaultModels)
        setSelectedModel(defaultModels[0].modelId)
      }
    }

    fetchModels()
  }, [])

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current)
      }
    }
  }, [])

  // 开始流式处理
  const startStreaming = async () => {
    if (!input.trim() || !selectedModel) {
      toast.error("请输入内容并选择模型")
      return
    }

    setLoading(true)
    setStreaming(true)
    setPaused(false)
    setOutput("")

    try {
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          modelId: selectedModel,
          settings: {
            maxTokens: settings.maxTokens,
            temperature: settings.temperature,
          },
        }),
        signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      if (!response.body) {
        throw new Error("响应没有可读流")
      }

      // 模拟流式响应
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedOutput = ""

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              setLoading(false)
              setStreaming(false)
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            accumulatedOutput += chunk
            setOutput(accumulatedOutput)

            // 如果暂停，等待恢复
            if (paused) {
              await new Promise<void>((resolve) => {
                const checkPaused = () => {
                  if (!paused) {
                    resolve()
                  } else {
                    streamTimeoutRef.current = setTimeout(checkPaused, 100)
                  }
                }
                checkPaused()
              })
            }
          }
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            console.error("流处理错误:", error)
            toast.error("流处理错误")
          }
          setLoading(false)
          setStreaming(false)
        }
      }

      processStream()
    } catch (error) {
      console.error("开始流式处理失败:", error)
      toast.error("开始流式处理失败")
      setLoading(false)
      setStreaming(false)

      // 模拟流式响应
      simulateStreamResponse()
    }
  }

  // 模拟流式响应
  const simulateStreamResponse = () => {
    setLoading(true)
    setStreaming(true)
    setPaused(false)
    setOutput("")

    const responses = [
      "正在处理您的请求...\n\n",
      "流式处理是一种实时数据传输技术，它允许数据在生成的同时被发送和处理，而不需要等待整个数据集完成。\n\n",
      "在AI应用中，流式处理特别有用，因为它可以：\n\n",
      "1. 提供更快的初始响应时间\n",
      "2. 改善用户体验，用户可以看到AI正在思考\n",
      "3. 允许长回答逐步显示，而不是一次性加载\n",
      "4. 减少感知延迟\n\n",
      "技术实现上，流式处理通常使用以下技术：\n\n",
      "- Server-Sent Events (SSE)\n",
      "- WebSockets\n",
      "- 分块传输编码 (Chunked Transfer Encoding)\n\n",
      "在Next.js应用中，我们可以使用Response.body和ReadableStream来实现服务器端的流式响应，然后在客户端使用fetch API的流式功能来处理这些响应。\n\n",
      "这种方法使得AI生成的内容可以实时显示给用户，大大提升了交互体验。",
    ]

    let currentIndex = 0
    let accumulatedOutput = ""

    const simulateChunk = () => {
      if (currentIndex < responses.length && !paused) {
        accumulatedOutput += responses[currentIndex]
        setOutput(accumulatedOutput)
        currentIndex++

        const delay = settings.streamSpeed === "slow" ? 800 : settings.streamSpeed === "fast" ? 200 : 400
        streamTimeoutRef.current = setTimeout(simulateChunk, delay)
      } else if (paused) {
        streamTimeoutRef.current = setTimeout(simulateChunk, 100)
      } else {
        setLoading(false)
        setStreaming(false)
      }
    }

    simulateChunk()
  }

  // 暂停/恢复流式处理
  const togglePause = () => {
    setPaused(!paused)
  }

  // 停止流式处理
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current)
      streamTimeoutRef.current = null
    }

    setLoading(false)
    setStreaming(false)
    setPaused(false)
  }

  // 重置
  const resetStream = () => {
    stopStreaming()
    setOutput("")
  }

  return (
    <MainLayout systemHealth={healthData}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold rainbow-text mb-4">流式处理演示</h1>
        <p className="text-gray-700 text-lg font-medium">体验AI实时流式响应处理</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="glass-effect border-2 border-white/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">流式请求</CardTitle>
              </div>
              <CardDescription className="text-gray-700 font-medium">配置并发送流式处理请求</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model-select">选择模型</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model-select" className="glass-effect border-white/30">
                    <SelectValue placeholder="选择模型" />
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
                <Label htmlFor="input-text">输入内容</Label>
                <Textarea
                  id="input-text"
                  placeholder="输入您的问题或任务..."
                  className="min-h-[120px] glass-effect border-white/30"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="glass-effect"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {showSettings ? "隐藏设置" : "显示设置"}
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetStream}
                    disabled={loading && !streaming}
                    className="glass-effect"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  {streaming ? (
                    <>
                      <Button variant="outline" size="sm" onClick={togglePause} className="glass-effect">
                        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={stopStreaming}>
                        停止
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={startStreaming}
                      disabled={loading || !input.trim()}
                      className="btn-rainbow text-white"
                    >
                      {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
                      开始流式处理
                    </Button>
                  )}
                </div>
              </div>

              {/* 设置面板 */}
              {showSettings && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50 space-y-4">
                  <h3 className="font-semibold text-sm text-gray-700">高级设置</h3>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="stream-speed" className="text-sm">
                        流速
                      </Label>
                      <Select
                        value={settings.streamSpeed}
                        onValueChange={(value) => setSettings({ ...settings, streamSpeed: value })}
                      >
                        <SelectTrigger id="stream-speed">
                          <SelectValue placeholder="选择流速" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">慢速</SelectItem>
                          <SelectItem value="normal">正常</SelectItem>
                          <SelectItem value="fast">快速</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="max-tokens" className="text-sm">
                          最大令牌数
                        </Label>
                        <span className="text-xs text-gray-500">{settings.maxTokens}</span>
                      </div>
                      <input
                        id="max-tokens"
                        type="range"
                        min={100}
                        max={4000}
                        step={100}
                        value={settings.maxTokens}
                        onChange={(e) => setSettings({ ...settings, maxTokens: Number.parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="temperature" className="text-sm">
                          温度 (创造性)
                        </Label>
                        <span className="text-xs text-gray-500">{settings.temperature.toFixed(1)}</span>
                      </div>
                      <input
                        id="temperature"
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={settings.temperature}
                        onChange={(e) => setSettings({ ...settings, temperature: Number.parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-timestamps" className="text-sm">
                        显示时间戳
                      </Label>
                      <input
                        id="show-timestamps"
                        type="checkbox"
                        checked={settings.showTimestamps}
                        onChange={(e) => setSettings({ ...settings, showTimestamps: e.target.checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="highlight-keywords" className="text-sm">
                        高亮关键词
                      </Label>
                      <input
                        id="highlight-keywords"
                        type="checkbox"
                        checked={settings.highlightKeywords}
                        onChange={(e) => setSettings({ ...settings, highlightKeywords: e.target.checked })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="glass-effect border-2 border-white/30 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">流式响应</CardTitle>
                </div>
                {streaming && !paused && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">正在流式传输...</span>
                  </div>
                )}
                {paused && (
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">已暂停</span>
                  </div>
                )}
              </div>
              <CardDescription className="text-gray-700 font-medium">AI 响应将实时流式展示</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`prose prose-sm max-w-none h-[500px] p-4 rounded-md overflow-y-auto ${
                  output ? "bg-white/50" : "bg-gray-50/30"
                } border border-gray-100`}
              >
                {settings.showTimestamps && streaming && (
                  <div className="text-xs text-gray-500 mb-2">开始时间: {new Date().toLocaleTimeString()}</div>
                )}

                {output ? (
                  <div className="whitespace-pre-wrap">{output}</div>
                ) : (
                  <div className="text-gray-500 italic">{loading ? "准备中..." : "输出将显示在这里..."}</div>
                )}

                {settings.showTimestamps && output && !streaming && (
                  <div className="text-xs text-gray-500 mt-4">完成时间: {new Date().toLocaleTimeString()}</div>
                )}

                {streaming && !paused && <span className="inline-block animate-pulse">▌</span>}
              </div>

              <div className="mt-4 text-xs text-gray-500">
                {output && (
                  <div className="flex items-center justify-between">
                    <span>约 {Math.ceil(output.length / 4)} 个标记</span>
                    <span>{Math.ceil(output.length / 800)} 秒预估阅读时间</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
