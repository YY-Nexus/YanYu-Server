"use client"

import type { Viewport } from "next"
import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { IntegrationTestPanel } from "@/components/integration-test-panel"
import {
  Settings,
  MessageSquare,
  Activity,
  Database,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

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

interface Integration {
  id: string
  name: string
  type: "messaging" | "monitoring" | "database" | "security" | "ai"
  status: "active" | "inactive" | "error"
  description: string
  icon: any
  color: string
  config: Record<string, any>
  lastSync?: string
  metrics?: {
    requests: number
    errors: number
    uptime: number
  }
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // 初始化集成数据
  useEffect(() => {
    const mockIntegrations: Integration[] = [
      {
        id: "wechat",
        name: "企业微信",
        type: "messaging",
        status: "active",
        description: "企业微信群机器人告警通知",
        icon: MessageSquare,
        color: "bg-green-500",
        config: {
          webhookUrl: process.env.WECHAT_WEBHOOK_URL || "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=***",
          enabled: true,
        },
        lastSync: "2024-01-15 14:30:00",
        metrics: {
          requests: 1250,
          errors: 2,
          uptime: 99.8,
        },
      },
      {
        id: "datadog",
        name: "DataDog",
        type: "monitoring",
        status: process.env.DATADOG_API_KEY ? "active" : "inactive",
        description: "应用性能监控和日志分析",
        icon: Activity,
        color: "bg-orange-500",
        config: {
          apiKey: process.env.DATADOG_API_KEY || "",
          enabled: !!process.env.DATADOG_API_KEY,
        },
        lastSync: "2024-01-15 14:25:00",
        metrics: {
          requests: 5680,
          errors: 12,
          uptime: 99.9,
        },
      },
      {
        id: "slack",
        name: "Slack",
        type: "messaging",
        status: process.env.SLACK_WEBHOOK_URL ? "active" : "inactive",
        description: "Slack频道告警通知",
        icon: MessageSquare,
        color: "bg-purple-500",
        config: {
          webhookUrl: process.env.SLACK_WEBHOOK_URL || "",
          enabled: !!process.env.SLACK_WEBHOOK_URL,
        },
        lastSync: "2024-01-15 14:20:00",
        metrics: {
          requests: 890,
          errors: 1,
          uptime: 99.9,
        },
      },
      {
        id: "newrelic",
        name: "New Relic",
        type: "monitoring",
        status: process.env.NEW_RELIC_API_KEY ? "active" : "inactive",
        description: "应用性能监控和错误追踪",
        icon: Activity,
        color: "bg-blue-500",
        config: {
          apiKey: process.env.NEW_RELIC_API_KEY || "",
          enabled: !!process.env.NEW_RELIC_API_KEY,
        },
        lastSync: "2024-01-15 14:15:00",
        metrics: {
          requests: 3420,
          errors: 8,
          uptime: 99.7,
        },
      },
      {
        id: "discord",
        name: "Discord",
        type: "messaging",
        status: process.env.DISCORD_WEBHOOK_URL ? "active" : "inactive",
        description: "Discord频道告警通知",
        icon: MessageSquare,
        color: "bg-indigo-500",
        config: {
          webhookUrl: process.env.DISCORD_WEBHOOK_URL || "",
          enabled: !!process.env.DISCORD_WEBHOOK_URL,
        },
        lastSync: "2024-01-15 14:10:00",
        metrics: {
          requests: 456,
          errors: 0,
          uptime: 100,
        },
      },
    ]

    setIntegrations(mockIntegrations)
  }, [])

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />
    }
  }

  // 切换集成状态
  const toggleIntegration = async (integrationId: string) => {
    setIsLoading(true)
    try {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? {
                ...integration,
                status: integration.status === "active" ? "inactive" : "active",
                config: {
                  ...integration.config,
                  enabled: integration.status !== "active",
                },
              }
            : integration,
        ),
      )

      toast({
        title: "集成状态已更新",
        description: "集成配置已成功保存",
      })
    } catch (error) {
      toast({
        title: "更新失败",
        description: "无法更新集成状态，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 刷新集成数据
  const refreshIntegrations = async () => {
    setIsLoading(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "数据已刷新",
        description: "集成状态已更新",
      })
    } catch (error) {
      toast({
        title: "刷新失败",
        description: "无法刷新集成数据",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 按类型分组集成
  const groupedIntegrations = integrations.reduce(
    (acc, integration) => {
      if (!acc[integration.type]) {
        acc[integration.type] = []
      }
      acc[integration.type].push(integration)
      return acc
    },
    {} as Record<string, Integration[]>,
  )

  const typeLabels = {
    messaging: "消息通知",
    monitoring: "监控分析",
    database: "数据存储",
    security: "安全防护",
    ai: "AI服务",
  }

  const typeIcons = {
    messaging: MessageSquare,
    monitoring: Activity,
    database: Database,
    security: Shield,
    ai: Zap,
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold rainbow-text">集成管理</h1>
            <p className="text-muted-foreground mt-2">管理和配置第三方服务集成</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={refreshIntegrations} disabled={isLoading} className="unified-button">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              刷新
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="unified-button">
              <Plus className="h-4 w-4 mr-2" />
              添加集成
            </Button>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总集成数</p>
                  <p className="text-2xl font-bold">{integrations.length}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">活跃集成</p>
                  <p className="text-2xl font-bold text-green-600">
                    {integrations.filter((i) => i.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">错误集成</p>
                  <p className="text-2xl font-bold text-red-600">
                    {integrations.filter((i) => i.status === "error").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">平均正常运行时间</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(
                      integrations.filter((i) => i.metrics).reduce((sum, i) => sum + (i.metrics?.uptime || 0), 0) /
                      integrations.filter((i) => i.metrics).length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="overview">集成概览</TabsTrigger>
            <TabsTrigger value="testing">集成测试</TabsTrigger>
            <TabsTrigger value="settings">配置管理</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {Object.entries(groupedIntegrations).map(([type, typeIntegrations]) => {
              const TypeIcon = typeIcons[type as keyof typeof typeIcons]
              return (
                <Card key={type} className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TypeIcon className="h-5 w-5" />
                      {typeLabels[type as keyof typeof typeLabels]}
                      <Badge variant="outline">{typeIntegrations.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {typeIntegrations.map((integration) => {
                        const IconComponent = integration.icon
                        return (
                          <Card key={integration.id} className="glass-effect border">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`p-2 rounded-lg ${integration.color}`}>
                                    <IconComponent className="h-4 w-4 text-white" />
                                  </div>
                                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(integration.status)}
                                  <Badge className={getStatusColor(integration.status)}>
                                    {integration.status === "active"
                                      ? "活跃"
                                      : integration.status === "inactive"
                                        ? "未激活"
                                        : "错误"}
                                  </Badge>
                                </div>
                              </div>
                              <CardDescription>{integration.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {integration.metrics && (
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                  <div className="text-center">
                                    <div className="font-semibold">{integration.metrics.requests}</div>
                                    <div className="text-muted-foreground">请求数</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold">{integration.metrics.errors}</div>
                                    <div className="text-muted-foreground">错误数</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold">{integration.metrics.uptime}%</div>
                                    <div className="text-muted-foreground">正常运行</div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`toggle-${integration.id}`} className="text-sm">
                                    启用集成
                                  </Label>
                                  <Switch
                                    id={`toggle-${integration.id}`}
                                    checked={integration.status === "active"}
                                    onCheckedChange={() => toggleIntegration(integration.id)}
                                    disabled={isLoading}
                                  />
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(integration)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  配置
                                </Button>
                              </div>

                              {integration.lastSync && (
                                <div className="text-xs text-muted-foreground">最后同步: {integration.lastSync}</div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <IntegrationTestPanel integrations={integrations} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>全局集成设置</CardTitle>
                <CardDescription>配置集成的全局参数和默认行为</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="retry-attempts">重试次数</Label>
                      <Input id="retry-attempts" type="number" defaultValue="3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeout">超时时间 (秒)</Label>
                      <Input id="timeout" type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batch-size">批处理大小</Label>
                      <Input id="batch-size" type="number" defaultValue="100" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-retry">自动重试</Label>
                      <Switch id="auto-retry" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="circuit-breaker">熔断器</Label>
                      <Switch id="circuit-breaker" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rate-limiting">速率限制</Label>
                      <Switch id="rate-limiting" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="health-check">健康检查</Label>
                      <Switch id="health-check" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>保存设置</Button>
                </div>
              </CardContent>
            </Card>

            {/* 环境变量配置提示 */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                某些集成需要配置环境变量才能正常工作。请确保在部署环境中设置了相应的API密钥和Webhook URL。
                <Button variant="link" className="p-0 h-auto ml-2">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  查看配置文档
                </Button>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
