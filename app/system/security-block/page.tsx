"use client"

import type { Viewport } from "next"
import { MainLayout } from "@/components/layouts/main-layout"

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

export default function SecurityBlockPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">安全防护</h1>
        <p>安全防护页面内容</p>
      </div>
    </MainLayout>
  )
}
