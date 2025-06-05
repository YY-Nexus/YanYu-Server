"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  Database,
  Code,
  BarChart3,
} from "lucide-react"

interface MissingFeatureDetailProps {
  featureId: string
}

export function MissingFeatureDetail({ featureId }: MissingFeatureDetailProps) {
  const [featureData, setFeatureData] = useState<any>(null)
  const [implementationPlan, setImplementationPlan] = useState<any>(null)
  const [riskAssessment, setRiskAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedPhases, setExpandedPhases] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    fetchFeatureData()
  }, [featureId])

  const fetchFeatureData = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      const mockData = getMockFeatureData(featureId)
      setFeatureData(mockData.feature)
      setImplementationPlan(mockData.plan)
      setRiskAssessment(mockData.risks)
    } catch (error) {
      console.error("获取功能详情失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMockFeatureData = (id: string) => {
    // 这里应该调用实际的API，现在使用模拟数据
    const features = {
      "data-lineage-tracking": {
        feature: {
          id: "data-lineage-tracking",
          name: "数据血缘追踪",
          category: "数据治理",
          currentStatus: "missing",
          businessImpact: "确保数据质量、支持合规审计、提高数据可信度，降低数据治理风险",
          technicalComplexity: "high",
          complianceRisk: "critical",
          implementationPhases: [
            {
              phase: 1,
              name: "基础架构搭建",
              description: "建立数据血缘追踪的基础设施和元数据管理",
              duration: 8,
              deliverables: ["元数据存储系统", "血缘关系模型", "数据采集框架"],
              technicalTasks: [
                {
                  id: "metadata-schema",
                  name: "元数据模式设计",
                  description: "设计数据血缘的元数据存储模式",
                  effort: 3,
                  skillsRequired: ["数据架构", "数据库设计"],
                  tools: ["PostgreSQL", "Neo4j"],
                },
                {
                  id: "lineage-collector",
                  name: "血缘采集器",
                  description: "开发自动化数据血缘采集组件",
                  effort: 5,
                  skillsRequired: ["Python", "数据工程", "API开发"],
                  tools: ["Apache Airflow", "Kafka"],
                },
              ],
            },
            {
              phase: 2,
              name: "血缘分析引擎",
              description: "实现血缘关系分析和影响分析功能",
              duration: 10,
              deliverables: ["血缘分析引擎", "影响分析算法", "查询优化"],
              technicalTasks: [
                {
                  id: "lineage-engine",
                  name: "血缘分析引擎",
                  description: "构建图数据库查询和分析引擎",
                  effort: 6,
                  skillsRequired: ["图数据库", "算法设计", "性能优化"],
                  tools: ["Neo4j", "Cypher", "Redis"],
                },
              ],
            },
            {
              phase: 3,
              name: "可视化与集成",
              description: "开发血缘可视化界面和系统集成",
              duration: 7,
              deliverables: ["血缘可视化组件", "API接口", "集成文档"],
              technicalTasks: [
                {
                  id: "lineage-visualization",
                  name: "血缘可视化",
                  description: "开发交互式血缘图可视化组件",
                  effort: 4,
                  skillsRequired: ["前端开发", "数据可视化", "React"],
                  tools: ["D3.js", "Cytoscape.js", "React"],
                },
              ],
            },
          ],
          successMetrics: [
            {
              metric: "血缘覆盖率",
              target: ">90%",
              measurement: "已追踪数据源/总数据源",
              timeline: "实施后3个月",
            },
            {
              metric: "查询响应时间",
              target: "<2秒",
              measurement: "平均血缘查询响应时间",
              timeline: "实施后1个月",
            },
          ],
        },
        plan: {
          totalDuration: 25,
          totalEffort: 18,
          resourceRequirements: {
            数据架构: 8,
            前端开发: 4,
            图数据库: 6,
          },
          timeline: [
            { phase: 1, startWeek: 1, endWeek: 2 },
            { phase: 2, startWeek: 3, endWeek: 5 },
            { phase: 3, startWeek: 6, endWeek: 7 },
          ],
        },
        risks: {
          overallRisk: "medium",
          riskMatrix: {
            technical: { probability: "medium", impact: "high", score: 6 },
            business: { probability: "high", impact: "medium", score: 6 },
          },
          mitigationPlan: ["采用图数据库分片和缓存策略", "建立标准化数据接口和适配器模式"],
        },
      },
    }

    return features[id as keyof typeof features] || features["data-lineage-tracking"]
  }

  const togglePhase = (phaseIndex: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseIndex]: !prev[phaseIndex],
    }))
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "default"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "数据治理":
        return <Database className="h-5 w-5" />
      case "安全合规":
        return <Shield className="h-5 w-5" />
      case "集成与API":
        return <Code className="h-5 w-5" />
      case "分析与报告":
        return <BarChart3 className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">正在加载功能详情...</span>
      </div>
    )
  }

  if (!featureData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>未找到功能详情，请检查功能ID。</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* 功能概览 */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getCategoryIcon(featureData.category)}
              <div>
                <CardTitle className="text-2xl">{featureData.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{featureData.category}</Badge>
                  <Badge variant={getComplexityBadge(featureData.technicalComplexity)}>
                    {featureData.technicalComplexity === "low"
                      ? "低复杂度"
                      : featureData.technicalComplexity === "medium"
                        ? "中复杂度"
                        : featureData.technicalComplexity === "high"
                          ? "高复杂度"
                          : "极高复杂度"}
                  </Badge>
                  <Badge
                    variant={
                      featureData.complianceRisk === "critical"
                        ? "destructive"
                        : featureData.complianceRisk === "high"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {featureData.complianceRisk === "critical"
                      ? "关键合规风险"
                      : featureData.complianceRisk === "high"
                        ? "高合规风险"
                        : "中合规风险"}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">预计工作量</div>
              <div className="text-2xl font-bold text-blue-600">{implementationPlan.totalEffort}人天</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                业务影响
              </h4>
              <p className="text-sm text-muted-foreground">{featureData.businessImpact}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                实施周期
              </h4>
              <p className="text-sm text-muted-foreground">{implementationPlan.totalDuration}个工作日</p>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                关键技能
              </h4>
              <div className="flex flex-wrap gap-1">
                {Object.keys(implementationPlan.resourceRequirements).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="phases">实施阶段</TabsTrigger>
          <TabsTrigger value="timeline">时间规划</TabsTrigger>
          <TabsTrigger value="risks">风险评估</TabsTrigger>
          <TabsTrigger value="metrics">成功指标</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          {featureData.implementationPhases.map((phase: any, index: number) => (
            <Card key={index} className="glass-effect">
              <Collapsible open={expandedPhases[index]} onOpenChange={() => togglePhase(index)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <span className="font-bold text-blue-600">{phase.phase}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{phase.name}</CardTitle>
                          <CardDescription>{phase.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{phase.duration}天</Badge>
                        {expandedPhases[index] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">交付成果</h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((deliverable: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">技术任务</h4>
                        <div className="space-y-3">
                          {phase.technicalTasks.map((task: any, idx: number) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{task.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {task.effort}天
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {task.skillsRequired.map((skill: string, skillIdx: number) => (
                                  <Badge key={skillIdx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              {task.tools && (
                                <div className="mt-2">
                                  <span className="text-xs text-muted-foreground">工具: </span>
                                  <span className="text-xs">{task.tools.join(", ")}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>实施时间线</CardTitle>
              <CardDescription>各阶段的时间安排和依赖关系</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {implementationPlan.timeline.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <span className="font-bold text-blue-600">P{item.phase}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{featureData.implementationPhases[index].name}</span>
                        <span className="text-sm text-muted-foreground">
                          第{item.startWeek}-{item.endWeek}周
                        </span>
                      </div>
                      <Progress
                        value={((item.endWeek - item.startWeek + 1) / implementationPlan.totalDuration) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  资源需求分析
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(implementationPlan.resourceRequirements).map(([skill, days]) => (
                    <div key={skill} className="text-center">
                      <div className="text-lg font-bold text-blue-600">{days as number}天</div>
                      <div className="text-sm text-muted-foreground">{skill}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                风险评估矩阵
              </CardTitle>
              <CardDescription>
                整体风险等级:
                <Badge variant={riskAssessment.overallRisk === "high" ? "destructive" : "secondary"} className="ml-2">
                  {riskAssessment.overallRisk === "high"
                    ? "高风险"
                    : riskAssessment.overallRisk === "medium"
                      ? "中风险"
                      : "低风险"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">风险分类</h4>
                  <div className="space-y-3">
                    {Object.entries(riskAssessment.riskMatrix).map(([category, risk]: [string, any]) => (
                      <div key={category} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">
                            {category === "technical"
                              ? "技术风险"
                              : category === "business"
                                ? "业务风险"
                                : category === "compliance"
                                  ? "合规风险"
                                  : "资源风险"}
                          </span>
                          <Badge variant={risk.score > 6 ? "destructive" : "secondary"}>风险值: {risk.score}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">概率: </span>
                            <span
                              className={
                                risk.probability === "high"
                                  ? "text-red-600"
                                  : risk.probability === "medium"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }
                            >
                              {risk.probability === "high" ? "高" : risk.probability === "medium" ? "中" : "低"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">影响: </span>
                            <span
                              className={
                                risk.impact === "high"
                                  ? "text-red-600"
                                  : risk.impact === "medium"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }
                            >
                              {risk.impact === "high" ? "高" : risk.impact === "medium" ? "中" : "低"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">缓解措施</h4>
                  <div className="space-y-2">
                    {riskAssessment.mitigationPlan.map((mitigation: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{mitigation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                成功指标与验收标准
              </CardTitle>
              <CardDescription>衡量功能实施成功的关键指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureData.successMetrics.map((metric: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{metric.metric}</h4>
                      <Badge variant="outline">{metric.timeline}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">目标值: </span>
                        <span className="font-bold text-green-600">{metric.target}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">测量方法: </span>
                        <span className="text-sm">{metric.measurement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  关键验收标准
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    所有阶段交付成果通过质量检查
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    性能指标达到预期目标
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    安全性和合规性要求满足
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    用户培训和文档完整
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    系统集成测试通过
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 行动建议 */}
      <Card className="glass-effect border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">立即行动建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-blue-700">准备工作</h4>
              <ul className="space-y-1 text-sm">
                <li>• 组建专项实施团队</li>
                <li>• 确认技术栈和工具选型</li>
                <li>• 制定详细的项目计划</li>
                <li>• 准备开发和测试环境</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-700">风险控制</h4>
              <ul className="space-y-1 text-sm">
                <li>• 建立每周进度检查机制</li>
                <li>• 设置关键里程碑检查点</li>
                <li>• 准备应急预案和回滚策略</li>
                <li>• 安排技能培训和知识转移</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
