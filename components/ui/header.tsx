"use client"

import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NavigationBreadcrumb } from "@/components/ui/navigation-breadcrumb"
import { Bell, Settings, User, Menu, HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { SystemStatusIndicator } from "@/components/ui/system-status-indicator"
import { UserAvatar } from "@/components/ui/user-avatar"

interface HeaderProps {
  title?: string
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ label: string; href?: string }>
  systemHealth?: any
}

export function Header({ title, showBreadcrumb = false, breadcrumbItems = [], systemHealth }: HeaderProps) {
  const navigationItems = [
    { label: "首页", href: "/" },
    { label: "功能分析", href: "/system/features" },
    { label: "模型管理", href: "/models" },
    { label: "系统监控", href: "/system/monitoring" },
    { label: "流式处理", href: "/stream" },
    { label: "集成管理", href: "/system/integrations" },
  ]

  return (
    <header className="glass-effect border-b border-white/20 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：LOGO和标题 */}
          <div className="flex items-center space-x-6">
            <Logo size="md" showText={true} href="/" />

            {title && (
              <div className="hidden md:block">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              </div>
            )}
          </div>

          {/* 中间：导航菜单 (桌面端) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* 右侧：状态和用户菜单 */}
          <div className="flex items-center space-x-4">
            {/* 系统状态 - 使用图标标注 */}
            <SystemStatusIndicator status="healthy" compact={true} />

            {/* 版本标识 */}
            <Badge variant="outline" className="glass-effect font-bold hidden md:inline-flex">
              v{systemHealth?.version || "1.0.0"}
            </Badge>

            {/* 通知按钮 */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* 用户菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <UserAvatar
                    name="张三"
                    email="zhangsan@yanyuyun.asia"
                    role="admin"
                    size="md"
                    showStatus={true}
                    status="online"
                    editable={true}
                    showEdit={true}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">张三</p>
                    <p className="text-xs leading-none text-muted-foreground">zhangsan@yanyuyun.asia</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>系统设置</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>帮助中心</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 移动端菜单 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <Logo size="lg" showText={true} />
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button variant="ghost" className="w-full justify-start text-left">
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 面包屑导航 */}
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <NavigationBreadcrumb items={breadcrumbItems} />
          </div>
        )}
      </div>
    </header>
  )
}
