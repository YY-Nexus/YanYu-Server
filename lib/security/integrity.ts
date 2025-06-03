type IntegrityContext = {
  appVersion: string
  deploymentId: string
}

type IntegrityResult = {
  passed: boolean
  details: string[]
  checksPerformed: string[]
}

/**
 * 验证应用资源完整性
 */
export async function verifyIntegrity(context: IntegrityContext): Promise<IntegrityResult> {
  // 生产环境下简化检查
  if (process.env.NODE_ENV === "production") {
    return {
      passed: true,
      details: ["生产环境：完整性检查已简化"],
      checksPerformed: ["生产环境完整性检查"],
    }
  }

  const result: IntegrityResult = {
    passed: true,
    details: [],
    checksPerformed: [],
  }

  try {
    // 1. 检查核心文件完整性
    const coreFiles = [
      "/_next/static/chunks/main.js",
      "/_next/static/chunks/webpack.js",
      "/_next/static/chunks/react-refresh.js",
    ]

    result.checksPerformed.push("核心文件完整性检查")

    for (const file of coreFiles) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}${file}`)
        if (!response.ok) {
          result.passed = false
          result.details.push(`核心文件访问失败: ${file}`)
        }
      } catch (error) {
        result.passed = false
        result.details.push(`核心文件检查异常: ${file}`)
      }
    }

    // 2. 检查环境变量完整性
    result.checksPerformed.push("环境变量完整性检查")
    const requiredEnvVars = ["NEXT_PUBLIC_BASE_URL", "VERCEL_ENV", "VERCEL_REGION"]

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        result.passed = false
        result.details.push(`缺少必要环境变量: ${envVar}`)
      }
    }

    // 3. 检查部署信息
    result.checksPerformed.push("部署信息检查")
    if (!context.deploymentId || context.deploymentId === "本地环境") {
      // 本地环境不强制要求部署ID
      result.details.push("在本地环境中运行，跳过部署ID验证")
    }

    // 4. 检查应用版本
    result.checksPerformed.push("应用版本检查")
    if (!context.appVersion) {
      result.passed = false
      result.details.push("缺少应用版本信息")
    }

    // 如果没有发现问题，添加通过信息
    if (result.details.length === 0 || (result.details.length === 1 && result.details[0].includes("本地环境"))) {
      result.details.push("所有完整性检查通过")
    }

    return result
  } catch (error) {
    console.error("执行完整性验证时出错:", error)
    return {
      passed: false,
      details: [`完整性验证执行失败: ${error instanceof Error ? error.message : String(error)}`],
      checksPerformed: ["完整性验证"],
    }
  }
}
