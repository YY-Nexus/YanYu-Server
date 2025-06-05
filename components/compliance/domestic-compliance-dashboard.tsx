"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingDown,
  TrendingUp,
  Shield,
  Calendar,
  Zap,
} from "lucide-react"

export function DomesticComplianceDashboard() {
  const [complianceData, setComplianceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplianceData()
  }, [])

  const fetchComplianceData = async () => {
    setLoading(true)
    try {
      // 模拟API调用，获取国内合规数据
      const mockData = {
        adjustedPriorities: {
          immediate: [
            {
              id: "cybersecurity-law-compliance",
              name: "网络安全法合规",
              effort: 20,
              costBenefit: "high",
              userImpact: "high",
            },
            {
              id: "data-security-law-compliance",
              name: "数据安全法合规",
              effort: 18,
              costBenefit: "high",
              userImpact: "high",
            },
            {
              id: "pipl-compliance",
              name: "个人信息保护法合规",
              effort: 15,
              costBenefit: "high",
              userImpact: "high",
            },
          ],
          shortTerm: [
            {
              id: "zero-trust-architecture",
              name: "轻量级零信任架构",
              effort: 25,
              costBenefit: "high",
              userImpact: "high",
            },
            {
              id: "user-experience-optimization",
              name: "用户体验优化",
              effort: 15,
              costBenefit: "high",
              userImpact: "high",
            },
            {
              id: "simplified-monitoring",
              name: "简化监控系统",
              effort: 8,
              costBenefit: "high",
              userImpact: "high",
            },
          ],
          mediumTerm: [
            {
              id: "data-lineage-tracking",
              name: "简化数据血缘追踪",
              effort: 15,
              costBenefit: "medium",
              userImpact: "medium",
            },
            {
              id: "basic-api-management",
              name: "基础API管理",
              effort: 12,
              costBenefit: "medium",
              userImpact: "medium",
            },
            {
              id: "domestic-integration",
              name: "国产化集成",
              effort: 12,
              costBenefit: "medium",
              userImpact: "medium",
            },
          ],
          skip: [
            {
              id: "gdpr-compliance-enhancement",
              name: "GDPR合规完善",
              effort: 0,
              reason: "仅国内使用，无需GDPR合规",
            },
          ],
        },
        effortSummary: {
          totalEffort: 105,
          originalEffort: 200,
          costSavings: 95,
          effortByPriority: {
            immediate: 53,
            shortTerm: 48,
            mediumTerm: 39,
          },
        },
        legalCompliance: {
          networkSecurityLaw: {
            status: "partial",
            completedItems: 2,
            totalItems: 5,
            urgentTasks: ["等级保护备案", "应急预案制定"],
          },
          dataSecurityLaw: {
            status: "planning",
            completedItems: 0,
            totalItems: 4,
            urgentTasks: ["数据分类分级", "重要数据识别"],
          },
          pipl: {
            status: "partial",
            completedItems: 1,
            totalItems: 4,
            urgentTasks: ["隐私政策完善", "用户权利机制"],
          },
        },
        quickWins: [
          { task: "实施基础身份认证", timeline: "2周", impact: "高" },
          { task: "优化核心用户界面", timeline: "3周", impact: "高" },
          { task: "建立简化监控", timeline: "2周", impact: "中" },
          { task: "完善隐私政策", timeline: "1周", impact: "高" },
        ],
      }
      setComplianceData(mockData)
    } catch (error) {
      console.error("获取合规数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "partial":
        return "text-yellow-600"
      case "planning":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "partial":
        return "secondary"
      case "planning":
        return "outline"
      default:
        return "destructive"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">正在加载国内合规分析...</span>
      </div>
    )
  }

  if (!complianceData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>无法加载合规数据，请稍后重试。</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* 调整后的优先级概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">成本节约</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">{complianceData.effortSummary.costSavings}人天</div>
            <div className="flex items-center text-sm text-green-700">
              <TrendingDown className="h-4 w-4 mr-1" />
              节约47.5%工作量
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-800">调整后总工作量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">{complianceData.effortSummary.totalEffort}人天</div>
            <div className="text-sm text-blue-700">原计划: {complianceData.effortSummary.originalEffort}人天</div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-orange-800">立即执行</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {complianceData.adjustedPriorities.immediate.length}项
            </div>
            <div className="text-sm text-orange-700">{complianceData.effortSummary.effortByPriority.immediate}人天</div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-800">跳过功能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {complianceData.adjustedPriorities.skip.length}项
            </div>
            <div className="text-sm text-purple-700">GDPR等国外合规</div>
          </CardContent>
        </Card>
      </div>

      {/* 国内法律合规状态 */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            国内法律法规合规状态
          </CardTitle>
          <CardDescription>网络安全法、数据安全法、个人信息保护法合规进度</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 网络安全法 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">网络安全法</h4>
                <Badge variant={getStatusBadge(complianceData.legalCompliance.networkSecurityLaw.status)}>
                  {complianceData.legalCompliance.networkSecurityLaw.status === "partial" ? "部分完成" : "规划中"}
                </Badge>
              </div>
              <Progress
                value={
                  (complianceData.legalCompliance.networkSecurityLaw.completedItems /
                    complianceData.legalCompliance.networkSecurityLaw.totalItems) *
                  100
                }
                className="h-2"
              />
              <div className="text-sm text-muted-foreground">
                {complianceData.legalCompliance.networkSecurityLaw.completedItems}/
                {complianceData.legalCompliance.networkSecurityLaw.totalItems} 项已完成
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-red-600">紧急任务:</div>
                {complianceData.legalCompliance.networkSecurityLaw.urgentTasks.map((task: string, index: number) => (
                  <div key={index} className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {task}
                  </div>
                ))}
              </div>
            </div>

            {/* 数据安全法 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">数据安全法</h4>
                <Badge variant={getStatusBadge(complianceData.legalCompliance.dataSecurityLaw.status)}>
                  {complianceData.legalCompliance.dataSecurityLaw.status === "planning" ? "规划中" : "进行中"}
                </Badge>
              </div>
              <Progress
                value={
                  (complianceData.legalCompliance.dataSecurityLaw.completedItems /
                    complianceData.legalCompliance.dataSecurityLaw.totalItems) *
                  100
                }
                className="h-2"
              />
              <div className="text-sm text-muted-foreground">
                {complianceData.legalCompliance.dataSecurityLaw.completedItems}/
                {complianceData.legalCompliance.dataSecurityLaw.totalItems} 项已完成
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-red-600">紧急任务:</div>
                {complianceData.legalCompliance.dataSecurityLaw.urgentTasks.map((task: string, index: number) => (
                  <div key={index} className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {task}
                  </div>
                ))}
              </div>
            </div>

            {/* 个人信息保护法 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">个人信息保护法</h4>
                <Badge variant={getStatusBadge(complianceData.legalCompliance.pipl.status)}>
                  {complianceData.legalCompliance.pipl.status === "partial" ? "部分完成" : "规划中"}
                </Badge>
              </div>
              <Progress
                value={
                  (complianceData.legalCompliance.pipl.completedItems /
                    complianceData.legalCompliance.pipl.totalItems) *
                  100
                }
                className="h-2"
              />
              <div className="text-sm text-muted-foreground">
                {complianceData.legalCompliance.pipl.completedItems}/{complianceData.legalCompliance.pipl.totalItems}{" "}
                项已完成
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-red-600">紧急任务:</div>
                {complianceData.legalCompliance.pipl.urgentTasks.map((task: string, index: number) => (
                  <div key={index} className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {task}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="priorities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="priorities">调整后优先级</TabsTrigger>
          <TabsTrigger value="quickwins">快速见效</TabsTrigger>
          <TabsTrigger value="savings">成本节约</TabsTrigger>
          <TabsTrigger value="roadmap">实施路线图</TabsTrigger>
        </TabsList>

        <TabsContent value="priorities" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 立即执行 */}
            <Card className="glass-effect border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  立即执行 (Q1)
                </CardTitle>
                <CardDescription>{complianceData.effortSummary.effortByPriority.immediate}人天</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.adjustedPriorities.immediate.map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <Badge variant="destructive" className="text-xs">
                          {item.effort}天
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.costBenefit === "high" ? "高收益" : "中收益"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.userImpact === "high" ? "高影响" : "中影响"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 短期实施 */}
            <Card className="glass-effect border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  短期实施 (Q2)
                </CardTitle>
                <CardDescription>{complianceData.effortSummary.effortByPriority.shortTerm}人天</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.adjustedPriorities.shortTerm.map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.effort}天
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.costBenefit === "high" ? "高收益" : "中收益"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.userImpact === "high" ? "高影响" : "中影响"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 中期规划 */}
            <Card className="glass-effect border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  中期规划 (Q3-Q4)
                </CardTitle>
                <CardDescription>{complianceData.effortSummary.effortByPriority.mediumTerm}人天</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.adjustedPriorities.mediumTerm.map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.effort}天
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.costBenefit === "medium" ? "中收益" : "低收益"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.userImpact === "medium" ? "中影响" : "低影响"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 跳过的功能 */}
          <Card className="glass-effect border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-gray-600">暂不实施的功能</CardTitle>
              <CardDescription>基于国内使用场景，以下功能暂不需要实施</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {complianceData.adjustedPriorities.skip.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <div className="text-sm text-gray-500">{item.reason}</div>
                    </div>
                    <Badge variant="outline" className="text-gray-500">
                      跳过
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quickwins" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                快速见效项目
              </CardTitle>
              <CardDescription>可以在短期内实施并快速看到效果的改进项目</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceData.quickWins.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{item.task}</h4>
                      <Badge variant={item.impact === "高" ? "default" : "secondary"}>{item.impact}影响</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      预计时间: {item.timeline}
                    </div>
                    <Button size="sm" className="mt-3 w-full">
                      开始实施
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-green-600">成本节约分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span>原计划工作量</span>
                    <span className="font-bold">{complianceData.effortSummary.originalEffort}人天</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span>调整后工作量</span>
                    <span className="font-bold text-blue-600">{complianceData.effortSummary.totalEffort}人天</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <span>节约工作量</span>
                    <span className="font-bold text-green-600">{complianceData.effortSummary.costSavings}人天</span>
                  </div>
                  <div className="text-center p-4 bg-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">47.5%</div>
                    <div className="text-sm text-green-600">成本节约比例</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-blue-600">资源重新分配</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>立即执行</span>
                      <span>{complianceData.effortSummary.effortByPriority.immediate}人天</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>短期实施</span>
                      <span>{complianceData.effortSummary.effortByPriority.shortTerm}人天</span>
                    </div>
                    <Progress value={46} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>中期规划</span>
                      <span>{complianceData.effortSummary.effortByPriority.mediumTerm}人天</span>
                    </div>
                    <Progress value={37} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>国内化实施路线图</CardTitle>
              <CardDescription>针对国内小范围使用场景的优化实施计划</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Q1 */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-bold text-red-600 mb-2">Q1: 法律合规与安全基础 (53人天)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-red-50 rounded">
                      <div className="font-medium">网络安全法合规</div>
                      <div className="text-sm text-muted-foreground">等级保护、应急预案</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <div className="font-medium">数据安全法合规</div>
                      <div className="text-sm text-muted-foreground">数据分类分级</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <div className="font-medium">个人信息保护法合规</div>
                      <div className="text-sm text-muted-foreground">隐私政策、用户权利</div>
                    </div>
                  </div>
                </div>

                {/* Q2 */}
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-bold text-yellow-600 mb-2">Q2: 安全架构与用户体验 (48人天)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-yellow-50 rounded">
                      <div className="font-medium">轻量级零信任</div>
                      <div className="text-sm text-muted-foreground">身份认证、访问控制</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded">
                      <div className="font-medium">用户体验优化</div>
                      <div className="text-sm text-muted-foreground">界面优化、交互改进</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded">
                      <div className="font-medium">简化监控</div>
                      <div className="text-sm text-muted-foreground">核心指标监控</div>
                    </div>
                  </div>
                </div>

                {/* Q3-Q4 */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-blue-600 mb-2">Q3-Q4: 功能完善与国产化 (39人天)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-medium">简化数据血缘</div>
                      <div className="text-sm text-muted-foreground">核心数据追踪</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-medium">基础API管理</div>
                      <div className="text-sm text-muted-foreground">轻量级网关</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-medium">国产化集成</div>
                      <div className="text-sm text-muted-foreground">国产数据库、中间件</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 立即行动建议 */}
      <Card className="glass-effect border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">立即行动建议</CardTitle>
          <CardDescription>基于国内小范围使用场景的优化建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-orange-700">本周内完成</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  制定隐私政策和用户协议
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  启动等级保护备案准备工作
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  建立项目实施团队
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  确定技术选型和工具链
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-orange-700">本月内完成</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  实施基础身份认证机制
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  建立数据分类分级标准
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  部署基础安全监控
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  优化核心用户界面
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
