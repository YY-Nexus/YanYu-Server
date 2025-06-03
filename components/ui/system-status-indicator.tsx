"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, AlertTriangle, XCircle, Activity, Wifi, Database, Shield } from "lucide-react"

interface SystemStatusIndicatorProps {
  status?: "healthy" | "warning" | "error" | "maintenance"
  showDetails?: boolean
  compact?: boolean
}

export function SystemStatusIndicator({
  status = "healthy",
  showDetails = false,
  compact = false,
}: SystemStatusIndicatorProps) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      label: "系统正常",
      description: "所有服务运行正常",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      label: "系统警告",
      description: "部分服务存在异常",
    },
    error: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      label: "系统异常",
      description: "服务出现严重问题",
    },
    maintenance: {
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      label: "维护中",
      description: "系统正在维护升级",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${config.bgColor} ${config.borderColor} border`}
            >
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{config.label}</p>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-full glass-effect ${config.bgColor} ${config.borderColor} border`}
    >
      <Icon className={`w-4 h-4 ${config.color}`} />
      {showDetails && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Wifi className="w-3 h-3 text-green-500" />
            <span className="text-xs">网络</span>
          </div>
          <div className="flex items-center space-x-1">
            <Database className="w-3 h-3 text-green-500" />
            <span className="text-xs">数据库</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-green-500" />
            <span className="text-xs">安全</span>
          </div>
        </div>
      )}
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}
