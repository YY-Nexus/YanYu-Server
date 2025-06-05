"use client"

import type { Viewport } from "next"
// import { defaultViewport } from "@/lib/viewport"

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

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MonitoringDashboard } from "@/components/ui/monitoring-dashboard"
import { RealTimeChart } from "@/components/ui/real-time-chart"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  TrendingUp,
  Zap,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SystemHealth {
  overall: "healthy" | "warning" | "critical"
  services: {
    api: "online" | "offline" | "degraded"
    database: "online" | "offline" | "degraded"
    cache: "online" | "offline" | "degraded"
    ai: "online" | "offline" | "degraded"
  }
  metrics: {
    cpu: number
    memory: number
    disk: number
    network: number
    uptime: number
    responseTime: number
  }
  alerts: number
  lastCheck: string
}

interface PerformanceMetric {
  timestamp: number
  value: number
  label?: string
}

export default function MonitoringPage() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: "healthy",
    services: {
      api: "online",
      database: "online",
      cache: "online",
      ai: "online",
    },
    metrics: {
      cpu: 35,
      memory: 68,
      disk: 45,
      network: 12,
      uptime: 99.9,
      responseTime: 120,
    },
    alerts: 2,
    lastCheck: new Date().toLocaleString("zh-CN"),
  })

  const [performanceData, setPerformanceData] = useState<{
    cpu: PerformanceMetric[]
    memory: PerformanceMetric[]
    network: PerformanceMetric[]
    requests: PerformanceMetric[]
  }>({
    cpu: [],
    memory: [],
    network: [],
    requests: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // 生成实时性能数据
  useEffect(() => {
    const generateData = () => {
      const now = Date.now()
      setPerformanceData((prev) => ({
        cpu: [...prev.cpu.slice(-49), { timestamp: now, value: 20 + Math.random() * 60 }],
        memory: [...prev.memory.slice(-49), { timestamp: now, value: 40 + Math.random() * 40 }],
        network: [...prev.network.slice(-49), { timestamp: now, value: Math.random() * 100 }],
        requests: [...prev.requests.slice(-49), { timestamp: now, value: 50 + Math.random() * 100 }],
      }))

      // 更新系统健康状态
      setSystemHealth((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          cpu: 20 + Math.random() * 60,
          memory: 40 + Math.random() * 40,
          network: Math.random() * 100,
          responseTime: 80 + Math.random() * 80,
        },
        lastCheck: new Date().toLocaleString("zh-CN"),
      }))
    }

    generateData() // 立即生成一次
    const interval = autoRefresh ? setInterval(generateData, 3000) : null

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  // 手动刷新
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 调用监控API
      const response = await fetch("/api/monitoring/metrics")
      if (response.ok) {
        const data = await response.json()
        toast({
          title: "监控数据已刷新",
          description: `最后更新: ${new Date().toLocaleTimeString("zh-CN")}`,
        })
      }
    } catch (error) {
      toast({
        title: "刷新失败",
        description: "无法获取最新监控数据",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 获取服务状态颜色
  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200"
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "offline":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // 获取服务状态图标
  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  // 获取整体健康状态
  const getOverallHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const serviceLabels = {
    api: "API服务",
    database: "数据库",
    cache: "缓存服务",
    ai: "AI服务",
  }

  const serviceIcons = {
    api: Server,
    database: Database,
    cache: MemoryStick,
    ai: Zap,
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold rainbow-text">系统监控</h1>
            <p className="text-muted-foreground mt-2">实时监控系统性能和健康状态</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="unified-button"
            >
              <Activity className="h-4 w-4 mr-2" />
              {autoRefresh ? "自动刷新" : "手动模式"}
            </Button>
            <Button onClick={handleRefresh} disabled={isLoading} className="unified-button">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              刷新
            </Button>
          </div>
        </div>

        {/* 系统健康概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">系统状态</p>
                  <p className={`text-2xl font-bold ${getOverallHealthColor(systemHealth.overall)}`}>
                    {systemHealth.overall === "healthy" ? "健康" : systemHealth.overall === "warning" ? "警告" : "严重"}
                  </p>
                </div>
                <CheckCircle className={`h-8 w-8 ${getOverallHealthColor(systemHealth.overall)}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">正常运行时间</p>
                  <p className="text-2xl font-bold text-green-600">{systemHealth.metrics.uptime}%</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">响应时间</p>
                  <p className="text-2xl font-bold text-blue-600">{systemHealth.metrics.responseTime}ms</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">活跃告警</p>
                  <p className="text-2xl font-bold text-red-600">{systemHealth.alerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 服务状态 */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              服务状态
            </CardTitle>
            <CardDescription>各个核心服务的运行状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemHealth.services).map(([service, status]) => {
                const ServiceIcon = serviceIcons[service as keyof typeof serviceIcons]
                return (
                  <div key={service} className="flex items-center gap-3 p-4 rounded-lg border card-hover">
                    <div className="p-2 rounded-full bg-blue-100">
                      <ServiceIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{serviceLabels[service as keyof typeof serviceLabels]}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getServiceStatusIcon(status)}
                        <Badge className={getServiceStatusColor(status)}>
                          {status === "online" ? "在线" : status === "degraded" ? "降级" : "离线"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 系统资源使用情况 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">CPU使用率</span>
                </div>
                <span className="text-2xl font-bold">{systemHealth.metrics.cpu.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemHealth.metrics.cpu}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">内存使用率</span>
                </div>
                <span className="text-2xl font-bold">{systemHealth.metrics.memory.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemHealth.metrics.memory}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-green-500" />
                  <span className="font-medium">磁盘使用率</span>
                </div>
                <span className="text-2xl font-bold">{systemHealth.metrics.disk.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemHealth.metrics.disk}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">网络使用率</span>
                </div>
                <span className="text-2xl font-bold">{systemHealth.metrics.network.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemHealth.metrics.network}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">监控仪表板</TabsTrigger>
            <TabsTrigger value="performance">性能分析</TabsTrigger>
            <TabsTrigger value="logs">日志分析</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MonitoringDashboard />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealTimeChart
                title="CPU使用率趋势"
                description="系统CPU使用率实时监控"
                data={performanceData.cpu}
                color="#f59e0b"
                unit="%"
              />
              <RealTimeChart
                title="内存使用率趋势"
                description="系统内存使用率实时监控"
                data={performanceData.memory}
                color="#3b82f6"
                unit="%"
              />
              <RealTimeChart
                title="网络流量趋势"
                description="网络带宽使用情况"
                data={performanceData.network}
                color="#8b5cf6"
                unit="MB/s"
              />
              <RealTimeChart
                title="请求处理趋势"
                description="每秒处理的请求数量"
                data={performanceData.requests}
                color="#10b981"
                unit="/s"
              />
            </div>

            {/* 性能建议 */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  性能建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemHealth.metrics.cpu > 80 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        CPU使用率较高 ({systemHealth.metrics.cpu.toFixed(1)}%)，建议检查高负载进程或考虑扩容。
                      </AlertDescription>
                    </Alert>
                  )}
                  {systemHealth.metrics.memory > 85 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        内存使用率较高 ({systemHealth.metrics.memory.toFixed(1)}%)，建议优化内存使用或增加内存容量。
                      </AlertDescription>
                    </Alert>
                  )}
                  {systemHealth.metrics.responseTime > 200 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        响应时间较慢 ({systemHealth.metrics.responseTime}ms)，建议检查数据库查询和网络连接。
                      </AlertDescription>
                    </Alert>
                  )}
                  {systemHealth.metrics.cpu < 50 &&
                    systemHealth.metrics.memory < 70 &&
                    systemHealth.metrics.responseTime < 150 && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription>系统性能良好，所有指标都在正常范围内。</AlertDescription>
                      </Alert>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>系统日志</CardTitle>
                <CardDescription>最近的系统事件和错误日志</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">系统启动完成</div>
                      <div className="text-xs text-muted-foreground">2024-01-15 14:30:25</div>
                    </div>
                    <Badge variant="outline">INFO</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">数据库连接池达到80%</div>
                      <div className="text-xs text-muted-foreground">2024-01-15 14:28:15</div>
                    </div>
                    <Badge variant="outline">WARNING</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">AI模型加载成功</div>
                      <div className="text-xs text-muted-foreground">2024-01-15 14:25:10</div>
                    </div>
                    <Badge variant="outline">INFO</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">外部API调用超时</div>
                      <div className="text-xs text-muted-foreground">2024-01-15 14:20:05</div>
                    </div>
                    <Badge variant="destructive">ERROR</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 最后更新时间 */}
        <div className="text-center text-sm text-muted-foreground">最后更新: {systemHealth.lastCheck}</div>
      </div>
    </MainLayout>
  )
}
