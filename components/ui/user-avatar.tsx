"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Camera, User, Crown, Shield, Star } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface UserAvatarProps {
  src?: string
  name?: string
  email?: string
  role?: "admin" | "user" | "moderator" | "vip"
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  showStatus?: boolean
  status?: "online" | "offline" | "away" | "busy" | "dnd"
  showBadge?: boolean
  badgeText?: string
  badgeColor?: "default" | "success" | "warning" | "error" | "info"
  showEdit?: boolean
  editable?: boolean
  onClick?: () => void
  className?: string
  fallbackIcon?: React.ReactNode
  onAvatarChange?: (newSrc: string) => void
  clickable?: boolean
}

export function UserAvatar({
  src,
  name = "用户",
  email,
  role = "user",
  size = "md",
  showStatus = false,
  status = "online",
  showBadge = false,
  badgeText,
  badgeColor = "default",
  showEdit = false,
  editable = false,
  onClick,
  className,
  fallbackIcon,
  onAvatarChange,
  clickable,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const sizeConfig = {
    xs: { avatar: "w-6 h-6", status: "w-2 h-2", badge: "text-[10px] px-1 min-w-[0.75rem] h-3", edit: "w-3 h-3" },
    sm: { avatar: "w-8 h-8", status: "w-2.5 h-2.5", badge: "text-xs px-1 min-w-[0.875rem] h-4", edit: "w-4 h-4" },
    md: { avatar: "w-10 h-10", status: "w-3 h-3", badge: "text-xs px-1.5 min-w-[1rem] h-5", edit: "w-4 h-4" },
    lg: { avatar: "w-12 h-12", status: "w-3.5 h-3.5", badge: "text-sm px-2 min-w-[1.25rem] h-6", edit: "w-5 h-5" },
    xl: { avatar: "w-16 h-16", status: "w-4 h-4", badge: "text-sm px-2 min-w-[1.5rem] h-7", edit: "w-6 h-6" },
    "2xl": { avatar: "w-20 h-20", status: "w-5 h-5", badge: "text-base px-3 min-w-[2rem] h-8", edit: "w-7 h-7" },
  }

  const statusConfig = {
    online: { color: "bg-green-500", label: "在线" },
    offline: { color: "bg-gray-400", label: "离线" },
    away: { color: "bg-yellow-500", label: "离开" },
    busy: { color: "bg-red-500", label: "忙碌" },
    dnd: { color: "bg-purple-500", label: "请勿打扰" },
  }

  const roleConfig = {
    admin: { icon: Crown, color: "text-yellow-500", label: "管理员" },
    moderator: { icon: Shield, color: "text-blue-500", label: "版主" },
    vip: { icon: Star, color: "text-purple-500", label: "VIP用户" },
    user: { icon: User, color: "text-gray-500", label: "普通用户" },
  }

  const badgeColorConfig = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const RoleIcon = roleConfig[role].icon

  const handleAvatarClick = () => {
    if (editable) {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const newSrc = e.target?.result as string
            // 这里可以调用传入的 onAvatarChange 回调
            if (onAvatarChange) {
              onAvatarChange(newSrc)
            }
            toast.success("头像已更新")
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    } else if (onClick) {
      onClick()
    }
  }

  const AvatarComponent = (
    <div
      className={cn("relative inline-flex items-center group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Avatar
          className={cn(
            sizeConfig[size].avatar,
            "ring-2 ring-white/20 transition-all duration-200",
            (onClick || editable || clickable) && "cursor-pointer hover:ring-4 hover:ring-blue-500/30",
            editable && "hover:brightness-75",
          )}
          onClick={handleAvatarClick}
        >
          <AvatarImage src={!imageError ? src : undefined} alt={name} onError={() => setImageError(true)} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {fallbackIcon || getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* 状态指示器 */}
        {showStatus && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white shadow-sm",
                    sizeConfig[size].status,
                    statusConfig[status].color,
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{statusConfig[status].label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* 角色标识 */}
        {role !== "user" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute -top-1 -left-1 rounded-full bg-white shadow-sm border flex items-center justify-center",
                    size === "xs" || size === "sm" ? "w-4 h-4" : "w-5 h-5",
                  )}
                >
                  <RoleIcon className={cn("w-2.5 h-2.5", roleConfig[role].color)} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{roleConfig[role].label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* 编辑按钮 */}
        {showEdit && editable && isHovered && (
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity",
              sizeConfig[size].avatar,
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleAvatarClick()
            }}
          >
            <Camera className={sizeConfig[size].edit} />
          </Button>
        )}
      </div>

      {/* 数字徽章 */}
      {showBadge && badgeText && (
        <Badge
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center border",
            sizeConfig[size].badge,
            badgeColorConfig[badgeColor],
          )}
        >
          {badgeText}
        </Badge>
      )}
    </div>
  )

  // 如果有邮箱信息，包装在Tooltip中
  if (email) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{AvatarComponent}</TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
              {role !== "user" && <p className="text-xs text-muted-foreground">{roleConfig[role].label}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return AvatarComponent
}

// 用户头像组合组件
export function UserAvatarGroup({
  users,
  max = 3,
  size = "md",
  showMore = true,
  className,
}: {
  users: Array<{
    src?: string
    name: string
    email?: string
    role?: "admin" | "user" | "moderator" | "vip"
  }>
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  showMore?: boolean
  className?: string
}) {
  const displayUsers = users.slice(0, max)
  const remainingCount = users.length - max

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayUsers.map((user, index) => (
        <UserAvatar
          key={index}
          src={user.src}
          name={user.name}
          email={user.email}
          role={user.role}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {showMore && remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-100 text-gray-600 font-medium rounded-full ring-2 ring-white",
            {
              xs: "w-6 h-6 text-xs",
              sm: "w-8 h-8 text-xs",
              md: "w-10 h-10 text-sm",
              lg: "w-12 h-12 text-sm",
              xl: "w-16 h-16 text-base",
              "2xl": "w-20 h-20 text-lg",
            }[size],
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
