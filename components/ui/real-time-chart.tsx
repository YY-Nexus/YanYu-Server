"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DataPoint {
  timestamp: number
  value: number
  label?: string
}

interface RealTimeChartProps {
  title: string
  description?: string
  data: DataPoint[]
  maxPoints?: number
  color?: string
  height?: number
  showGrid?: boolean
  showLabels?: boolean
  unit?: string
}

export function RealTimeChart({
  title,
  description,
  data,
  maxPoints = 50,
  color = "#3b82f6",
  height = 200,
  showGrid = true,
  showLabels = true,
  unit = "",
}: RealTimeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height })

  // 响应式尺寸调整
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width: rect.width - 32, height }) // 减去padding
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [height])

  // 绘制图表
  useEffect(() => {
    if (!canvasRef.current || !data.length || !dimensions.width) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    canvas.width = dimensions.width * window.devicePixelRatio
    canvas.height = dimensions.height * window.devicePixelRatio
    canvas.style.width = `${dimensions.width}px`
    canvas.style.height = `${dimensions.height}px`
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // 清空画布
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // 计算绘图区域
    const padding = { top: 20, right: 20, bottom: 40, left: 60 }
    const chartWidth = dimensions.width - padding.left - padding.right
    const chartHeight = dimensions.height - padding.top - padding.bottom

    // 获取最新数据点
    const recentData = data.slice(-maxPoints)
    if (recentData.length < 2) return

    // 计算数据范围
    const values = recentData.map((d) => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue || 1

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1

      // 水平网格线
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(padding.left + chartWidth, y)
        ctx.stroke()
      }

      // 垂直网格线
      for (let i = 0; i <= 10; i++) {
        const x = padding.left + (chartWidth / 10) * i
        ctx.beginPath()
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, padding.top + chartHeight)
        ctx.stroke()
      }
    }

    // 绘制数据线
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    recentData.forEach((point, index) => {
      const x = padding.left + (chartWidth / (recentData.length - 1)) * index
      const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // 绘制数据点
    ctx.fillStyle = color
    recentData.forEach((point, index) => {
      const x = padding.left + (chartWidth / (recentData.length - 1)) * index
      const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    // 绘制标签
    if (showLabels) {
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"

      // Y轴标签
      for (let i = 0; i <= 5; i++) {
        const value = minValue + (valueRange / 5) * (5 - i)
        const y = padding.top + (chartHeight / 5) * i
        ctx.textAlign = "right"
        ctx.fillText(`${value.toFixed(1)}${unit}`, padding.left - 10, y + 4)
      }

      // X轴标签（时间）
      const timeStep = Math.max(1, Math.floor(recentData.length / 5))
      for (let i = 0; i < recentData.length; i += timeStep) {
        const point = recentData[i]
        const x = padding.left + (chartWidth / (recentData.length - 1)) * i
        const time = new Date(point.timestamp).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        })
        ctx.textAlign = "center"
        ctx.fillText(time, x, dimensions.height - 10)
      }
    }

    // 绘制最新值
    if (recentData.length > 0) {
      const latestPoint = recentData[recentData.length - 1]
      const x = padding.left + chartWidth
      const y = padding.top + chartHeight - ((latestPoint.value - minValue) / valueRange) * chartHeight

      // 高亮最新点
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()

      // 显示最新值
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`${latestPoint.value.toFixed(2)}${unit}`, x + 10, y + 5)
    }
  }, [data, dimensions, maxPoints, color, showGrid, showLabels, unit])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas ref={canvasRef} className="w-full border rounded" style={{ height: `${height}px` }} />
          {data.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">暂无数据</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
