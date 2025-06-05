"use client"

import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  href?: string
}

export function Logo({ size = "md", showText = true, className = "", href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const LogoContent = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        {/* 3D LOGO图片 */}
        <div className={`${sizeClasses[size]} relative overflow-hidden rounded-xl shadow-lg`}>
          <Image
            src="/images/logo.png"
            alt="YYC³ NetTrack Logo"
            width={80}
            height={80}
            className="w-full h-full object-contain"
            priority
          />
          {/* 渐变光效覆盖层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-xl" />
        </div>

        {/* 发光效果 */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-lg opacity-30 -z-10`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold rainbow-text leading-tight`}>YYC³ NetTrack</h1>
          <p
            className={`text-blue-600/80 font-medium ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}`}
          >
            AI协同平台
          </p>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="group transition-transform hover:scale-105">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}

// 简化版LOGO，仅图标
export function LogoIcon({ size = "md", className = "" }: Pick<LogoProps, "size" | "className">) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-xl shadow-lg`}>
        <Image
          src="/images/logo.png"
          alt="YYC³ NetTrack"
          width={80}
          height={80}
          className="w-full h-full object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-xl" />
      </div>
      <div
        className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-lg opacity-30 -z-10`}
      />
    </div>
  )
}
