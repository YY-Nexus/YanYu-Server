"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, MessageSquare, Activity } from "lucide-react"

interface IntegrationStatus {
  wechat: boolean
  slack: boolean
  discord: boolean
  datadog: boolean
  newrelic: boolean
}

interface TestResult {
  success: boolean
  message: string
  results?: Record<string, boolean>
  integration?: string
}

export function IntegrationTestPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    wechat: true,
    slack: false,
    discord: false,
    datadog: false,
    newrelic: false,
  })

  // 获取集成状态
  const fetchIntegrationStatus = async () => {
    try {
      // 使用环境变量或当前域名构建完整URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")
      const response = await fetch(`${baseUrl}/api/monitoring/test-integrations`)

      if (!response.ok) {
        throw new Error("获取集成状态失败")
      }

      const data = await response.json()
      setIntegrationStatus(
        data.integrations || {
          wechat: true,
          slack: false,
          discord: false,
          datadog: false,
          newrelic: false,
        },
      )
    } catch (error) {
      console.error("获取集成状态失败:", error)
      // 设置默认状态，避免构建失败
      setIntegrationStatus({
        wechat: true,
        slack: false,
        discord: false,
        datadog: false,
        newrelic: false,
      })
    }
  }

  // 测试特定集成
  const testIntegration = async (integration: string) => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")
      const response = await fetch(`${baseUrl}/api/monitoring/test-integrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ integration }),
      })

      const result = await response.json()
      setTestResult(result)

      // 如果是企业微信测试，显示特殊提示
      if (integration === "wechat" && result.success) {
        setTestResult({
          ...result,
          message: "✅ 企业微信集成测试成功！请检查您的企业微信群是否收到测试消息。",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `测试失败: ${error instanceof Error ? error.message : "未知错误"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 发送模拟告警
  const sendMockAlert = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")
      const response = await fetch(`${baseUrl}/api/monitoring/test-integrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          integration: "mock-alert",
        }),
      })

      const result = await response.json()
      setTestResult({
        ...result,
        message: "🚨 模拟告警已发送！请检查您配置的告警渠道。",
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: `发送模拟告警失败: ${error instanceof Error ? error.message : "未知错误"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 页面加载时获取集成状态
  useEffect(() => {
    // 只在客户端环境中获取集成状态
    if (typeof window !== "undefined") {
      fetchIntegrationStatus()
    }
  }, [])

  const integrationInfo = {
    wechat: {
      name: "企业微信",
      icon: MessageSquare,
      description: "企业微信群机器人告警通知",
      color: "bg-green-500",
    },
    slack: {
      name: "Slack",
      icon: MessageSquare,
      description: "Slack频道告警通知",
      color: "bg-purple-500",
    },
    discord: {
      name: "Discord",
      icon: MessageSquare,
      description: "Discord频道告警通知",
      color: "bg-indigo-500",
    },
    datadog: {
      name: "DataDog",
      icon: Activity,
      description: "DataDog监控平台集成",
      color: "bg-orange-500",
    },
    newrelic: {
      name: "New Relic",
      icon: Activity,
      description: "New Relic APM监控",
      color: "bg-blue-500",
    },
  }

  return (
    <div className="space-y-6">
      {/* 集成状态展示 */}
      <div>
        <h3 className="text-sm font-medium mb-3">已配置的集成</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(integrationStatus).map(([key, status]) => {
            const info = integrationInfo[key as keyof typeof integrationInfo]
            if (!info) return null

            const Icon = info.icon
            return (
              <div key={key} className="flex items-center gap-3 p-3 glass-effect rounded-lg">
                <div className={`p-2 rounded-full ${info.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{info.name}</div>
                  <div className="text-xs text-muted-foreground">{info.description}</div>
                </div>
                <Badge variant={status ? "default" : "secondary"}>{status ? "已配置" : "未配置"}</Badge>
              </div>
            )
          })}
        </div>
      </div>

      {/* 测试按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => testIntegration("wechat")} disabled={isLoading} className="unified-button">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          测试企业微信集成
        </Button>

        <Button onClick={() => testIntegration("all")} disabled={isLoading} className="unified-button">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          测试所有集成
        </Button>

        <Button onClick={sendMockAlert} disabled={isLoading} className="unified-button">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          发送模拟告警
        </Button>

        <Button onClick={fetchIntegrationStatus} disabled={isLoading} className="unified-button">
          刷新状态
        </Button>
      </div>

      {/* 测试结果 */}
      {testResult && (
        <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className="text-sm">{testResult.message}</AlertDescription>
          </div>

          {testResult.results && (
            <div className="mt-3 space-y-1">
              <div className="text-xs font-medium text-muted-foreground">详细结果:</div>
              {Object.entries(testResult.results).map(([integration, success]) => (
                <div key={integration} className="flex items-center gap-2 text-xs">
                  {success ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-600" />
                  )}
                  <span>{integrationInfo[integration as keyof typeof integrationInfo]?.name || integration}</span>
                  <Badge variant={success ? "default" : "destructive"} className="text-xs">
                    {success ? "成功" : "失败"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Alert>
      )}

      {/* 企业微信配置提示 */}
      {integrationStatus.wechat && (
        <Alert className="border-green-200 bg-green-50">
          <MessageSquare className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm">
            <strong>企业微信集成已配置</strong>
            <br />
            Webhook URL:{" "}
            <code className="text-xs bg-white px-1 rounded">
              https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4cd4***
            </code>
            <br />
            点击"测试企业微信集成"按钮，您的企业微信群将收到测试消息。
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
