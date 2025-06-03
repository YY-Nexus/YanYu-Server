import { cache } from "react"

type ServerConfig = {
  version: string
  features: Record<string, boolean>
  security: {
    auditEnabled: boolean
    integrityCheckEnabled: boolean
    permissionsCheckEnabled: boolean
  }
  monitoring: {
    enabled: boolean
    sampleRate: number
    endpoints: string[]
  }
}

// 使用React的cache函数缓存配置获取
export const getServerConfig = cache(async (): Promise<ServerConfig> => {
  try {
    // 从环境变量获取配置
    return {
      version: process.env.APP_VERSION || "1.0.0",
      features: {
        audit: process.env.FEATURE_AUDIT !== "false",
        monitoring: process.env.FEATURE_MONITORING !== "false",
        security: process.env.FEATURE_SECURITY !== "false",
      },
      security: {
        auditEnabled: process.env.SECURITY_AUDIT_ENABLED !== "false",
        integrityCheckEnabled: process.env.SECURITY_INTEGRITY_CHECK_ENABLED !== "false",
        permissionsCheckEnabled: process.env.SECURITY_PERMISSIONS_CHECK_ENABLED !== "false",
      },
      monitoring: {
        enabled: process.env.MONITORING_ENABLED !== "false",
        sampleRate: Number.parseFloat(process.env.MONITORING_SAMPLE_RATE || "1.0"),
        endpoints: process.env.MONITORING_ENDPOINTS
          ? process.env.MONITORING_ENDPOINTS.split(",")
          : [process.env.MONITORING_ENDPOINT || "https://api.example.com/events"],
      },
    }
  } catch (error) {
    console.error("获取服务器配置失败:", error)

    // 返回安全的默认配置
    return {
      version: process.env.APP_VERSION || "1.0.0",
      features: {
        audit: true,
        monitoring: true,
        security: true,
      },
      security: {
        auditEnabled: true,
        integrityCheckEnabled: true,
        permissionsCheckEnabled: true,
      },
      monitoring: {
        enabled: true,
        sampleRate: 1.0,
        endpoints: [],
      },
    }
  }
})
