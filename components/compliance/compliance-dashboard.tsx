"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react"

interface ComplianceData {
  featureAnalysis: {
    completenessScore: number
    categories: any[]
    priorityRecommendations: any[]
    complianceAnalysis: any
    roadmap: any[]
  }
  complianceReport: any
  bigDataInsights: {
    industryBenchmarks: any[]
    trendAnalysis: any[]
    competitorAnalysis: any
    roiAnalysis: any[]
    technicalDebtAnalysis: any[]
  }
}

export function ComplianceDashboard() {
  const [data, setData] = useState<ComplianceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchComplianceData()
  }, [])

  const fetchComplianceData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/compliance/analysis")
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error("获取合规数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">正在分析合规性...</span>
      </div>
    )
  }

  if (!data) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>无法加载合规性数据，请稍后重试。</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* 头部概览 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">功能完整性与合规性分析</h1>
          <p className="text-muted-foreground mt-2">基于大数据和行业最佳实践的全面分析报告</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchComplianceData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            刷新分析
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">功能完整度</p>
                <p className={`text-2xl font-bold ${getScoreColor(data.featureAnalysis.completenessScore)}`}>
                  {data.featureAnalysis.completenessScore.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={data.featureAnalysis.completenessScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">合规性得分</p>
                <p className={`text-2xl font-bold ${getScoreColor(data.complianceReport.overallScore)}`}>
                  {data.complianceReport.overallScore.toFixed(1)}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={data.complianceReport.overallScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">优先级任务</p>
                <p className="text-2xl font-bold text-orange-600">
                  {data.featureAnalysis.priorityRecommendations.length}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">关键合规问题</p>
                <p className="text-2xl font-bold text-red-600">
                  {data.featureAnalysis.complianceAnalysis.criticalIssues.length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="features">功能分析</TabsTrigger>
          <TabsTrigger value="compliance">合规检查</TabsTrigger>
          <TabsTrigger value="benchmarks">行业对比</TabsTrigger>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="roadmap">实施路线图</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {/* 功能分类分析 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>功能分类完整度</CardTitle>
              <CardDescription>各功能模块的实现状态和完整度评估</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.featureAnalysis.categories.map((category: any) => {
                  const implementedCount = category.features.filter((f: any) => f.status === "implemented").length
                  const totalCount = category.features.length
                  const completeness = (implementedCount / totalCount) * 100

                  return (
                    <div key={category.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant={getScoreBadgeVariant(completeness)}>{completeness.toFixed(0)}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <Progress value={completeness} className="mb-2" />
                      <div className="text-xs text-muted-foreground">
                        {implementedCount}/{totalCount} 功能已实现
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 优先级建议 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>优先级改进建议</CardTitle>
              <CardDescription>基于业务价值和合规要求的功能改进建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.featureAnalysis.priorityRecommendations.slice(0, 10).map((feature: any, index: number) => (
                  <div key={feature.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    {getPriorityIcon(feature.priority)}
                    <div className="flex-1">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {feature.estimatedEffort}人天
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          价值: {feature.businessValue}/10
                        </Badge>
                        {feature.complianceRequirement && (
                          <Badge variant="destructive" className="text-xs">
                            合规必需
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* 合规标准分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.complianceReport.standardsCompliance.map((item: any) => (
              <Card key={item.standard.id} className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {item.standard.name}
                    <Badge variant={getScoreBadgeVariant(item.score)}>{item.score.toFixed(0)}%</Badge>
                  </CardTitle>
                  <CardDescription>{item.standard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={item.score} className="mb-4" />
                  {item.criticalGaps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">关键合规缺口:</h4>
                      <ul className="space-y-1">
                        {item.criticalGaps.map((gap: any) => (
                          <li key={gap.id} className="text-sm text-muted-foreground flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            {gap.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 优先级合规行动 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>优先级合规行动</CardTitle>
              <CardDescription>需要立即关注的合规性问题</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.complianceReport.priorityActions.map((action: any) => (
                  <div key={action.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{action.title}</h3>
                      <Badge variant={action.implementationStatus === "non-compliant" ? "destructive" : "secondary"}>
                        {action.implementationStatus === "non-compliant" ? "不合规" : "部分合规"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                    {action.gaps.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">缺口: </span>
                        {action.gaps.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          {/* 行业基准对比 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>行业基准对比</CardTitle>
              <CardDescription>与行业平均水平和顶级表现者的对比分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.bigDataInsights.industryBenchmarks.map((benchmark: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{benchmark.metric}</h3>
                      <div className="flex items-center gap-2">
                        {benchmark.currentValue > benchmark.industryAverage ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-bold">
                          {benchmark.currentValue}
                          {benchmark.metric.includes("时间") ? "ms" : benchmark.metric.includes("率") ? "%" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">当前值</div>
                        <div className="font-bold">{benchmark.currentValue}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">行业平均</div>
                        <div className="font-bold">{benchmark.industryAverage}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">顶级表现</div>
                        <div className="font-bold">{benchmark.topPerformers}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{benchmark.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 竞争分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-green-600">优势分析</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.bigDataInsights.competitorAnalysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-red-600">改进空间</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.bigDataInsights.competitorAnalysis.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* 技术趋势分析 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>技术趋势分析</CardTitle>
              <CardDescription>影响平台发展的关键技术趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.bigDataInsights.trendAnalysis.map((trend: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{trend.trend}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            trend.impact === "high"
                              ? "destructive"
                              : trend.impact === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {trend.impact === "high" ? "高影响" : trend.impact === "medium" ? "中影响" : "低影响"}
                        </Badge>
                        <Badge variant="outline">{trend.timeframe}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{trend.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">行动建议:</h4>
                      <ul className="space-y-1">
                        {trend.actionItems.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROI分析 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>投资回报率分析</CardTitle>
              <CardDescription>各功能投资的预期回报和风险评估</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.bigDataInsights.roiAnalysis.map((roi: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{roi.feature}</h3>
                      <Badge
                        variant={
                          roi.riskLevel === "low" ? "default" : roi.riskLevel === "medium" ? "secondary" : "destructive"
                        }
                      >
                        {roi.riskLevel === "low" ? "低风险" : roi.riskLevel === "medium" ? "中风险" : "高风险"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">投资成本</div>
                        <div className="font-bold">¥{roi.investmentCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">预期回报</div>
                        <div className="font-bold text-green-600">¥{roi.expectedReturn.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">回收期</div>
                        <div className="font-bold">{roi.paybackPeriod}个月</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{roi.businessImpact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          {/* 实施路线图 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>功能实施路线图</CardTitle>
              <CardDescription>基于优先级和依赖关系的分阶段实施计划</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.featureAnalysis.roadmap.map((quarter: any, index: number) => (
                  <div key={index} className="relative">
                    {index > 0 && <div className="absolute left-6 -top-3 w-0.5 h-6 bg-gray-300" />}
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <span className="font-bold text-blue-600">{quarter.quarter}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">
                            {quarter.quarter} - {quarter.focusArea}
                          </h3>
                          <Badge variant="outline">{quarter.totalEffort}人天</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {quarter.features.map((feature: any) => (
                            <div key={feature.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{feature.name}</span>
                                {getPriorityIcon(feature.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{feature.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {feature.estimatedEffort}人天
                                </Badge>
                                {feature.complianceRequirement && (
                                  <Badge variant="destructive" className="text-xs">
                                    合规
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 技术债务分析 */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>技术债务分析</CardTitle>
              <CardDescription>需要重点关注的技术债务和改进建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.bigDataInsights.technicalDebtAnalysis.map((debt: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{debt.category}</h3>
                      <Badge
                        variant={
                          debt.debtLevel === "critical"
                            ? "destructive"
                            : debt.debtLevel === "high"
                              ? "destructive"
                              : debt.debtLevel === "medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {debt.debtLevel === "critical"
                          ? "严重"
                          : debt.debtLevel === "high"
                            ? "高"
                            : debt.debtLevel === "medium"
                              ? "中"
                              : "低"}
                        债务
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">影响: </span>
                      {debt.impact}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">解决方案: </span>
                      {debt.remediation}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      预计工作量: {debt.effort}人天
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 页脚信息 */}
      <div className="text-center text-sm text-muted-foreground">
        最后更新: {lastUpdate.toLocaleString("zh-CN")} | 基于行业大数据和最佳实践分析
      </div>
    </div>
  )
}
