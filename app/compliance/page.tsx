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
import { ComplianceDashboard } from "@/components/compliance/compliance-dashboard"

export default function CompliancePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        <ComplianceDashboard />
      </div>
    </MainLayout>
  )
}
