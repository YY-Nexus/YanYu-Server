"use client"

import type { Viewport } from "next"
import { useState } from "react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Bell, Key, Smartphone, Activity } from "lucide-react"
import { toast } from "sonner"

// 更新导入语句，使用新的个人信息组件
import { ProfileCard, ProfileStats } from "@/components/ui/profile-components"
import { AvatarUpload } from "@/components/ui/avatar-upload"

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

// 定义 UserProfile 类型
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  bio: string
  company: string
  position: string
  department: string
  joinDate: string
  lastActive: string
  timezone: string
  language: string
  verified: boolean
  level: string
  points: number
  badges: string[]
  socialLinks: {
    github: string
    linkedin: string
  }
  preferences: {
    theme: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
      security: boolean
    }
    privacy: {
      showEmail: boolean
      showPhone: boolean
      showLocation: boolean
      showActivity: boolean
    }
  }
  stats: {
    projectsCompleted: number
    collaborations: number
    contributions: number
    reputation: number
  }
  avatar?: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "张三",
    email: "zhangsan@yanyuyun.asia",
    phone: "+86 138 0013 8000",
    location: "北京市朝阳区",
    bio: "AI协同平台的资深用户，专注于企业级AI解决方案的研究与应用。",
    joinDate: "2024年1月15日",
    department: "技术部",
    position: "高级工程师",
    timezone: "Asia/Shanghai",
    language: "zh-CN",
  })

  // 在现有的用户信息状态基础上，添加完整的用户资料数据结构
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "user-001",
    name: "张三",
    email: "zhangsan@yanyuyun.asia",
    phone: "+86 138 0013 8000",
    location: "北京市朝阳区",
    bio: "AI协同平台的资深用户，专注于企业级AI解决方案的研究与应用。",
    company: "燕语云科技",
    position: "高级工程师",
    department: "技术部",
    joinDate: "2024年1月15日",
    lastActive: "2024年12月6日",
    timezone: "Asia/Shanghai",
    language: "zh-CN",
    verified: true,
    level: "gold",
    points: 2580,
    badges: ["AI专家", "协作达人", "创新先锋", "技术领袖"],
    socialLinks: {
      github: "https://github.com/zhangsan",
      linkedin: "https://linkedin.com/in/zhangsan",
    },
    preferences: {
      theme: "system",
      notifications: {
        email: true,
        push: true,
        sms: false,
        security: true,
      },
      privacy: {
        showEmail: true,
        showPhone: false,
        showLocation: true,
        showActivity: true,
      },
    },
    stats: {
      projectsCompleted: 42,
      collaborations: 128,
      contributions: 256,
      reputation: 2580,
    },
    avatar: "/avatars/01.png",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    security: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: true,
    loginAlerts: true,
    sessionTimeout: "30",
  })

  const handleSave = () => {
    setIsEditing(false)
    toast.success("个人信息已更新")
  }

  const breadcrumbItems = [{ label: "首页", href: "/" }, { label: "个人中心" }]

  const handleAvatarUpdate = (newSrc: string) => {
    setUserProfile((prev) => ({
      ...prev,
      avatar: newSrc,
    }))
    toast.success("头像已更新")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header title="个人中心" showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 头像编辑区域 */}
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <AvatarUpload
                  currentSrc={userProfile.avatar}
                  name={userProfile.name}
                  size="xl"
                  onAvatarChange={(newSrc) => {
                    setUserProfile((prev) => ({ ...prev, avatar: newSrc }))
                  }}
                  editable={true}
                />
                <div>
                  <h3 className="text-lg font-semibold">更新头像</h3>
                  <p className="text-sm text-muted-foreground mb-2">点击头像或相机图标来上传新的头像图片</p>
                  <p className="text-xs text-muted-foreground">支持 JPG、PNG 格式，文件大小不超过 5MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 用户信息卡片 */}
          {/* 替换现有的个人信息卡片为新的ProfileCard组件 */}
          <ProfileCard
            user={userProfile}
            variant="detailed"
            editable={true}
            showStats={true}
            showBadges={true}
            onAvatarChange={handleAvatarUpdate}
          />

          {/* 添加统计信息组件 */}
          <ProfileStats stats={userProfile.stats} />

          {/* 详细信息标签页 */}
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="security">安全设置</TabsTrigger>
              <TabsTrigger value="notifications">通知设置</TabsTrigger>
              <TabsTrigger value="activity">活动记录</TabsTrigger>
            </TabsList>

            {/* 基本信息 */}
            <TabsContent value="basic">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    基本信息
                  </CardTitle>
                  <CardDescription>管理您的个人资料和联系信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        value={userInfo.name}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">电话</Label>
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">位置</Label>
                      <Input
                        id="location"
                        value={userInfo.location}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">部门</Label>
                      <Input
                        id="department"
                        value={userInfo.department}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo({ ...userInfo, department: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">职位</Label>
                      <Input
                        id="position"
                        value={userInfo.position}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo({ ...userInfo, position: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">个人简介</Label>
                    <Textarea
                      id="bio"
                      value={userInfo.bio}
                      disabled={!isEditing}
                      onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">时区</Label>
                      <Select value={userInfo.timezone} disabled={!isEditing}>
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
                    <div className="space-y-2">
                      <Label htmlFor="language">语言</Label>
                      <Select value={userInfo.language} disabled={!isEditing}>
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
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        取消
                      </Button>
                      <Button onClick={handleSave}>保存更改</Button>
                    </div>
                  )}
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
                  <CardDescription>管理您的账户安全和隐私设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>双因素认证</Label>
                        <p className="text-sm text-muted-foreground">为您的账户添加额外的安全保护</p>
                      </div>
                      <Switch
                        checked={security.twoFactor}
                        onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>登录提醒</Label>
                        <p className="text-sm text-muted-foreground">当有新设备登录时发送通知</p>
                      </div>
                      <Switch
                        checked={security.loginAlerts}
                        onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>会话超时时间</Label>
                      <Select value={security.sessionTimeout}>
                        <SelectTrigger className="w-full">
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

                  <Separator />

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Key className="w-4 h-4 mr-2" />
                      修改密码
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Smartphone className="w-4 h-4 mr-2" />
                      管理设备
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 通知设置 */}
            <TabsContent value="notifications">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    通知设置
                  </CardTitle>
                  <CardDescription>选择您希望接收的通知类型</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>邮件通知</Label>
                        <p className="text-sm text-muted-foreground">接收重要更新和系统通知</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>推送通知</Label>
                        <p className="text-sm text-muted-foreground">在浏览器中接收实时通知</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>短信通知</Label>
                        <p className="text-sm text-muted-foreground">接收紧急安全警报</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>安全通知</Label>
                        <p className="text-sm text-muted-foreground">账户安全相关的重要通知</p>
                      </div>
                      <Switch
                        checked={notifications.security}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 活动记录 */}
            <TabsContent value="activity">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    活动记录
                  </CardTitle>
                  <CardDescription>查看您的账户活动历史</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "登录系统",
                        time: "2024年12月6日 14:30",
                        ip: "192.168.1.100",
                        device: "Chrome on Windows",
                      },
                      {
                        action: "修改个人信息",
                        time: "2024年12月6日 10:15",
                        ip: "192.168.1.100",
                        device: "Chrome on Windows",
                      },
                      {
                        action: "访问AI模型管理",
                        time: "2024年12月5日 16:45",
                        ip: "192.168.1.100",
                        device: "Chrome on Windows",
                      },
                      {
                        action: "查看系统监控",
                        time: "2024年12月5日 09:20",
                        ip: "192.168.1.100",
                        device: "Safari on macOS",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{activity.device}</p>
                          <p className="text-xs text-muted-foreground">{activity.ip}</p>
                        </div>
                      </div>
                    ))}
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
