"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Heart, Code, Github, Twitter, Mail, Globe, Shield, Zap } from "lucide-react"
import { LogoIcon } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="relative mt-16 glass-effect border-t border-white/20 backdrop-blur-md">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" />

      <div className="relative container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌标志区域 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <LogoIcon size="md" />
              <div>
                <h3 className="text-xl font-bold text-white">YYC³-Nettcak</h3>
                <p className="text-sm text-blue-200">AI协同平台</p>
              </div>
            </div>

            <p className="text-white/90 text-sm leading-relaxed max-w-md">
              企业级多AI模型协作与安全审计系统，为您提供最先进的人工智能解决方案。
              致力于打造安全、高效、智能的AI协作生态。
            </p>

            {/* 技术标签 */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                <Code className="h-3 w-3 mr-1" />
                Next.js 15
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                <Shield className="h-3 w-3 mr-1" />
                企业安全
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                <Zap className="h-3 w-3 mr-1" />
                AI驱动
              </Badge>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">快速导航</h4>
            <nav className="space-y-2">
              <Link href="/system/features" className="block text-blue-200 hover:text-white transition-colors text-sm">
                功能分析
              </Link>
              <Link href="/models" className="block text-blue-200 hover:text-white transition-colors text-sm">
                模型管理
              </Link>
              <Link
                href="/system/monitoring"
                className="block text-blue-200 hover:text-white transition-colors text-sm"
              >
                系统监控
              </Link>
              <Link href="/stream" className="block text-blue-200 hover:text-white transition-colors text-sm">
                流式处理
              </Link>
              <Link
                href="/system/integrations"
                className="block text-blue-200 hover:text-white transition-colors text-sm"
              >
                集成管理
              </Link>
            </nav>
          </div>

          {/* 联系方式 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">联系我们</h4>
            <div className="space-y-3">
              <a
                href="mailto:contact@yanyuyun.asia"
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>contact@yanyuyun.asia</span>
              </a>
              <a
                href="https://github.com/yanyuyun"
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/yanyuyun"
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors text-sm"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </a>
              <a
                href="https://yanyuyun.asia"
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors text-sm"
              >
                <Globe className="h-4 w-4" />
                <span>官方网站</span>
              </a>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* 底部版权信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <span>© 2025 YYC³-Nettcak AI协同平台</span>
            <span>•</span>
            <span>保留所有权利</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-white/80 text-sm">
              <span>用</span>
              <Heart className="h-4 w-4 text-red-400 fill-current pulse-glow" />
              <span>构建</span>
            </div>
            <Badge variant="outline" className="text-white border-white/30 bg-white/10">
              v1.0.0
            </Badge>
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
      </div>
    </footer>
  )
}
