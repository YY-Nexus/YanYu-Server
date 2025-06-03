"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Edit3,
  Save,
  Camera,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Building,
  Briefcase,
  Globe,
  Star,
  Award,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// 个人信息类型定义
interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  company?: string
  position?: string
  department?: string
  joinDate: string
  lastActive: string
  timezone: string
  language: string
  verified: boolean
  level: "bronze" | "silver" | "gold" | "platinum"
  points: number
  badges: string[]
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    wechat?: string
  }
  preferences: {
    theme: "light" | "dark" | "system"
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
}

// 个人资料卡片组件
interface ProfileCardProps {
  user: UserProfile
  variant?: "default" | "compact" | "detailed"
  editable?: boolean
  showStats?: boolean
  showBadges?: boolean
  className?: string
}

export function ProfileCard({
  user,
  variant = "default",
  editable = false,
  showStats = true,
  showBadges = true,
  className,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [avatarSrc, setAvatarSrc] = useState(user.avatar)

  const handleSave = () => {
    setIsEditing(false)
    toast.success("个人信息已更新")
  }

  const handleAvatarChange = (newSrc: string) => {
    setAvatarSrc(newSrc)
    // 这里可以调用API更新用户头像
    toast.success("头像已更新")
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "text-amber-600"
      case "silver":
        return "text-gray-500"
      case "gold":
        return "text-yellow-500"
      case "platinum":
        return "text-purple-500"
      default:
        return "text-gray-400"
    }
  }

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "bronze":
        return "secondary"
      case "silver":
        return "outline"
      case "gold":
        return "default"
      case "platinum":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (variant === "compact") {
    return (
      <Card className={cn("glass-effect", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {user.verified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold truncate">{user.name}</h3>
                <Badge variant={getLevelBadgeVariant(user.level)} className="text-xs">
                  {user.level.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{user.position}</p>
              <p className="text-xs text-muted-foreground">{user.points} 积分</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {editable && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                  onClick={handleAvatarChange}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
              {user.verified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <Badge variant={getLevelBadgeVariant(user.level)} className={getLevelColor(user.level)}>
                  <Star className="w-3 h-3 mr-1" />
                  {user.level.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>
                    {user.position} · {user.department}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{user.company}</span>
                </div>
                {user.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {editable && (
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"}>
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {isEditing ? "保存" : "编辑"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 个人简介 */}
        {user.bio && (
          <div>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>
        )}

        {/* 徽章展示 */}
        {showBadges && user.badges.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">成就徽章</h4>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 统计信息 */}
        {showStats && (
          <div>
            <h4 className="font-medium mb-3">活动统计</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-blue-600">{user.stats.projectsCompleted}</div>
                <div className="text-sm text-muted-foreground">完成项目</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">{user.stats.collaborations}</div>
                <div className="text-sm text-muted-foreground">协作次数</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-purple-600">{user.stats.contributions}</div>
                <div className="text-sm text-muted-foreground">贡献数量</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-orange-600">{user.stats.reputation}</div>
                <div className="text-sm text-muted-foreground">声誉值</div>
              </div>
            </div>
          </div>
        )}

        {/* 联系信息 */}
        <div>
          <h4 className="font-medium mb-3">联系方式</h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center text-sm">
                <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                <a
                  href={user.website}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 加入时间 */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>加入时间: {user.joinDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// 个人信息编辑表单组件
interface ProfileEditFormProps {
  user: UserProfile
  onSave: (user: UserProfile) => void
  onCancel: () => void
  className?: string
}

export function ProfileEditForm({ user, onSave, onCancel, className }: ProfileEditFormProps) {
  const [formData, setFormData] = useState(user)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    toast.success("个人信息已更新")
  }

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <CardTitle>编辑个人信息</CardTitle>
        <CardDescription>更新您的个人资料和偏好设置</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="contact">联系方式</TabsTrigger>
              <TabsTrigger value="preferences">偏好设置</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">职位</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">公司</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">部门</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">位置</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">个人网站</Label>
                  <Input
                    id="website"
                    value={formData.website || ""}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">通知设置</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>邮件通知</Label>
                      <Switch
                        checked={formData.preferences.notifications.email}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                email: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>推送通知</Label>
                      <Switch
                        checked={formData.preferences.notifications.push}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                push: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">隐私设置</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>显示邮箱</Label>
                      <Switch
                        checked={formData.preferences.privacy.showEmail}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              privacy: {
                                ...formData.preferences.privacy,
                                showEmail: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>显示位置</Label>
                      <Switch
                        checked={formData.preferences.privacy.showLocation}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              privacy: {
                                ...formData.preferences.privacy,
                                showLocation: checked,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">保存更改</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// 个人信息统计组件
interface ProfileStatsProps {
  stats: UserProfile["stats"]
  className?: string
}

export function ProfileStats({ stats, className }: ProfileStatsProps) {
  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <CardTitle>活动统计</CardTitle>
        <CardDescription>您的平台活动数据概览</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.projectsCompleted}</div>
            <div className="text-sm text-muted-foreground">完成项目</div>
            <Progress value={75} className="mt-2 h-1" />
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.collaborations}</div>
            <div className="text-sm text-muted-foreground">协作次数</div>
            <Progress value={60} className="mt-2 h-1" />
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.contributions}</div>
            <div className="text-sm text-muted-foreground">贡献数量</div>
            <Progress value={85} className="mt-2 h-1" />
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.reputation}</div>
            <div className="text-sm text-muted-foreground">声誉值</div>
            <Progress value={90} className="mt-2 h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
