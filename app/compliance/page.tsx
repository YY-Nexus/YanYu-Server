"use client"

import type { Viewport } from "next"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Shield, FileText, Users, Lock, Eye, Database, AlertTriangle } from "lucide-react"

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

export default function CompliancePage() {
  const breadcrumbItems = [{ label: "首页", href: "/" }, { label: "合规信息" }]

  const complianceItems = [
    {
      title: "GDPR (通用数据保护条例)",
      status: "compliant",
      description: "符合欧盟通用数据保护条例要求",
      details: ["用户数据加密存储", "提供数据删除权利", "明确的隐私政策", "数据处理透明度"],
    },
    {
      title: "CCPA (加州消费者隐私法)",
      status: "compliant",
      description: "符合加州消费者隐私法要求",
      details: ["用户数据访问权", "数据销售选择退出", "数据收集透明度", "非歧视性原则"],
    },
    {
      title: "SOC 2 Type II",
      status: "in-progress",
      description: "正在进行SOC 2 Type II认证",
      details: ["安全控制措施", "可用性保证", "处理完整性", "保密性维护"],
    },
    {
      title: "ISO 27001",
      status: "planned",
      description: "计划获得ISO 27001信息安全管理认证",
      details: ["信息安全管理体系", "风险评估流程", "安全控制实施", "持续改进机制"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "planned":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "compliant":
        return "已合规"
      case "in-progress":
        return "进行中"
      case "planned":
        return "计划中"
      default:
        return "未知"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header title="合规信息" showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 概览 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                合规概览
              </CardTitle>
              <CardDescription>我们致力于遵守全球数据保护和隐私法规</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2</div>
                  <p className="text-sm text-muted-foreground">已合规标准</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">1</div>
                  <p className="text-sm text-muted-foreground">进行中认证</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1</div>
                  <p className="text-sm text-muted-foreground">计划中标准</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="standards" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="standards">合规标准</TabsTrigger>
              <TabsTrigger value="privacy">隐私政策</TabsTrigger>
              <TabsTrigger value="security">安全措施</TabsTrigger>
              <TabsTrigger value="contact">联系我们</TabsTrigger>
            </TabsList>

            {/* 合规标准 */}
            <TabsContent value="standards">
              <div className="space-y-6">
                {complianceItems.map((item, index) => (
                  <Card key={index} className="glass-effect">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {item.title}
                        </CardTitle>
                        <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 隐私政策 */}
            <TabsContent value="privacy">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    隐私政策
                  </CardTitle>
                  <CardDescription>我们如何收集、使用和保护您的个人信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">信息收集</h3>
                      <p className="text-sm text-muted-foreground">
                        我们仅收集为提供服务所必需的信息，包括账户信息、使用数据和技术信息。
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">信息使用</h3>
                      <p className="text-sm text-muted-foreground">
                        收集的信息用于提供和改进服务、确保安全性、遵守法律要求。
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">信息保护</h3>
                      <p className="text-sm text-muted-foreground">
                        我们采用行业标准的安全措施保护您的信息，包括加密、访问控制和定期安全审计。
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">用户权利</h3>
                      <p className="text-sm text-muted-foreground">
                        您有权访问、更正、删除您的个人信息，以及限制或反对某些处理活动。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 安全措施 */}
            <TabsContent value="security">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      数据加密
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        传输中加密 (TLS 1.3)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        静态数据加密 (AES-256)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        密钥管理系统
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      访问控制
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        多因素认证
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        基于角色的权限
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        定期权限审查
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      数据备份
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        自动化备份
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        异地存储
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        定期恢复测试
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      安全监控
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        24/7 安全监控
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        威胁检测系统
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        事件响应计划
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 联系我们 */}
            <TabsContent value="contact">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    合规联系方式
                  </CardTitle>
                  <CardDescription>如有合规相关问题，请联系我们</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">数据保护官 (DPO)</h3>
                      <p className="text-sm text-muted-foreground mb-2">负责数据保护和隐私相关事务</p>
                      <p className="text-sm">
                        <strong>邮箱:</strong> dpo@yanyuyun.asia
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">合规团队</h3>
                      <p className="text-sm text-muted-foreground mb-2">处理合规性问题和认证事务</p>
                      <p className="text-sm">
                        <strong>邮箱:</strong> compliance@yanyuyun.asia
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">法务部门</h3>
                      <p className="text-sm text-muted-foreground mb-2">处理法律相关问题和合同事务</p>
                      <p className="text-sm">
                        <strong>邮箱:</strong> legal@yanyuyun.asia
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">安全团队</h3>
                      <p className="text-sm text-muted-foreground mb-2">处理安全事件和漏洞报告</p>
                      <p className="text-sm">
                        <strong>邮箱:</strong> security@yanyuyun.asia
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-2">办公地址</h3>
                    <p className="text-sm text-muted-foreground">
                      中国北京市朝阳区建国门外大街1号
                      <br />
                      国贸大厦A座2001室
                      <br />
                      邮编: 100020
                    </p>
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
