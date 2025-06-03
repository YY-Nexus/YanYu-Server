"use client"

import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Download,
  ExternalLink,
} from "lucide-react"

export default function HelpPage() {
  const breadcrumbItems = [{ label: "首页", href: "/" }, { label: "帮助中心" }]

  const faqData = [
    {
      question: "如何开始使用AI协同平台？",
      answer:
        "首先注册账户，然后访问模型管理页面选择合适的AI模型，配置相关参数后即可开始使用。建议先查看快速入门指南。",
    },
    {
      question: "支持哪些AI模型？",
      answer: "平台支持多种主流AI模型，包括GPT系列、Claude、Gemini等。您可以在模型管理页面查看完整的支持列表。",
    },
    {
      question: "如何配置安全审计？",
      answer: "在系统设置中启用安全审计功能，配置审计规则和告警阈值。系统会自动记录所有操作日志并进行安全分析。",
    },
    {
      question: "数据是否安全？",
      answer: "我们采用企业级安全措施，包括数据加密、访问控制、安全审计等。所有数据都经过严格的安全保护。",
    },
    {
      question: "如何联系技术支持？",
      answer: "您可以通过在线客服、邮件或电话联系我们的技术支持团队。我们提供7x24小时的技术支持服务。",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header title="帮助中心" showBreadcrumb={true} breadcrumbItems={breadcrumbItems} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 搜索区域 */}
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <HelpCircle className="w-12 h-12 mx-auto text-blue-600" />
                <h2 className="text-2xl font-bold">我们如何帮助您？</h2>
                <p className="text-muted-foreground">搜索常见问题或浏览帮助文档</p>
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="搜索帮助内容..." className="pl-10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 帮助内容 */}
          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq">常见问题</TabsTrigger>
              <TabsTrigger value="guides">使用指南</TabsTrigger>
              <TabsTrigger value="api">API文档</TabsTrigger>
              <TabsTrigger value="contact">联系我们</TabsTrigger>
            </TabsList>

            {/* 常见问题 */}
            <TabsContent value="faq">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    常见问题
                  </CardTitle>
                  <CardDescription>查找最常见问题的答案</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqData.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 使用指南 */}
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "快速入门指南",
                    description: "5分钟快速上手AI协同平台",
                    icon: Book,
                    badge: "推荐",
                    type: "文档",
                  },
                  {
                    title: "模型配置教程",
                    description: "详细的AI模型配置步骤",
                    icon: Video,
                    badge: "视频",
                    type: "视频",
                  },
                  {
                    title: "安全设置指南",
                    description: "如何配置系统安全功能",
                    icon: FileText,
                    badge: "重要",
                    type: "文档",
                  },
                  {
                    title: "监控配置手册",
                    description: "系统监控和告警配置",
                    icon: Download,
                    badge: "PDF",
                    type: "下载",
                  },
                ].map((guide, index) => (
                  <Card key={index} className="glass-effect hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <guide.icon className="w-8 h-8 text-blue-600" />
                        <Badge variant="secondary">{guide.badge}</Badge>
                      </div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        查看{guide.type}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* API文档 */}
            <TabsContent value="api">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    API文档
                  </CardTitle>
                  <CardDescription>开发者API接口文档和示例</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">REST API</h4>
                      <p className="text-sm text-muted-foreground mb-3">完整的REST API接口文档</p>
                      <Button variant="outline" size="sm">
                        查看文档
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">WebSocket API</h4>
                      <p className="text-sm text-muted-foreground mb-3">实时通信接口文档</p>
                      <Button variant="outline" size="sm">
                        查看文档
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">SDK下载</h4>
                      <p className="text-sm text-muted-foreground mb-3">多语言SDK和示例代码</p>
                      <Button variant="outline" size="sm">
                        下载SDK
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 联系我们 */}
            <TabsContent value="contact">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      在线客服
                    </CardTitle>
                    <CardDescription>7x24小时在线技术支持</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">我们的技术支持团队随时为您提供帮助</p>
                    <Button className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      开始对话
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      邮件支持
                    </CardTitle>
                    <CardDescription>发送邮件获取技术支持</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>技术支持:</strong> support@yanyuyun.asia
                      </p>
                      <p className="text-sm">
                        <strong>商务合作:</strong> business@yanyuyun.asia
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      发送邮件
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      电话支持
                    </CardTitle>
                    <CardDescription>紧急情况请直接致电</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>技术热线:</strong> 400-888-0000
                      </p>
                      <p className="text-sm">
                        <strong>服务时间:</strong> 周一至周日 9:00-21:00
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      立即致电
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>社区支持</CardTitle>
                    <CardDescription>加入用户社区获取帮助</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm">与其他用户交流经验</p>
                      <p className="text-sm">获取最新产品资讯</p>
                      <p className="text-sm">参与产品功能讨论</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      加入社区
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
