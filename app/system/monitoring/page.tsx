"use client"

import type { Viewport } from "next"
import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { MonitoringDashboard } from "@/components/ui/monitoring-dashboard"
import { RealTimeChart } from "@/components/ui/real-time-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  RefreshCw,
} from "lucide-react"

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

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: number
  requests: number
  errors: number
  responseTime: number
}

interface AlertItem {
  id: string
  type: "error" | "warning" | "info"
  message: string
  timestamp: string
  resolved: boolean
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
    uptime: 99.8,
    requests: 1250,
    errors: 3,
    responseTime: 245,
  })

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      type: "warning",
      message: "CPU使用率超过80%",
      timestamp: "2024-01-15 14:30:00",
      resolved: false,
    },
    {
      id: "2",
      type: "error",
      message: "数据库连接失败",
      timestamp: "2024-01-15 14:25:00",
      resolved: true,
    },
    {
      id: "3",
      type: "info",
      message: "系统更新完成",
      timestamp: "2024-01-15 14:20:00",
      resolved: true,
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        requests: prev.requests + Math.floor(Math.random() * 10),
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 50),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // 刷新数据
  const refreshData = async () => {
    setIsRefreshing(true)
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  // 获取状态颜色
  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-600"
    if (value >= thresholds.warning) return "text-yellow-600"
    return "text-green-600"
  }

  // 获取状态图标
  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="h-4 w-4 text-red-600" />
    if (value >= thresholds.warning) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  // 获取告警类型颜色
  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold rainbow-text">系统监控</h1>
            <p className="text-muted-foreground mt-2">实时监控系统状态与性能指标</p>
          </div>
          <Button onClick={refreshData} disabled={isRefreshing} className="unified-button">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            刷新数据
          </Button>
        </div>

        {/* 系统状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPU使用率</p>
                  <p className={`text-2xl font-bold ${getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}`}>
                    {metrics.cpu.toFixed(1)}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metrics.cpu, { warning: 70, critical: 90 })}
                  <Cpu className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">内存使用率</p>
                  <p className={`text-2xl font-bold ${getStatusColor(metrics.memory, { warning: 80, critical: 95 })}`}>
                    {metrics.memory.toFixed(1)}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metrics.memory, { warning: 80, critical: 95 })}
                  <MemoryStick className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">磁盘使用率</p>
                  <p className={`text-2xl font-bold ${getStatusColor(metrics.disk, { warning: 85, critical: 95 })}`}>
                    {metrics.disk.toFixed(1)}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metrics.disk, { warning: 85, critical: 95 })}
                  <HardDrive className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">网络使用率</p>
                  <p className={`text-2xl font-bold ${getStatusColor(metrics.network, { warning: 80, critical: 95 })}`}>
                    {metrics.network.toFixed(1)}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metrics.network, { warning: 80, critical: 95 })}
                  <Wifi className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 性能指标 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">系统正常运行时间</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.uptime}%</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总请求数</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.requests.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">错误数量</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.errors}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">平均响应时间</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.responseTime.toFixed(0)}ms</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="dashboard">监控面板</TabsTrigger>
            <TabsTrigger value="charts">实时图表</TabsTrigger>
            <TabsTrigger value="alerts">告警管理</TabsTrigger>
            <TabsTrigger value="logs">系统日志</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MonitoringDashboard />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    CPU使用率趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeChart
                    data={[
                      { time: "14:00", value: 45 },
                      { time: "14:05", value: 52 },
                      { time: "14:10", value: 48 },
                      { time: "14:15", value: 55 },
                      { time: "14:20", value: 62 },
                      { time: "14:25", value: 58 },
                      { time: "14:30", value: metrics.cpu },
                    ]}
                    color="#3b82f6"
                    label="CPU使用率 (%)"
                  />
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    内存使用率趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeChart
                    data={[
                      { time: "14:00", value: 58 },
                      { time: "14:05", value: 61 },
                      { time: "14:10", value: 59 },
                      { time: "14:15", value: 64 },
                      { time: "14:20", value: 67 },
                      { time: "14:25", value: 65 },
                      { time: "14:30", value: metrics.memory },
                    ]}
                    color="#10b981"
                    label="内存使用率 (%)"
                  />
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    请求量趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeChart
                    data={[
                      { time: "14:00", value: 1180 },
                      { time: "14:05", value: 1195 },
                      { time: "14:10", value: 1205 },
                      { time: "14:15", value: 1220 },
                      { time: "14:20", value: 1235 },
                      { time: "14:25", value: 1242 },
                      { time: "14:30", value: metrics.requests },
                    ]}
                    color="#f59e0b"
                    label="请求数量"
                  />
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    响应时间趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeChart
                    data={[
                      { time: "14:00", value: 220 },
                      { time: "14:05", value: 235 },
                      { time: "14:10", value: 228 },
                      { time: "14:15", value: 242 },
                      { time: "14:20", value: 255 },
                      { time: "14:25", value: 248 },
                      { time: "14:30", value: metrics.responseTime },
                    ]}
                    color="#8b5cf6"
                    label="响应时间 (ms)"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  系统告警
                  <Badge variant="outline">{alerts.filter((a) => !a.resolved).length} 未解决</Badge>
                </CardTitle>
                <CardDescription>查看和管理系统告警信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                        alert.resolved ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.type === "error"
                                ? "text-red-600"
                                : alert.type === "warning"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm opacity-75">{alert.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.resolved ? "outline" : "default"}>
                            {alert.resolved ? "已解决" : "未解决"}
                          </Badge>
                          {!alert.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, resolved: true } : a)))
                              }}
                            >
                              标记为已解决
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  系统日志
                </CardTitle>
                <CardDescription>查看系统运行日志和事件记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto">
                  <div>[2024-01-15 14:30:15] INFO: System health check completed successfully</div>
                  <div>[2024-01-15 14:30:10] INFO: AI model gpt-4o responded in 1.2s</div>
                  <div>[2024-01-15 14:30:05] WARN: CPU usage exceeded 80% threshold</div>
                  <div>[2024-01-15 14:30:00] INFO: New user session started</div>
                  <div>[2024-01-15 14:29:55] INFO: Database connection pool refreshed</div>
                  <div>[2024-01-15 14:29:50] INFO: Cache cleared successfully</div>
                  <div>[2024-01-15 14:29:45] ERROR: Failed to connect to external monitoring service</div>
                  <div>[2024-01-15 14:29:40] INFO: Security audit completed</div>
                  <div>[2024-01-15 14:29:35] INFO: AI collaboration task completed</div>
                  <div>[2024-01-15 14:29:30] INFO: System startup completed</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
