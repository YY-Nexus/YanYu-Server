interface MonitoringEvent {
  type: string
  level: "info" | "warning" | "error" | "critical"
  message: string
  metadata?: Record<string, any>
  timestamp: number
  source: string
}

interface AlertRule {
  id: string
  name: string
  condition: (event: MonitoringEvent) => boolean
  channels: string[]
  cooldown: number // 冷却时间（毫秒）
  enabled: boolean
}

/**
 * 外部监控集成管理器
 */
export class ExternalMonitoringIntegration {
  private alertRules: AlertRule[] = []
  private lastAlertTimes: Map<string, number> = new Map()
  private integrationEndpoints: Map<string, string> = new Map()

  constructor() {
    this.initializeIntegrations()
    this.setupDefaultAlertRules()
  }

  /**
   * 初始化外部集成
   */
  private initializeIntegrations(): void {
    // DataDog集成
    if (process.env.DATADOG_API_KEY) {
      this.integrationEndpoints.set("datadog", "https://api.datadoghq.com/api/v1/events")
    }

    // New Relic集成
    if (process.env.NEW_RELIC_API_KEY) {
      this.integrationEndpoints.set("newrelic", "https://api.newrelic.com/v2/applications")
    }

    // Slack集成
    if (process.env.SLACK_WEBHOOK_URL) {
      this.integrationEndpoints.set("slack", process.env.SLACK_WEBHOOK_URL)
    }

    // Discord集成
    if (process.env.DISCORD_WEBHOOK_URL) {
      this.integrationEndpoints.set("discord", process.env.DISCORD_WEBHOOK_URL)
    }

    // 企业微信集成
    if (process.env.WECHAT_WEBHOOK_URL) {
      this.integrationEndpoints.set("wechat", process.env.WECHAT_WEBHOOK_URL)
    }

    console.log(`已初始化 ${this.integrationEndpoints.size} 个外部监控集成`)
  }

  /**
   * 设置默认告警规则
   */
  private setupDefaultAlertRules(): void {
    this.alertRules = [
      {
        id: "security-threat",
        name: "安全威胁检测",
        condition: (event) => event.type === "SECURITY_AUDIT" && event.level === "critical",
        channels: ["slack", "wechat", "discord"],
        cooldown: 300000, // 5分钟
        enabled: true,
      },
      {
        id: "system-error",
        name: "系统错误",
        condition: (event) => event.level === "error" && event.type.includes("ERROR"),
        channels: ["slack", "datadog"],
        cooldown: 60000, // 1分钟
        enabled: true,
      },
      {
        id: "performance-degradation",
        name: "性能下降",
        condition: (event) => event.metadata?.latency && event.metadata.latency > 5000, // 超过5秒
        channels: ["newrelic", "slack"],
        cooldown: 180000, // 3分钟
        enabled: true,
      },
      {
        id: "ai-model-failure",
        name: "AI模型故障",
        condition: (event) => event.type === "AI_EXECUTION" && event.level === "error",
        channels: ["slack", "wechat"],
        cooldown: 120000, // 2分钟
        enabled: true,
      },
    ]
  }

  /**
   * 发送监控事件
   */
  async sendEvent(event: MonitoringEvent): Promise<void> {
    try {
      // 检查告警规则
      for (const rule of this.alertRules) {
        if (rule.enabled && rule.condition(event)) {
          await this.triggerAlert(rule, event)
        }
      }

      // 发送到所有集成的监控系统
      const promises = []

      // DataDog
      if (this.integrationEndpoints.has("datadog")) {
        promises.push(this.sendToDataDog(event))
      }

      // New Relic
      if (this.integrationEndpoints.has("newrelic")) {
        promises.push(this.sendToNewRelic(event))
      }

      await Promise.allSettled(promises)
    } catch (error) {
      console.error("发送监控事件失败:", error)
    }
  }

  /**
   * 触发告警
   */
  private async triggerAlert(rule: AlertRule, event: MonitoringEvent): Promise<void> {
    const now = Date.now()
    const lastAlertTime = this.lastAlertTimes.get(rule.id) || 0

    // 检查冷却时间
    if (now - lastAlertTime < rule.cooldown) {
      return
    }

    this.lastAlertTimes.set(rule.id, now)

    // 发送到指定渠道
    const promises = rule.channels.map((channel) => this.sendAlert(channel, rule, event))
    await Promise.allSettled(promises)
  }

  /**
   * 发送告警到指定渠道
   */
  private async sendAlert(channel: string, rule: AlertRule, event: MonitoringEvent): Promise<void> {
    try {
      switch (channel) {
        case "slack":
          await this.sendToSlack(event, rule)
          break
        case "discord":
          await this.sendToDiscord(event, rule)
          break
        case "wechat":
          await this.sendToWeChat(event, rule)
          break
        default:
          console.warn(`未知的告警渠道: ${channel}`)
      }
    } catch (error) {
      console.error(`发送告警到 ${channel} 失败:`, error)
    }
  }

