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
import { MissingFeatureDetail } from "@/components/compliance/missing-features-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FeatureDetailPageProps {
  params: {
    featureId: string
  }
}

export default function FeatureDetailPage({ params }: FeatureDetailPageProps) {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href="/compliance">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回合规分析
            </Button>
          </Link>
        </div>

        <MissingFeatureDetail featureId={params.featureId} />
      </div>
    </MainLayout>
  )
}
