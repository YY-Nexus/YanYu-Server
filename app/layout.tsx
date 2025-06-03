import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YYC³-Nettcak AI协同平台",
  description: "企业级多AI模型协作与安全审计系统，为您提供最先进的人工智能解决方案",
  keywords: "AI协同, 企业安全, 模型协作, 安全审计, 监控系统",
  authors: [{ name: "YYC³-Nettcak Team" }],
  creator: "YYC³-Nettcak",
  publisher: "YYC³-Nettcak",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "YYC³-Nettcak AI协同平台",
    description: "企业级多AI模型协作与安全审计系统",
    url: "https://yanyuyun.asia/",
    siteName: "YYC³-Nettcak AI协同平台",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YYC³-Nettcak AI协同平台",
    description: "企业级多AI模型协作与安全审计系统",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  category: "technology",
  metadataBase: new URL("https://yanyuyun.asia"),
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
