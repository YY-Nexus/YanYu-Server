"use client"

import type { ReactNode } from "react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface MainLayoutProps {
  children: ReactNode
  systemHealth?: any
}

export function MainLayout({ children, systemHealth }: MainLayoutProps) {
  const pathname = usePathname()

  // 根据路径生成面包屑项
  const generateBreadcrumbItems = () => {
    if (pathname === "/") return []

    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbItems = [{ label: "首页", href: "/" }]

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // 转换路径名为更友好的显示名称
      let label = segment
      switch (segment) {
        case "system":
          label = "系统管理"
          break
        case "features":
          label = "功能分析"
          break
        case "monitoring":
          label = "系统监控"
          break
        case "integrations":
          label = "集成管理"
          break
        case "models":
          label = "模型管理"
          break
        case "stream":
          label = "流式处理"
          break
        case "profile":
          label = "个人资料"
          break
        case "settings":
          label = "系统设置"
          break
        case "help":
          label = "帮助中心"
          break
        default:
          // 将首字母大写
          label = segment.charAt(0).toUpperCase() + segment.slice(1)
      }

      // 最后一个段落不需要链接
      if (index === segments.length - 1) {
        breadcrumbItems.push({ label })
      } else {
        breadcrumbItems.push({ label, href: currentPath })
      }
    })

    return breadcrumbItems
  }

  // 获取页面标题
  const getPageTitle = () => {
    if (pathname === "/") return undefined

    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    switch (lastSegment) {
      case "features":
        return "功能分析"
      case "monitoring":
        return "系统监控"
      case "integrations":
        return "集成管理"
      case "models":
        return "模型管理"
      case "stream":
        return "流式处理"
      case "profile":
        return "个人资料"
      case "settings":
        return "系统设置"
      case "help":
        return "帮助中心"
      default:
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    }
  }

  const breadcrumbItems = generateBreadcrumbItems()
  const pageTitle = getPageTitle()

  // 页面过渡动画配置
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  }

  // 确定背景样式
  const getBackgroundClass = () => {
    if (pathname === "/") return "rainbow-background"
    return "sky-blue-background floating-bubbles"
  }

  return (
    <div className={`min-h-screen ${getBackgroundClass()}`}>
      <Header
        title={pageTitle}
        showBreadcrumb={breadcrumbItems.length > 0}
        breadcrumbItems={breadcrumbItems}
        systemHealth={systemHealth}
      />

      <motion.main
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="container mx-auto px-4 py-8"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  )
}
