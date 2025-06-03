"use client"

import { useEffect, useRef } from "react"

interface DiagramProps {
  strategy: "parallel" | "sequential" | "voting"
}

export function AIModelDiagram({ strategy }: DiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 设置样式
    ctx.font = "14px Arial"
    ctx.lineWidth = 2

    // 绘制不同策略的图表
    if (strategy === "parallel") {
      drawParallelDiagram(ctx, canvas.width, canvas.height)
    } else if (strategy === "sequential") {
      drawSequentialDiagram(ctx, canvas.width, canvas.height)
    } else if (strategy === "voting") {
      drawVotingDiagram(ctx, canvas.width, canvas.height)
    }
  }, [strategy])

  // 绘制并行策略图
  const drawParallelDiagram = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 输入节点
    ctx.fillStyle = "#f0f9ff"
    ctx.strokeStyle = "#0ea5e9"
    roundRect(ctx, 50, height / 2 - 25, 100, 50, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("输入", 85, height / 2 + 5)

    // 模型节点
    const modelY = [height / 2 - 80, height / 2, height / 2 + 80]

    for (let i = 0; i < 3; i++) {
      // 连接线
      ctx.strokeStyle = "#94a3b8"
      ctx.beginPath()
      ctx.moveTo(150, height / 2)
      ctx.lineTo(200, modelY[i])
      ctx.stroke()

      // 模型框
      ctx.fillStyle = "#f1f5f9"
      ctx.strokeStyle = "#64748b"
      roundRect(ctx, 200, modelY[i] - 25, 100, 50, 10, true, true)
      ctx.fillStyle = "#0f172a"
      ctx.fillText(`模型 ${i + 1}`, 230, modelY[i] + 5)

      // 输出连接线
      ctx.strokeStyle = "#94a3b8"
      ctx.beginPath()
      ctx.moveTo(300, modelY[i])
      ctx.lineTo(350, height / 2)
      ctx.stroke()
    }

    // 聚合节点
    ctx.fillStyle = "#ecfdf5"
    ctx.strokeStyle = "#10b981"
    roundRect(ctx, 350, height / 2 - 25, 100, 50, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("结果聚合", 370, height / 2 + 5)

    // 输出节点
    ctx.fillStyle = "#fef2f2"
    ctx.strokeStyle = "#ef4444"
    roundRect(ctx, 500, height / 2 - 25, 100, 50, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("输出", 535, height / 2 + 5)

    // 最后连接线
    ctx.strokeStyle = "#94a3b8"
    ctx.beginPath()
    ctx.moveTo(450, height / 2)
    ctx.lineTo(500, height / 2)
    ctx.stroke()
  }

  // 绘制顺序策略图
  const drawSequentialDiagram = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerY = height / 2
    const nodeWidth = 100
    const nodeHeight = 50
    const nodeSpacing = 50
    const startX = 50

    // 输入节点
    ctx.fillStyle = "#f0f9ff"
    ctx.strokeStyle = "#0ea5e9"
    roundRect(ctx, startX, centerY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("输入", startX + nodeWidth / 2 - 15, centerY + 5)

    // 模型节点
    const modelColors = [
      { fill: "#f1f5f9", stroke: "#64748b" },
      { fill: "#f1f5f9", stroke: "#64748b" },
      { fill: "#f1f5f9", stroke: "#64748b" },
    ]

    let currentX = startX + nodeWidth + nodeSpacing

    for (let i = 0; i < 3; i++) {
      // 连接线
      ctx.strokeStyle = "#94a3b8"
      ctx.beginPath()
      ctx.moveTo(currentX - nodeSpacing, centerY)
      ctx.lineTo(currentX, centerY)
      ctx.stroke()

      // 模型框
      ctx.fillStyle = modelColors[i].fill
      ctx.strokeStyle = modelColors[i].stroke
      roundRect(ctx, currentX, centerY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true)
      ctx.fillStyle = "#0f172a"
      ctx.fillText(`模型 ${i + 1}`, currentX + nodeWidth / 2 - 25, centerY + 5)

      currentX += nodeWidth + nodeSpacing
    }

    // 输出节点
    ctx.fillStyle = "#fef2f2"
    ctx.strokeStyle = "#ef4444"
    roundRect(ctx, currentX, centerY - nodeHeight / 2, nodeWidth, nodeHeight, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("输出", currentX + nodeWidth / 2 - 15, centerY + 5)

    // 最后连接线
    ctx.strokeStyle = "#94a3b8"
    ctx.beginPath()
    ctx.moveTo(currentX - nodeSpacing, centerY)
    ctx.lineTo(currentX, centerY)
    ctx.stroke()
  }

  // 绘制投票策略图
  const drawVotingDiagram = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 输入节点
    ctx.fillStyle = "#f0f9ff"
    ctx.strokeStyle = "#0ea5e9"
    roundRect(ctx, 50, height / 2 - 25, 100, 50, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("输入", 85, height / 2 + 5)

    // 模型节点
    const modelY = [height / 2 - 80, height / 2, height / 2 + 80]

    for (let i = 0; i < 3; i++) {
      // 连接线
      ctx.strokeStyle = "#94a3b8"
      ctx.beginPath()
      ctx.moveTo(150, height / 2)
      ctx.lineTo(200, modelY[i])
      ctx.stroke()

      // 模型框
      ctx.fillStyle = "#f1f5f9"
      ctx.strokeStyle = "#64748b"
      roundRect(ctx, 200, modelY[i] - 25, 100, 50, 10, true, true)
      ctx.fillStyle = "#0f172a"
      ctx.fillText(`模型 ${i + 1}`, 230, modelY[i] + 5)

      // 输出连接线
      ctx.strokeStyle = "#94a3b8"
      ctx.beginPath()
      ctx.moveTo(300, modelY[i])
      ctx.lineTo(350, height / 2)
      ctx.stroke()
    }

    // 投票节点
    ctx.fillStyle = "#fdf2f8"
    ctx.strokeStyle = "#ec4899"
    roundRect(ctx, 350, height / 2 - 25, 100, 50, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("投票选择", 370, height / 2 + 5)

    // 输出节点
    ctx.fillStyle = "#fef2f2"
    ctx.strokeStyle = "#ef4444"
    roundRect(ctx, 500, height / 2 - 25, 100, 50, 10, true, true)
    ctx.fillStyle = "#0f172a"
    ctx.fillText("输出", 535, height / 2 + 5)

    // 最后连接线
    ctx.strokeStyle = "#94a3b8"
    ctx.beginPath()
    ctx.moveTo(450, height / 2)
    ctx.lineTo(500, height / 2)
    ctx.stroke()
  }

  // 绘制圆角矩形
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean,
    stroke: boolean,
  ) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
    if (stroke) {
      ctx.stroke()
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={650}
      height={300}
      className="w-full h-auto border border-gray-200 rounded-md bg-white"
    />
  )
}
