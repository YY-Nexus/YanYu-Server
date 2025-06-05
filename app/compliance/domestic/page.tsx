"use client"

import type { Viewport } from "next"

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

import { MainLayout } from "@/components/layouts/main-layout"
import { DomesticComplianceDashboard } from "@/components/compliance/domestic-compliance-dashboard"

export default function DomesticCompliancePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">国内合规优化分析</h1>
          <p className="text-gray-600">基于国内小范围使用场景，重新评估功能优先级，聚焦法律合规和核心价值创造</p>
        </div>

        <DomesticComplianceDashboard />
      </div>
    </MainLayout>
  )
}
