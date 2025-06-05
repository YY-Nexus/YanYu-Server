"use client"

import type { Viewport } from "next"
// import { defaultViewport } from "@/lib/viewport"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Palette,
  Shield,
  Database,
  Download,
  Trash2,
  RefreshCw,
  HardDrive,
  Wifi,
  Monitor,
} from "lucide-react"

export default function SettingsPage() {
  const breadcrumbItems = [{ label: "首页", href: "/" }, { label: "系统设置" }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header title="系统设置" showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">常规</TabsTrigger>
              <TabsTrigger value="appearance">外观</TabsTrigger>
              <TabsTrigger value="security">安全</TabsTrigger>
              <TabsTrigger value="data">数据</TabsTrigger>
              <TabsTrigger value="system">系统</TabsTrigger>
            </TabsList>

            {/* 常规设置 */}
            <TabsContent value="general">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    常规设置
                  </CardTitle>
                  <CardDescription>管理应用的基本设置和偏好</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>自动保存</Label>
                        <p className="text-sm text-muted-foreground">自动保存您的工作进度</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>实时同步</Label>
                        <p className="text-sm text-muted-foreground">与云端实时同步数据</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>离线模式</Label>
                        <p className="text-sm text-muted-foreground">在网络不可用时启用离线功能</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>默认语言</Label>
                      <Select defaultValue="zh-CN">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh-CN">简体中文</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                          <SelectItem value="ja-JP">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>时区</Label>
                      <Select defaultValue="Asia/Shanghai">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                          <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                          <SelectItem value="Europe/London">英国时间 (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 外观设置 */}
            <TabsContent value="appearance">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    外观设置
                  </CardTitle>
                  <CardDescription>自定义界面外观和主题</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>主题模式</Label>
                      <Select defaultValue="system">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">浅色模式</SelectItem>
                          <SelectItem value="dark">深色模式</SelectItem>
                          <SelectItem value="system">跟随系统</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>主题色彩</Label>
                      <div className="flex space-x-2">
                        {[
                          { name: "蓝色", color: "bg-blue-500" },
                          { name: "紫色", color: "bg-purple-500" },
                          { name: "绿色", color: "bg-green-500" },
                          { name: "橙色", color: "bg-orange-500" },
                        ].map((theme) => (
                          <button
                            key={theme.name}
                            className={`w-8 h-8 rounded-full ${theme.color} ring-2 ring-offset-2 ring-blue-500`}
                            title={theme.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>紧凑模式</Label>
                        <p className="text-sm text-muted-foreground">减少界面元素间距</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>动画效果</Label>
                        <p className="text-sm text-muted-foreground">启用界面动画和过渡效果</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 安全设置 */}
            <TabsContent value="security">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    安全设置
                  </CardTitle>
                  <CardDescription>配置系统安全和隐私选项</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>安全审计</Label>
                        <p className="text-sm text-muted-foreground">启用系统安全审计功能</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">已启用</Badge>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>访问日志</Label>
                        <p className="text-sm text-muted-foreground">记录所有系统访问日志</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>IP白名单</Label>
                        <p className="text-sm text-muted-foreground">仅允许白名单IP访问</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>会话超时</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15分钟</SelectItem>
                          <SelectItem value="30">30分钟</SelectItem>
                          <SelectItem value="60">1小时</SelectItem>
                          <SelectItem value="240">4小时</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 数据设置 */}
            <TabsContent value="data">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    数据管理
                  </CardTitle>
                  <CardDescription>管理应用数据和存储设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">存储使用情况</p>
                        <p className="text-sm text-muted-foreground">已使用 2.3 GB / 10 GB</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">23%</p>
                        <p className="text-sm text-muted-foreground">剩余 7.7 GB</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      导出数据
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      同步数据
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      清除缓存
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 系统设置 */}
            <TabsContent value="system">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    系统信息
                  </CardTitle>
                  <CardDescription>查看系统状态和性能信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <HardDrive className="w-4 h-4" />
                        <span className="font-medium">CPU使用率</span>
                      </div>
                      <p className="text-2xl font-bold">45%</p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Database className="w-4 h-4" />
                        <span className="font-medium">内存使用</span>
                      </div>
                      <p className="text-2xl font-bold">6.2 GB</p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wifi className="w-4 h-4" />
                        <span className="font-medium">网络状态</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">正常</p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">安全状态</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">安全</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">系统版本: v1.2.3</p>
                    <p className="text-sm text-muted-foreground">最后更新: 2024年12月6日</p>
                    <p className="text-sm text-muted-foreground">运行时间: 15天 8小时 32分钟</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
