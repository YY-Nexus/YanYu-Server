import { NextResponse } from "next/server"
import { featureAnalyzer } from "@/lib/compliance/feature-analysis"
import { complianceChecker } from "@/lib/compliance/compliance-checker"
import { bigDataInsights } from "@/lib/compliance/big-data-insights"

export async function GET() {
  try {
    // 获取功能完整性分析
    const completenessScore = featureAnalyzer.calculateCompleteness()
    const categories = featureAnalyzer.getCategories()
    const priorityRecommendations = featureAnalyzer.getPriorityRecommendations()
    const complianceAnalysis = featureAnalyzer.getComplianceAnalysis()
    const roadmap = featureAnalyzer.generateRoadmap()

    // 获取合规性分析
    const complianceReport = complianceChecker.getComplianceReport()

    // 获取大数据洞察
    const industryBenchmarks = bigDataInsights.getIndustryBenchmarks()
    const trendAnalysis = bigDataInsights.getTrendAnalysis()
    const competitorAnalysis = bigDataInsights.getCompetitorAnalysis()
    const roiAnalysis = bigDataInsights.getROIAnalysis()
    const technicalDebtAnalysis = bigDataInsights.getTechnicalDebtAnalysis()

    return NextResponse.json({
      success: true,
      data: {
        featureAnalysis: {
          completenessScore,
          categories,
          priorityRecommendations,
          complianceAnalysis,
          roadmap,
        },
        complianceReport,
        bigDataInsights: {
          industryBenchmarks,
          trendAnalysis,
          competitorAnalysis,
          roiAnalysis,
          technicalDebtAnalysis,
        },
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("合规性分析失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: "合规性分析失败",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
