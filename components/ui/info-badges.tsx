"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Crown,
  Shield,
  Zap,
  FlameIcon as Fire,
  Hash,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share,
  Download,
  X,
} from "lucide-react"
import { useState } from "react"

// 基础信息徽章
interface InfoBadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline"
  size?: "sm" | "md" | "lg"
  icon?: React.ReactNode
  children: React.ReactNode
  removable?: boolean
  onRemove?: () => void
  clickable?: boolean
  onClick?: () => void
  tooltip?: string
  className?: string
}

export function InfoBadge({
  variant = "default",
  size = "md",
  icon,
  children,
  removable = false,
  onRemove,
  clickable = false,
  onClick,
  tooltip,
  className,
}: InfoBadgeProps) {
  const variantConfig = {
    default: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    success: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    outline: "bg-transparent border-gray-300 hover:bg-gray-50",
  }

  const sizeConfig = {
    sm: "text-xs px-2 py-0.5 h-5",
    md: "text-sm px-2.5 py-1 h-6",
    lg: "text-base px-3 py-1.5 h-8",
  }

  const BadgeComponent = (
    <Badge
      className={cn(
        "inline-flex items-center gap-1 border transition-colors",
        variantConfig[variant],
        sizeConfig[size],
        clickable && "cursor-pointer",
        className,
      )}
      onClick={clickable ? onClick : undefined}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {removable && (
        <Button
          variant="ghost"
          size="icon"
          className="h-3 w-3 p-0 hover:bg-black/10 ml-1"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
        >
          <X className="h-2 w-2" />
        </Button>
      )}
    </Badge>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{BadgeComponent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return BadgeComponent
}

// 状态徽章
interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "completed" | "failed" | "cancelled"
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function StatusBadge({ status, size = "md", animated = false }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      variant: "success" as const,
      icon: <CheckCircle className="w-3 h-3" />,
      label: "活跃",
    },
    inactive: {
      variant: "default" as const,
      icon: <Clock className="w-3 h-3" />,
      label: "未激活",
    },
    pending: {
      variant: "warning" as const,
      icon: <Clock className="w-3 h-3" />,
      label: "等待中",
    },
    completed: {
      variant: "success" as const,
      icon: <CheckCircle className="w-3 h-3" />,
      label: "已完成",
    },
    failed: {
      variant: "error" as const,
      icon: <XCircle className="w-3 h-3" />,
      label: "失败",
    },
    cancelled: {
      variant: "default" as const,
      icon: <XCircle className="w-3 h-3" />,
      label: "已取消",
    },
  }

  const config = statusConfig[status]

  return (
    <InfoBadge
      variant={config.variant}
      size={size}
      icon={config.icon}
      className={animated && status === "pending" ? "animate-pulse" : ""}
    >
      {config.label}
    </InfoBadge>
  )
}

// 计数徽章
interface CountBadgeProps {
  count: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "error" | "info"
  showZero?: boolean
}

export function CountBadge({ count, max = 99, size = "md", variant = "error", showZero = false }: CountBadgeProps) {
  if (count === 0 && !showZero) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <InfoBadge variant={variant} size={size} className="font-bold min-w-[1.5rem] justify-center">
      {displayCount}
    </InfoBadge>
  )
}

// 标签徽章组
interface TagBadgeGroupProps {
  tags: string[]
  max?: number
  removable?: boolean
  onRemove?: (tag: string) => void
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline"
  size?: "sm" | "md" | "lg"
}

export function TagBadgeGroup({
  tags,
  max = 5,
  removable = false,
  onRemove,
  variant = "outline",
  size = "sm",
}: TagBadgeGroupProps) {
  const [showAll, setShowAll] = useState(false)
  const displayTags = showAll ? tags : tags.slice(0, max)
  const remainingCount = tags.length - max

  return (
    <div className="flex flex-wrap gap-1">
      {displayTags.map((tag, index) => (
        <InfoBadge
          key={index}
          variant={variant}
          size={size}
          icon={<Hash className="w-3 h-3" />}
          removable={removable}
          onRemove={() => onRemove?.(tag)}
        >
          {tag}
        </InfoBadge>
      ))}
      {!showAll && remainingCount > 0 && (
        <InfoBadge variant="default" size={size} clickable onClick={() => setShowAll(true)} className="cursor-pointer">
          +{remainingCount}
        </InfoBadge>
      )}
    </div>
  )
}

// 特殊徽章
export function VIPBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <InfoBadge variant="warning" size={size} icon={<Crown className="w-3 h-3" />}>
      VIP
    </InfoBadge>
  )
}

export function AdminBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <InfoBadge variant="error" size={size} icon={<Shield className="w-3 h-3" />}>
      管理员
    </InfoBadge>
  )
}

export function NewBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <InfoBadge variant="success" size={size} icon={<Star className="w-3 h-3" />} className="animate-pulse">
      新
    </InfoBadge>
  )
}

export function HotBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <InfoBadge variant="error" size={size} icon={<Fire className="w-3 h-3" />} className="animate-bounce">
      热门
    </InfoBadge>
  )
}

export function BetaBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <InfoBadge variant="info" size={size} icon={<Zap className="w-3 h-3" />}>
      Beta
    </InfoBadge>
  )
}

// 交互统计徽章
interface InteractionBadgeProps {
  type: "views" | "likes" | "comments" | "shares" | "downloads"
  count: number
  size?: "sm" | "md" | "lg"
  clickable?: boolean
  onClick?: () => void
}

export function InteractionBadge({ type, count, size = "sm", clickable = false, onClick }: InteractionBadgeProps) {
  const typeConfig = {
    views: { icon: <Eye className="w-3 h-3" />, label: "浏览" },
    likes: { icon: <ThumbsUp className="w-3 h-3" />, label: "点赞" },
    comments: { icon: <MessageCircle className="w-3 h-3" />, label: "评论" },
    shares: { icon: <Share className="w-3 h-3" />, label: "分享" },
    downloads: { icon: <Download className="w-3 h-3" />, label: "下载" },
  }

  const config = typeConfig[type]
  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <InfoBadge
      variant="outline"
      size={size}
      icon={config.icon}
      clickable={clickable}
      onClick={onClick}
      tooltip={`${count} ${config.label}`}
    >
      {formatCount(count)}
    </InfoBadge>
  )
}
