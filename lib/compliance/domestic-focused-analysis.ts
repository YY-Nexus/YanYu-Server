/**
 * 国内小范围应用的缺失功能重新评估
 * 基于实际使用场景调整优先级和实施方案
 */

export interface DomesticFeatureAnalysis {
  id: string
  name: string
  category: string
  domesticRelevance: "critical" | "important" | "optional" | "unnecessary"
  actualPriority: "immediate" | "short-term" | "medium-term" | "long-term" | "skip"
  costBenefit: "high" | "medium" | "low"
  implementationComplexity: "simple" | "moderate" | "complex"
  userImpact: "high" | "medium" | "low"
  complianceRequirement: "mandatory" | "recommended" | "optional"
  adjustedEffort: number // 调整后的工作量
  justification: string // 调整理由
}

export class DomesticComplianceAnalyzer {
  private features: DomesticFeatureAnalysis[] = []

  constructor() {
    this.initializeDomesticAnalysis()
  }

  private initializeDomesticAnalysis(): void {
    this.features = [
      // 重新评估的功能优先级
      {
        id: "data-lineage-tracking",
        name: "数据血缘追踪",
        category: "数据治理",
        domesticRelevance: "important", // 从critical降级
        actualPriority: "medium-term", // 从immediate降级
        costBenefit: "medium", // 从high降级
        implementationComplexity: "complex",
        userImpact: "medium", // 小范围使用，影响有限
        complianceRequirement: "optional", // 国内小范围不强制要求
        adjustedEffort: 15, // 从25人天减少到15人天
        justification: "小范围使用场景下，可以采用简化的数据追踪方案，重点关注核心数据流",
      },
      {
        id: "gdpr-compliance-enhancement",
        name: "GDPR合规完善",
        category: "数据治理",
        domesticRelevance: "unnecessary", // 国内应用不需要
        actualPriority: "skip", // 完全跳过
        costBenefit: "low",
        implementationComplexity: "complex",
        userImpact: "low",
        complianceRequirement: "optional",
        adjustedEffort: 0, // 完全不需要
        justification: "仅国内使用，无需GDPR合规，可将资源投入到更有价值的功能",
      },
      {
        id: "zero-trust-architecture",
        name: "零信任架构",
        category: "安全合规",
        domesticRelevance: "important", // 保持重要性
        actualPriority: "short-term", // 从immediate调整
        costBenefit: "high", // 安全仍然重要
        implementationComplexity: "complex",
        userImpact: "high",
        complianceRequirement: "recommended",
        adjustedEffort: 25, // 从40人天减少到25人天
        justification: "小范围使用可以采用轻量级零信任方案，重点保护核心资产",
      },
      {
        id: "cybersecurity-law-compliance",
        name: "网络安全法合规",
        category: "安全合规",
        domesticRelevance: "critical", // 新增：国内必须
        actualPriority: "immediate", // 最高优先级
        costBenefit: "high",
        implementationComplexity: "moderate",
        userImpact: "high",
        complianceRequirement: "mandatory",
        adjustedEffort: 20,
        justification: "国内应用必须符合《网络安全法》《数据安全法》《个人信息保护法》要求",
      },
      {
        id: "data-security-law-compliance",
        name: "数据安全法合规",
        category: "数据治理",
        domesticRelevance: "critical", // 新增：国内必须
        actualPriority: "immediate",
        costBenefit: "high",
        implementationComplexity: "moderate",
        userImpact: "high",
        complianceRequirement: "mandatory",
        adjustedEffort: 18,
        justification: "数据分类分级、重要数据保护等是法律强制要求",
      },
      {
        id: "pipl-compliance",
        name: "个人信息保护法合规",
        category: "数据治理",
        domesticRelevance: "critical", // 新增：国内必须
        actualPriority: "immediate",
        costBenefit: "high",
        implementationComplexity: "moderate",
        userImpact: "high",
        complianceRequirement: "mandatory",
        adjustedEffort: 15,
        justification: "个人信息处理活动必须符合PIPL要求，避免法律风险",
      },
      {
        id: "simplified-monitoring",
        name: "简化监控系统",
        category: "运维管理",
        domesticRelevance: "important",
        actualPriority: "short-term",
        costBenefit: "high",
        implementationComplexity: "simple",
        userImpact: "high",
        complianceRequirement: "recommended",
        adjustedEffort: 8,
        justification: "小范围应用重点关注核心指标监控，避免过度复杂化",
      },
      {
        id: "basic-api-management",
        name: "基础API管理",
        category: "集成与API",
        domesticRelevance: "important",
        actualPriority: "medium-term",
        costBenefit: "medium",
        implementationComplexity: "simple",
        userImpact: "medium",
        complianceRequirement: "optional",
        adjustedEffort: 12, // 从30人天大幅减少
        justification: "小范围使用采用轻量级API管理方案即可满足需求",
      },
      {
        id: "user-experience-optimization",
        name: "用户体验优化",
        category: "用户体验",
        domesticRelevance: "important",
        actualPriority: "short-term",
        costBenefit: "high",
        implementationComplexity: "moderate",
        userImpact: "high",
        complianceRequirement: "optional",
        adjustedEffort: 15,
        justification: "小范围用户群体，优化体验可以显著提升满意度和使用效率",
      },
      {
        id: "domestic-integration",
        name: "国产化集成",
        category: "集成与API",
        domesticRelevance: "important",
        actualPriority: "medium-term",
        costBenefit: "medium",
        implementationComplexity: "moderate",
        userImpact: "medium",
        complianceRequirement: "recommended",
        adjustedEffort: 12,
        justification: "集成国产数据库、中间件等，提升系统自主可控性",
      },
    ]
  }