  /**
   * 发送到DataDog
   */
  private async sendToDataDog(event: MonitoringEvent): Promise<void> {
    const endpoint = this.integrationEndpoints.get("datadog")
    if (!endpoint || !process.env.DATADOG_API_KEY) return

    const payload = {
      title: `YYC³-Nettcak: ${event.type}`,
      text: event.message,
      date_happened: Math.floor(event.timestamp / 1000),
      priority: event.level === "critical" ? "high" : "normal",
      tags: [
        `source:${event.source}`,
        `level:${event.level}`,
        `environment:${process.env.VERCEL_ENV || "development"}`,
      ],
      alert_type: event.level === "error" || event.level === "critical" ? "error" : "info",
    }

    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": process.env.DATADOG_API_KEY,
      },
      body: JSON.stringify(payload),
    })
  }

  /**
   * 发送到New Relic
   */
  private async sendToNewRelic(event: MonitoringEvent): Promise<void> {
    if (!process.env.NEW_RELIC_API_KEY) return

    const payload = {
      eventType: "YYCNettcakEvent",
      type: event.type,
      level: event.level,
      message: event.message,
      source: event.source,
      timestamp: event.timestamp,
      environment: process.env.VERCEL_ENV || "development",
      ...event.metadata,
    }

    await fetch("https://insights-collector.newrelic.com/v1/accounts/YOUR_ACCOUNT_ID/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Insert-Key": process.env.NEW_RELIC_API_KEY,
      },
      body: JSON.stringify(payload),
    })
  }

  /**
   * 发送到Slack
   */
  private async sendToSlack(event: MonitoringEvent, rule: AlertRule): Promise<void> {
    const webhookUrl = this.integrationEndpoints.get("slack")
    if (!webhookUrl) return

    const color = {
      info: "#36a64f",
      warning: "#ff9500",
      error: "#ff0000",
      critical: "#8b0000",
    }[event.level]

    const payload = {
      username: "YYC³-Nettcak 监控",
      icon_emoji: ":robot_face:",
      attachments: [
        {
          color,
          title: `🚨 ${rule.name}`,
          text: event.message,
          fields: [
            {
              title: "事件类型",
              value: event.type,
              short: true,
            },
            {
              title: "严重级别",
              value: event.level.toUpperCase(),
              short: true,
            },
            {
              title: "来源",
              value: event.source,
              short: true,
            },
            {
              title: "时间",
              value: new Date(event.timestamp).toLocaleString("zh-CN"),
              short: true,
            },
          ],
          footer: "YYC³-Nettcak AI协同平台",
          ts: Math.floor(event.timestamp / 1000),
        },
      ],
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  }

  /**
   * 发送到Discord
   */
  private async sendToDiscord(event: MonitoringEvent, rule: AlertRule): Promise<void> {
    const webhookUrl = this.integrationEndpoints.get("discord")
    if (!webhookUrl) return

    const color = {
      info: 0x36a64f,
      warning: 0xff9500,
      error: 0xff0000,
      critical: 0x8b0000,
    }[event.level]

    const payload = {
      username: "YYC³-Nettcak 监控",
      avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
      embeds: [
        {
          title: `🚨 ${rule.name}`,
          description: event.message,
          color,
          fields: [
            {
              name: "事件类型",
              value: event.type,
              inline: true,
            },
            {
              name: "严重级别",
              value: event.level.toUpperCase(),
              inline: true,
            },
            {
              name: "来源",
              value: event.source,
              inline: true,
            },
          ],
          timestamp: new Date(event.timestamp).toISOString(),
          footer: {
            text: "YYC³-Nettcak AI协同平台",
          },
        },
      ],
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  }

  /**
   * 发送到企业微信
   */
  private async sendToWeChat(event: MonitoringEvent, rule: AlertRule): Promise<void> {
    const webhookUrl = this.integrationEndpoints.get("wechat")
    if (!webhookUrl) return

    const levelEmoji = {
      info: "ℹ️",
      warning: "⚠️",
      error: "❌",
      critical: "🔥",
    }[event.level]

    const payload = {
      msgtype: "markdown",
      markdown: {
        content: `## ${levelEmoji} ${rule.name}
        
**事件类型**: ${event.type}
**严重级别**: ${event.level.toUpperCase()}
**来源**: ${event.source}
**时间**: ${new Date(event.timestamp).toLocaleString("zh-CN")}

**详情**: ${event.message}

---
*YYC³-Nettcak AI协同平台*`,
      },
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  }

  /**
   * 添加自定义告警规则
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.push(rule)
  }

  /**
   * 获取集成状态
   */
  getIntegrationStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {}

    for (const [name] of this.integrationEndpoints) {
      status[name] = true
    }

    return status
  }

  /**
   * 测试集成连接
   */
  async testIntegrations(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    for (const [name] of this.integrationEndpoints) {
      try {
        const testEvent: MonitoringEvent = {
          type: "INTEGRATION_TEST",
          level: "info",
          message: "这是一个集成测试消息",
          timestamp: Date.now(),
          source: "integration-test",
        }

        await this.sendAlert(
          name,
          {
            id: "test",
            name: "集成测试",
            condition: () => true,
            channels: [name],
            cooldown: 0,
            enabled: true,
          },
          testEvent,
        )

        results[name] = true
      } catch (error) {
        console.error(`测试 ${name} 集成失败:`, error)
        results[name] = false
      }
    }

    return results
  }
}

// 全局监控集成实例
export const externalMonitoring = new ExternalMonitoringIntegration()
