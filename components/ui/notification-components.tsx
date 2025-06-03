"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  Settings,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 通知类型定义
interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error" | "system" | "social" | "security"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  actionUrl?: string
  actionText?: string
  avatar?: string
  sender?: string
  metadata?: Record<string, any>
}

// 提醒信息组件
interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
  onAction?: (notification: Notification) => void
  compact?: boolean
  className?: string
}

export function NotificationItem({
  notification,
  onRead,
  onDelete,
  onAction,
  compact = false,
  className,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "system":
        return <Settings className="w-5 h-5 text-blue-500" />
      case "social":
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      case "security":
        return <Shield className="w-5 h-5 text-orange-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50/50 dark:bg-red-900/10"
      case "high":
        return "border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10"
      default:
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "刚刚"
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return time.toLocaleDateString("zh-CN")
  }

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center space-x-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-sm",
          getPriorityColor(),
          !notification.read && "bg-opacity-100",
          className,
        )}
      >
        <div className="flex-shrink-0">
          {notification.avatar ? (
            <Avatar className="w-8 h-8">
              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
              <AvatarFallback>{notification.sender?.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            getIcon()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{notification.title}</p>
          <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
        </div>
        <div className="flex items-center space-x-1">
          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
          <Button size="icon" variant="ghost" className="w-6 h-6" onClick={() => onRead(notification.id)}>
            <Check className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md border-l-4",
        getPriorityColor(),
        !notification.read && "ring-1 ring-blue-200 dark:ring-blue-800",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {notification.avatar ? (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{notification.sender?.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                getIcon()
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{notification.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {notification.category}
                </Badge>
                {notification.priority === "urgent" && (
                  <Badge variant="destructive" className="text-xs">
                    紧急
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(notification.timestamp)}
                </div>
                {notification.sender && (
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {notification.sender}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />}
            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => onRead(notification.id)}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => onDelete(notification.id)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {notification.actionUrl && notification.actionText && (
          <div className="mt-3 pt-3 border-t">
            <Button size="sm" variant="outline" onClick={() => onAction?.(notification)}>
              {notification.actionText}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 通知中心组件
interface NotificationCenterProps {
  notifications: Notification[]
  onRead: (id: string) => void
  onDelete: (id: string) => void
  onReadAll: () => void
  onDeleteAll: () => void
  className?: string
}

export function NotificationCenter({
  notifications,
  onRead,
  onDelete,
  onReadAll,
  onDeleteAll,
  className,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "system" | "social">("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.timestamp).toDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(notification)
      return groups
    },
    {} as Record<string, Notification[]>,
  )

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              通知中心
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>管理您的所有通知和提醒</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onReadAll}>
              全部已读
            </Button>
            <Button size="sm" variant="outline" onClick={onDeleteAll}>
              清空全部
            </Button>
          </div>
        </div>

        {/* 过滤器 */}
        <div className="flex space-x-2 mt-4">
          {[
            { key: "all", label: "全部", count: notifications.length },
            { key: "unread", label: "未读", count: unreadCount },
            { key: "system", label: "系统", count: notifications.filter((n) => n.type === "system").length },
            { key: "social", label: "社交", count: notifications.filter((n) => n.type === "social").length },
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              size="sm"
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key as any)}
              className="relative"
            >
              {label}
              {count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          {Object.keys(groupedNotifications).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无通知</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
                <div key={date}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 sticky top-0 bg-background/80 backdrop-blur-sm py-1">
                    {new Date(date).toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </h4>
                  <div className="space-y-3">
                    {dayNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={onRead}
                        onDelete={onDelete}
                        compact
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// 系统提醒横幅组件
interface SystemAlertBannerProps {
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  dismissible?: boolean
  actionText?: string
  onAction?: () => void
  onDismiss?: () => void
  className?: string
}

export function SystemAlertBanner({
  type,
  title,
  message,
  dismissible = true,
  actionText,
  onAction,
  onDismiss,
  className,
}: SystemAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: "text-green-800 dark:text-green-200",
        }
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          text: "text-yellow-800 dark:text-yellow-200",
        }
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          text: "text-red-800 dark:text-red-200",
        }
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          icon: <Info className="w-5 h-5 text-blue-600" />,
          text: "text-blue-800 dark:text-blue-200",
        }
    }
  }

  const styles = getStyles()

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className={cn("rounded-lg border p-4 transition-all", styles.bg, className)}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1 space-y-1">
          <h4 className={cn("font-semibold", styles.text)}>{title}</h4>
          <p className={cn("text-sm", styles.text)}>{message}</p>
        </div>
        <div className="flex items-center space-x-2">
          {actionText && onAction && (
            <Button size="sm" variant="outline" onClick={onAction}>
              {actionText}
            </Button>
          )}
          {dismissible && (
            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// 浮动通知组件
interface FloatingNotificationProps {
  notification: Notification
  onDismiss: (id: string) => void
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  autoHide?: boolean
  hideDelay?: number
  className?: string
}

export function FloatingNotification({
  notification,
  onDismiss,
  position = "top-right",
  autoHide = true,
  hideDelay = 5000,
  className,
}: FloatingNotificationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onDismiss(notification.id), 300)
      }, hideDelay)
      return () => clearTimeout(timer)
    }
  }, [autoHide, hideDelay, notification.id, onDismiss])

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4"
      case "bottom-right":
        return "bottom-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      default:
        return "top-4 right-4"
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed z-50 w-80 transition-all duration-300",
        getPositionClasses(),
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        className,
      )}
    >
      <Card className="glass-effect shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6"
              onClick={() => {
                setVisible(false)
                setTimeout(() => onDismiss(notification.id), 300)
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
