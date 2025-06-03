"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RealTimeChart } from "./real-time-chart"
import { AlertTriangle, CheckCircle, Clock, Cpu, Database, Globe, RefreshCw, TrendingUp, Users } from "lucide-react"

interface MetricData {
  timestamp: number
  value: number
  label?: string
}

interface SystemMetrics {
  responseTime: MetricData[]
  throughput: MetricData[]
  errorRate: MetricData[]
  activeUsers: MetricData[]
  cpuUsage: MetricData[]
  memoryUsage: MetricData[]
}

interface AlertItem {
  id: string
  type: "info" | "warning" | "error" | "critical"
  title: string
  message: string
  timestamp: number
  acknowledged: boolean
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    responseTime: [],
    throughput: [],
    errorRate: [],
    activeUsers: [],
    cpuUsage: [],
    memoryUsage: [],
  })

  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // 模拟实时数据生成
  useEffect(() => {
    const generateMetrics = () => {
      const now = Date.now()

      setMetrics((prev) => ({
        responseTime: [...prev.responseTime.slice(-49), { timestamp: now, value: 100 + Math.random() * 200 }],
        throughput: [...prev.throughput.slice(-49), { timestamp: now, value: 50 + Math.random() * 100 }],
        errorRate: [...prev.errorRate.slice(-49), { timestamp: now, value: Math.random() * 5 }],
        activeUsers: [...prev.activeUsers.slice(-49), { timestamp: now, value: 100 + Math.random() * 50 }],
        cpuUsage: [...prev.cpuUsage.slice(-49), { timestamp: now, value: 20 + Math.random() * 60 }],
        memoryUsage: [...prev.memoryUsage.slice(-49), { timestamp: now, value: 40 + Math.random() * 40 }],
      }))

      setLastUpdate(new Date())

      // 随机生成告警
      if (Math.random() < 0.1) {
        const alertTypes = ["info", "warning", "error", "critical"] as const
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

        const newAlert: AlertItem = {
          id: `alert-${Date.now()}`,
          type: alertType,
          title: `${alertType.toUpperCase()} 告警`,
          message: `检测到系统异常: ${alertType} 级别事件`,
          timestamp: now,
          acknowledged: false,
        }

        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])
      }
    }

    const interval = setInterval(generateMetrics, 2000)
    generateMetrics() // 立即生成一次

    return () => clearInterval(interval)
  }, [])

  // 手动刷新
  const handleRefresh = async () => {
    setIsLoading(true)
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setLastUpdate(new Date())
  }

  // 确认告警
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  // 获取告警图标
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  // 获取告警颜色
  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "error":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  // 计算当前值
  const getCurrentValue = (data: MetricData[]) => {
    return data.length > 0 ? data[data.length - 1].value : 0
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">监控仪表板</h2>
          <p className="text-muted-foreground">最后更新: {lastUpdate.toLocaleTimeString("zh-CN")}</p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">响应时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrentValue(metrics.responseTime).toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">平均响应时间</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">吞吐量</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrentValue(metrics.throughput).toFixed(0)}/s</div>
            <p className="text-xs text-muted-foreground">每秒请求数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">错误率</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrentValue(metrics.errorRate).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">错误请求比例</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrentValue(metrics.activeUsers).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">当前在线用户</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">性能监控</TabsTrigger>
          <TabsTrigger value="system">系统资源</TabsTrigger>
          <TabsTrigger value="alerts">告警中心</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeChart
              title="响应时间趋势"
              description="系统平均响应时间变化"
              data={metrics.responseTime}
              color="#3b82f6"
              unit="ms"
            />
            <RealTimeChart
              title="吞吐量趋势"
              description="每秒处理请求数量"
              data={metrics.throughput}
              color="#10b981"
              unit="/s"
            />
            <RealTimeChart
              title="错误率趋势"
              description="请求错误率变化"
              data={metrics.errorRate}
              color="#ef4444"
              unit="%"
            />
            <RealTimeChart
              title="活跃用户趋势"
              description="在线用户数量变化"
              data={metrics.activeUsers}
              color="#8b5cf6"
              unit=""
            />
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeChart
              title="CPU使用率"
              description="系统CPU使用率"
              data={metrics.cpuUsage}
              color="#f59e0b"
              unit="%"
            />
            <RealTimeChart
              title="内存使用率"
              description="系统内存使用率"
              data={metrics.memoryUsage}
              color="#06b6d4"
              unit="%"
            />
          </div>

          {/* 系统状态卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>CPU状态</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>使用率</span>
                    <span>{getCurrentValue(metrics.cpuUsage).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>状态</span>
                    <Badge variant={getCurrentValue(metrics.cpuUsage) > 80 ? "destructive" : "secondary"}>
                      {getCurrentValue(metrics.cpuUsage) > 80 ? "高负载" : "正常"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>内存状态</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>使用率</span>
                    <span>{getCurrentValue(metrics.memoryUsage).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>状态</span>
                    <Badge variant={getCurrentValue(metrics.memoryUsage) > 85 ? "destructive" : "secondary"}>
                      {getCurrentValue(metrics.memoryUsage) > 85 ? "内存紧张" : "正常"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>网络状态</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>延迟</span>
                    <span>{getCurrentValue(metrics.responseTime).toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>状态</span>
                    <Badge variant="secondary">正常</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>实时告警</span>
                <Badge variant="outline">{alerts.filter((a) => !a.acknowledged).length} 未处理</Badge>
              </CardTitle>
              <CardDescription>系统告警和异常事件监控</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>暂无告警信息</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                        alert.acknowledged ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm mt-1">{alert.message}</p>
                            <p className="text-xs mt-2 opacity-75">
                              {new Date(alert.timestamp).toLocaleString("zh-CN")}
                            </p>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                            确认
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