  /**
   * 获取调整后的优先级排序
   */
  getAdjustedPriorities(): {
    immediate: DomesticFeatureAnalysis[]
    shortTerm: DomesticFeatureAnalysis[]
    mediumTerm: DomesticFeatureAnalysis[]
    longTerm: DomesticFeatureAnalysis[]
    skip: DomesticFeatureAnalysis[]
  } {
    return {
      immediate: this.features.filter((f) => f.actualPriority === "immediate"),
      shortTerm: this.features.filter((f) => f.actualPriority === "short-term"),
      mediumTerm: this.features.filter((f) => f.actualPriority === "medium-term"),
      longTerm: this.features.filter((f) => f.actualPriority === "long-term"),
      skip: this.features.filter((f) => f.actualPriority === "skip"),
    }
  }

  /**
   * 计算调整后的总工作量
   */
  getAdjustedEffortSummary(): {
    totalEffort: number
    effortByPriority: { [priority: string]: number }
    costSavings: number
    focusAreas: string[]
  } {
    const totalEffort = this.features
      .filter((f) => f.actualPriority !== "skip")
      .reduce((sum, f) => sum + f.adjustedEffort, 0)

    const effortByPriority = {
      immediate: this.features
        .filter((f) => f.actualPriority === "immediate")
        .reduce((sum, f) => sum + f.adjustedEffort, 0),
      shortTerm: this.features
        .filter((f) => f.actualPriority === "short-term")
        .reduce((sum, f) => sum + f.adjustedEffort, 0),
      mediumTerm: this.features
        .filter((f) => f.actualPriority === "medium-term")
        .reduce((sum, f) => sum + f.adjustedEffort, 0),
    }

    // 原始总工作量约200人天，现在约105人天
    const costSavings = 200 - totalEffort

    const focusAreas = ["国内法律法规合规", "核心安全防护", "用户体验优化", "简化运维管理", "国产化适配"]

    return {
      totalEffort,
      effortByPriority,
      costSavings,
      focusAreas,
    }
  }

  /**
   * 生成国内化实施建议
   */
  getDomesticImplementationAdvice(): {
    keyPrinciples: string[]
    quickWins: string[]
    riskMitigation: string[]
    resourceOptimization: string[]
  } {
    return {
      keyPrinciples: [
        "优先满足国内法律法规要求，确保合规运营",
        "采用轻量级方案，避免过度工程化",
        "重点关注用户体验和核心功能稳定性",
        "逐步推进，确保业务连续性",
        "考虑国产化替代方案，提升自主可控性",
      ],
      quickWins: [
        "实施基础的网络安全法合规措施（2周内完成）",
        "优化核心用户界面和交互流程（3周内完成）",
        "建立简化的监控和告警机制（2周内完成）",
        "完善个人信息保护相关功能（4周内完成）",
      ],
      riskMitigation: [
        "法律合规风险：优先实施三大法律要求的合规措施",
        "技术债务风险：采用渐进式重构，避免大规模改动",
        "用户体验风险：小范围试点，收集反馈后推广",
        "资源投入风险：聚焦核心功能，暂缓非必要特性",
      ],
      resourceOptimization: [
        "复用现有技术栈，减少学习成本",
        "采用开源方案，降低许可成本",
        "外包非核心功能开发，专注核心业务",
        "建立知识库，提升团队效率",
      ],
    }
  }
}

export const domesticAnalyzer = new DomesticComplianceAnalyzer()
