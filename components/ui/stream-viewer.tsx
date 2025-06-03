"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Play, Square, RotateCcw, Download } from "lucide-react"
import type { StreamChunk } from "@/lib/ai/stream-processor"

interface StreamViewerProps {
  title: string
  description?: string
  onStart?: () => Promise<void>
  onStop?: () => void
  onReset?: () => void
  isStreaming?: boolean
  chunks?: StreamChunk[]
  progress?: number
  className?: string
}

export function StreamViewer({
  title,
  description,
  onStart,
  onStop,
  onReset,
  isStreaming = false,
  chunks = [],
  progress = 0,
  className,
}: StreamViewerProps) {
  const [content, setContent] = useState("")
  const [stats, setStats] = useState({
    totalChunks: 0,
    totalTime: 0,
    avgChunkSize: 0,
    streamRate: 0,
  })
  const contentRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(0)

  // 处理流式数据
  useEffect(() => {
    if (!chunks.length) {
      setContent("")
      setStats({
        totalChunks: 0,
        totalTime: 0,
        avgChunkSize: 0,
        streamRate: 0,
      })
      return
    }

    let newContent = ""
    let totalChunks = 0
    let totalTime = 0

    for (const chunk of chunks) {
      if (chunk.type === "text-delta") {
        newContent += chunk.content
        totalChunks++
      } else if (chunk.type === "done") {
        totalTime = chunk.metadata?.totalTime || 0
      }
    }

    setContent(newContent)

    // 计算统计信息
    const avgChunkSize = newContent.length / totalChunks || 0
    const streamRate = totalTime > 0 ? (newContent.length / totalTime) * 1000 : 0 // 字符/秒

    setStats({
      totalChunks,
      totalTime,
      avgChunkSize,
      streamRate,
    })

    // 自动滚动到底部
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [chunks])

  // 开始流式处理
  const handleStart = async () => {
    if (onStart) {
      startTimeRef.current = Date.now()
      await onStart()
    }
  }

  // 停止流式处理
  const handleStop = () => {
    if (onStop) {
      onStop()
    }
  }

  // 重置
  const handleReset = () => {
    setContent("")
    setStats({
      totalChunks: 0,
      totalTime: 0,
      avgChunkSize: 0,
      streamRate: 0,
    })
    if (onReset) {
      onReset()
    }
  }

  // 导出内容
  const handleExport = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `stream-output-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{title}</span>
              {isStreaming && (
                <Badge variant="secondary" className="animate-pulse">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  流式处理中
                </Badge>
              )}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleStart} disabled={isStreaming}>
              <Play className="h-4 w-4 mr-1" />
              开始
            </Button>
            <Button variant="outline" size="sm" onClick={handleStop} disabled={!isStreaming}>
              <Square className="h-4 w-4 mr-1" />
              停止
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isStreaming}>
              <RotateCcw className="h-4 w-4 mr-1" />
              重置
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!content}>
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 进度条 */}
        {isStreaming && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>处理进度</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <Progress value={progress * 100} />
          </div>
        )}

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-semibold">{stats.totalChunks}</div>
            <div className="text-muted-foreground">数据块</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-semibold">{stats.totalTime}ms</div>
            <div className="text-muted-foreground">总时间</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-semibold">{stats.avgChunkSize.toFixed(1)}</div>
            <div className="text-muted-foreground">平均块大小</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-semibold">{stats.streamRate.toFixed(1)}</div>
            <div className="text-muted-foreground">字符/秒</div>
          </div>
        </div>

        {/* 内容显示区域 */}
        <div
          ref={contentRef}
          className="bg-muted p-4 rounded-md min-h-[300px] max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap"
        >
          {content || (
            <span className="text-muted-foreground">
              {isStreaming ? "等待流式数据..." : "点击开始按钮开始流式处理"}
            </span>
          )}
          {isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
        </div>

        {/* 流式状态指示器 */}
        {chunks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chunks.slice(-10).map((chunk, index) => (
              <Badge
                key={index}
                variant={
                  chunk.type === "text-delta"
                    ? "default"
                    : chunk.type === "error"
                      ? "destructive"
                      : chunk.type === "done"
                        ? "secondary"
                        : "outline"
                }
                className="text-xs"
              >
                {chunk.type}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
