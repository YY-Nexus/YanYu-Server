/**
 * 合规性检查器
 * 基于国际标准和行业最佳实践
 */

export interface ComplianceStandard {
  id: string
  name: string
  description: string
  requirements: ComplianceRequirement[]
  applicableRegions: string[]
  industry: string[]
}

export interface ComplianceRequirement {
  id: string
  title: string
  description: string
  category: string
  mandatory: boolean
  implementationStatus: "compliant" | "partial" | "non-compliant" | "not-applicable"
  evidence: string[]
  gaps: string[]
  remediation: string[]
}

export class ComplianceChecker {
  private standards: ComplianceStandard[] = []

  constructor() {
    this.initializeStandards()
  }

  private initializeStandards(): void {
    this.standards = [
      {
        id: "gdpr",
        name: "GDPR - 通用数据保护条例",
        description: "欧盟通用数据保护条例合规要求",
        applicableRegions: ["EU", "EEA"],
        industry: ["all"],
        requirements: [
          {
            id: "gdpr-consent",
            title: "用户同意机制",
            description: "明确的用户数据处理同意机制",
            category: "数据保护",
            mandatory: true,
            implementationStatus: "partial",
            evidence: ["用户注册流程", "隐私政策"],
            gaps: ["缺少细粒度同意选项", "同意撤回机制不完善"],
            remediation: ["实施同意管理平台", "添加数据处理目的选择"],
          },
          {
            id: "gdpr-data-portability",
            title: "数据可携带权",
            description: "用户有权获取和转移其个人数据",
            category: "用户权利",
            mandatory: true,
            implementationStatus: "non-compliant",
            evidence: [],
            gaps: ["缺少数据导出功能", "无标准化数据格式"],
            remediation: ["开发数据导出API", "实施标准数据格式"],
          },
          {
            id: "gdpr-right-to-be-forgotten",
            title: "被遗忘权",
            description: "用户有权要求删除其个人数据",
            category: "用户权利",
            mandatory: true,
            implementationStatus: "partial",
            evidence: ["账户删除功能"],
            gaps: ["数据删除不彻底", "缺少删除确认机制"],
            remediation: ["实施深度数据清理", "添加删除审计日志"],
          },
        ],
      },
      {
        id: "iso27001",
        name: "ISO 27001 - 信息安全管理",
        description: "国际信息安全管理标准",
        applicableRegions: ["global"],
        industry: ["technology", "finance", "healthcare"],
        requirements: [
          {
            id: "iso27001-risk-assessment",
            title: "风险评估",
            description: "定期进行信息安全风险评估",
            category: "风险管理",
            mandatory: true,
            implementationStatus: "partial",
            evidence: ["安全审计功能"],
            gaps: ["缺少自动化风险评估", "风险评估频率不足"],
            remediation: ["实施自动化风险评估工具", "建立定期评估流程"],
          },
          {
            id: "iso27001-access-control",
            title: "访问控制",
            description: "基于角色的访问控制机制",
            category: "访问管理",
            mandatory: true,
            implementationStatus: "partial",
            evidence: ["用户认证系统", "权限管理"],
            gaps: ["缺少细粒度权限控制", "无定期权限审查"],
            remediation: ["实施RBAC系统", "建立权限审查流程"],
          },
        ],
      },
      {
        id: "soc2",
        name: "SOC 2 Type II",
        description: "服务组织控制报告",
        applicableRegions: ["US", "global"],
        industry: ["technology", "saas"],
        requirements: [
          {
            id: "soc2-security",
            title: "安全性",
            description: "保护系统免受未授权访问",
            category: "安全控制",
            mandatory: true,
            implementationStatus: "partial",
            evidence: ["防火墙", "入侵检测"],
            gaps: ["缺少零信任架构", "威胁检测能力不足"],
            remediation: ["实施零信任安全模型", "部署高级威胁检测"],
          },
          {
            id: "soc2-availability",
            title: "可用性",
            description: "系统和服务的可用性保证",
            category: "运营控制",
            mandatory: true,
            implementationStatus: "compliant",
            evidence: ["监控系统", "灾备方案"],
            gaps: [],
            remediation: [],
          },
        ],
      },
    ]
  }

  /**
   * 获取合规性评估报告
   */
  getComplianceReport(): {
    overallScore: number
    standardsCompliance: Array<{
      standard: ComplianceStandard
      score: number
      criticalGaps: ComplianceRequirement[]
    }>
    priorityActions: ComplianceRequirement[]
  } {
    const standardsCompliance = this.standards.map((standard) => {
      const score = this.calculateStandardScore(standard)
      const criticalGaps = standard.requirements.filter(
        (req) => req.mandatory && req.implementationStatus === "non-compliant",
      )

      return { standard, score, criticalGaps }
    })

    const overallScore = standardsCompliance.reduce((sum, item) => sum + item.score, 0) / standardsCompliance.length

    const priorityActions = this.standards
      .flatMap((standard) => standard.requirements)
      .filter((req) => req.mandatory && req.implementationStatus !== "compliant")
      .sort((a, b) => {
        const priorityOrder = { "non-compliant": 3, partial: 2, "not-applicable": 1 }
        return priorityOrder[b.implementationStatus] - priorityOrder[a.implementationStatus]
      })
      .slice(0, 10)

    return {
      overallScore,
      standardsCompliance,
      priorityActions,
    }
  }

  private calculateStandardScore(standard: ComplianceStandard): number {
    const requirements = standard.requirements
    if (requirements.length === 0) return 100

    let score = 0
    for (const req of requirements) {
      switch (req.implementationStatus) {
        case "compliant":
          score += 1
          break
        case "partial":
          score += 0.5
          break
        case "non-compliant":
          score += 0
          break
        case "not-applicable":
          // 不计入评分
          break
      }
    }

    const applicableRequirements = requirements.filter((req) => req.implementationStatus !== "not-applicable")
    return applicableRequirements.length > 0 ? (score / applicableRequirements.length) * 100 : 100
  }

  /**
   * 获取特定标准的详细信息
   */
  getStandardDetails(standardId: string): ComplianceStandard | null {
    return this.standards.find((standard) => standard.id === standardId) || null
  }

  /**
   * 获取所有标准
   */
  getAllStandards(): ComplianceStandard[] {
    return this.standards
  }
}

export const complianceChecker = new ComplianceChecker()
