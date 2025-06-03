"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

// 中文路径映射
const pathMap: Record<string, string> = {
  system: "系统",
  features: "功能分析",
  monitoring: "系统监控",
  integrations: "集成管理",
  models: "模型管理",
  stream: "流式处理",
  security: "安全",
  block: "阻止页面",
}

export function NavigationBreadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  // 如果是首页，不显示面包屑
  if (pathSegments.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 mb-6 text-sm">
      <Link
        href="/"
        className="flex items-center text-blue-200 hover:text-white transition-colors glass-effect px-2 py-1 rounded"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>首页</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`
        const isLast = index === pathSegments.length - 1

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="ml-2 font-medium text-white">{pathMap[segment] || segment}</span>
            ) : (
              <Link
                href={path}
                className="ml-2 text-blue-200 hover:text-white transition-colors glass-effect px-2 py-1 rounded"
              >
                {pathMap[segment] || segment}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
