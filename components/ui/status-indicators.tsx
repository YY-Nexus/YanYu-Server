"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Activity,
  Wifi,
  Database,
  Server,
  Globe,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"

// 基础状态指示器
interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "info" | "pending" | "inactive"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  description?: string
  animated?: boolean
  className?: string
}

export function StatusIndicator({
  status,
  size = "md",
  showLabel = false,
  label,
  description,
  animated = false,
  className,
}: StatusIndicatorProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      label: label || "成功",
      description: description || "操作已成功完成",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      label: label || "警告",
      description: description || "需要注意的问题",
    },
    error: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      label: label || "错误",
      description: description || "操作失败或出现错误",
    },
    info: {
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      label: label || "信息",
      description: description || "一般信息提示",
    },
    pending: {
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      label: label || "等待中",
      description: description || "正在处理中",
    },
    inactive: {
      icon: Minus,
      color: "text-gray-400",
      bgColor: "bg-gray-400/10",
      borderColor: "border-gray-400/20",
      label: label || "未激活",
      description: description || "功能未启用",
    },
  }

  const sizeConfig = {
    sm: { icon: "w-3 h-3", container: "w-6 h-6", text: "text-xs" },
    md: { icon: "w-4 h-4", container: "w-8 h-8", text: "text-sm" },
    lg: { icon: "w-5 h-5", container: "w-10 h-10", text: "text-base" },
  }

  const config = statusConfig[status]
  const sizeConf = sizeConfig[size]
  const Icon = config.icon

  const indicator = (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border",
        sizeConf.container,
        config.bgColor,
        config.borderColor,
        animated && status === "pending" && "animate-pulse",
        className,
      )}
    >
      <Icon className={cn(sizeConf.icon, config.color, animated && "animate-spin")} />
    </div>
  )

  if (showLabel || description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              {indicator}
              {showLabel && <span className={cn("font-medium", sizeConf.text)}>{config.label}</span>}
            </div>
          </TooltipTrigger>
          {description && (
            <TooltipContent>
              <p>{config.description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }

  return indicator
}

// 系统健康状态指示器
interface SystemHealthProps {
  services: Array<{
    name: string
    status: "healthy" | "warning" | "error" | "maintenance"
    uptime?: number
    lastCheck?: Date
  }>
  compact?: boolean
  showDetails?: boolean
}

export function SystemHealthIndicator({ services, compact = false, showDetails = false }: SystemHealthProps) {
  const overallStatus = services.some((s) => s.status === "error")
    ? "error"
    : services.some((s) => s.status === "warning")
      ? "warning"
      : services.some((s) => s.status === "maintenance")
        ? "info"
        : "success"

  const serviceIcons = {
    API: Server,
    数据库: Database,
    网络: Wifi,
    安全: Shield,
    监控: Activity,
    存储: Globe,
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-1">
              <StatusIndicator status={overallStatus} size="sm" />
              <span className="text-sm font-medium">系统状态</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-64">
            <div className="space-y-2">
              <p className="font-medium">系统服务状态</p>
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{service.name}</span>
                  <StatusIndicator status={service.status} size="sm" />
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <StatusIndicator status={overallStatus} size="lg" />
        <div>
          <h3 className="font-semibold">系统健康状态</h3>
          <p className="text-sm text-muted-foreground">
            {services.filter((s) => s.status === "healthy").length} / {services.length} 服务正常运行
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const IconComponent = serviceIcons[service.name as keyof typeof serviceIcons] || Server
            return (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <IconComponent className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{service.name}</span>
                    <StatusIndicator status={service.status} size="sm" />
                  </div>
                  {service.uptime && <p className="text-xs text-muted-foreground">运行时间: {service.uptime}%</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// 趋势指示器
interface TrendIndicatorProps {
  trend: "up" | "down" | "stable"
  value?: string | number
  label?: string
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function TrendIndicator({ trend, value, label, size = "md", showIcon = true }: TrendIndicatorProps) {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      label: "上升",
    },
    down: {
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "下降",
    },
    stable: {
      icon: Minus,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
      label: "稳定",
    },
  }

  const sizeConfig = {
    sm: { icon: "w-3 h-3", text: "text-xs", padding: "px-2 py-1" },
    md: { icon: "w-4 h-4", text: "text-sm", padding: "px-3 py-1.5" },
    lg: { icon: "w-5 h-5", text: "text-base", padding: "px-4 py-2" },
  }

  const config = trendConfig[trend]
  const sizeConf = sizeConfig[size]
  const Icon = config.icon

  return (
    <div className={cn("inline-flex items-center space-x-1 rounded-full", sizeConf.padding, config.bgColor)}>
      {showIcon && <Icon className={cn(sizeConf.icon, config.color)} />}
      {value && <span className={cn("font-medium", sizeConf.text, config.color)}>{value}</span>}
      {label && <span className={cn(sizeConf.text, "text-gray-600")}>{label}</span>}
    </div>
  )
}

// 优先级指示器
interface PriorityIndicatorProps {
  priority: "low" | "medium" | "high" | "critical"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function PriorityIndicator({ priority, size = "md", showLabel = false }: PriorityIndicatorProps) {
  const priorityConfig = {
    low: {
      color: "bg-green-500",
      label: "低",
      textColor: "text-green-700",
    },
    medium: {
      color: "bg-yellow-500",
      label: "中",
      textColor: "text-yellow-700",
    },
    high: {
      color: "bg-orange-500",
      label: "高",
      textColor: "text-orange-700",
    },
    critical: {
      color: "bg-red-500",
      label: "紧急",
      textColor: "text-red-700",
    },
  }

  const sizeConfig = {
    sm: { dot: "w-2 h-2", text: "text-xs" },
    md: { dot: "w-3 h-3", text: "text-sm" },
    lg: { dot: "w-4 h-4", text: "text-base" },
  }

  const config = priorityConfig[priority]
  const sizeConf = sizeConfig[size]

  return (
    <div className="flex items-center space-x-2">
      <div className={cn("rounded-full", sizeConf.dot, config.color)} />
      {showLabel && <span className={cn("font-medium", sizeConf.text, config.textColor)}>{config.label}</span>}
    </div>
  )
}

// 安全等级指示器
interface SecurityLevelProps {
  level: "low" | "medium" | "high" | "maximum"
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function SecurityLevelIndicator({ level, showLabel = false, size = "md" }: SecurityLevelProps) {
  const levelConfig = {
    low: {
      icon: Unlock,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: "低安全",
      bars: 1,
    },
    medium: {
      icon: Lock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      label: "中等安全",
      bars: 2,
    },
    high: {
      icon: Shield,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      label: "高安全",
      bars: 3,
    },
    maximum: {
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      label: "最高安全",
      bars: 4,
    },
  }

  const config = levelConfig[level]
  const Icon = config.icon

  return (
    <div className="flex items-center space-x-2">
      <div className={cn("p-1 rounded", config.bgColor)}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>
      <div className="flex space-x-0.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1 h-4 rounded-full",
              index < config.bars ? config.color.replace("text-", "bg-") : "bg-gray-200",
            )}
          />
        ))}
      </div>
      {showLabel && <span className="text-sm font-medium">{config.label}</span>}
    </div>
  )
}
